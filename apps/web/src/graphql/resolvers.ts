import { servicesResolvers } from './servicesResolvers'
import { bookingsResolvers } from './bookingsResolvers'

export const resolvers = {
  Query: {
    ...servicesResolvers.Query,
    ...bookingsResolvers.Query,
  },
  Mutation: {
    ...bookingsResolvers.Mutation,
  },
  Booking: {
    service: bookingsResolvers.Booking.service,
  },
}
