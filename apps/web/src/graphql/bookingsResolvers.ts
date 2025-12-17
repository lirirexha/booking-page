import { prisma } from '@/server/prisma'

export const bookingsResolvers = {
  Query: {
    availableSlots: async (_: unknown, { serviceId, date }: { serviceId: string, date: string }) => {
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)

      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      const service = await prisma.service.findUnique({ where: { id: serviceId } })
      if (!service) throw new Error('Service not found')

      const availableSlots = []
      let currentSlot = new Date(startOfDay)

      const slotDuration = service.durationM * 60000

      while (currentSlot <= endOfDay) {
        const endSlot = new Date(currentSlot.getTime() + slotDuration)

        const isBooked = await prisma.booking.findFirst({
          where: {
            serviceId: serviceId,
            startAt: { lt: endSlot },
            endAt: { gt: currentSlot },
            status: 'CONFIRMED',
          },
        })

        if (!isBooked) {
          availableSlots.push(currentSlot.toISOString())
        }

        currentSlot = new Date(currentSlot.getTime() + slotDuration)
      }

      return availableSlots
    },
  },
  Mutation: {
    createBooking: async (_: unknown, args: any) => {
      const input = args.input

      const service = await prisma.service.findUnique({
        where: { id: input.serviceId },
      })
      if (!service || !service.isActive) throw new Error('Invalid service')

      const startAt = new Date(input.startAt)
      if (Number.isNaN(startAt.getTime())) throw new Error('Invalid startAt')

      const endAt = new Date(startAt.getTime() + service.durationM * 60 * 1000)

      const overlapping = await prisma.booking.findFirst({
        where: {
          status: 'CONFIRMED',
          AND: [{ startAt: { lt: endAt } }, { endAt: { gt: startAt } }],
        },
      })
      if (overlapping) throw new Error('Slot already booked')

      return prisma.booking.create({
        data: {
          serviceId: input.serviceId,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          startAt,
          endAt,
        },
        include: { service: true },
      })
    },
  },
  Booking: {
    service: (parent: any) =>
      prisma.service.findUnique({ where: { id: parent.serviceId } }),
  },
}
