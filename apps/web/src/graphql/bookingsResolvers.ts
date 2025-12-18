import { prisma } from '@/server/prisma'
import { requireAdmin } from './auth'

const OPEN_HOUR = 9
const CLOSE_HOUR = 17
const SLOT_STEP_MIN = 15

function toLocalDateTime(dateYYYYMMDD: string, hours: number, minutes: number) {
  return new Date(`${dateYYYYMMDD}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`)
}

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && aEnd > bStart
}

export const bookingsResolvers = {
  Query: {
    availableSlots: async (
      _: unknown,
      { serviceId, date }: { serviceId: string; date: string }
    ) => {
      // 1) fetch service once
      const service = await prisma.service.findUnique({ where: { id: serviceId } })
      if (!service || !service.isActive) throw new Error('Invalid service')

      // booking windows for the day (business hours)
      const dayStart = toLocalDateTime(date, OPEN_HOUR, 0)
      const dayEnd = toLocalDateTime(date, CLOSE_HOUR, 0)

      const durationMs = service.durationM * 60 * 1000
      const stepMs = SLOT_STEP_MIN * 60 * 1000

      // if service doesn't fit into the working day, return none
      if (dayStart.getTime() + durationMs > dayEnd.getTime()) return []

      // 2) fetch all bookings for that day in ONE query
      const bookings = await prisma.booking.findMany({
        where: {
          serviceId,
          status: 'CONFIRMED',
          AND: [
            { startAt: { lt: dayEnd } },  // booking starts before closing
            { endAt: { gt: dayStart } },  // booking ends after opening
          ],
        },
        select: { startAt: true, endAt: true },
        orderBy: { startAt: 'asc' },
      })

      const slots: string[] = []

      let i = 0

      for (
        let t = dayStart.getTime();
        t + durationMs <= dayEnd.getTime();
        t += stepMs
      ) {
        const slotStart = new Date(t)
        const slotEnd = new Date(t + durationMs)

        while (i < bookings.length && bookings[i].endAt <= slotStart) i++

        let blocked = false
        for (let j = i; j < bookings.length; j++) {
          if (bookings[j].startAt >= slotEnd) break

          if (overlaps(slotStart, slotEnd, bookings[j].startAt, bookings[j].endAt)) {
            blocked = true
            break
          }
        }

        if (!blocked) slots.push(slotStart.toISOString())
      }

      return slots
    },
    bookings: async (_: unknown, _args:unknown, ctx: any) => {
      requireAdmin(ctx.request)
      const bookins = await prisma.booking.findMany()

      return bookins
    }
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
    cancelBooking: async (_: unknown, { id }: { id: string }, ctx: any) => {
      requireAdmin(ctx.request)
      const booking = await prisma.booking.findUnique({ where: { id } })
      if (!booking) throw new Error('Booking not found')

      return prisma.booking.update({
        where: { id },
        data: { status: 'CANCELLED' },
        include: { service: true },
      })
    },

  },
  Booking: {
    service: (parent: any) =>
      prisma.service.findUnique({ where: { id: parent.serviceId } }),
  },
}
