import { prisma } from '@/server/prisma'

export const servicesResolvers = {
  Query: {
    services: () =>
      prisma.service.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      }),
  },
}
