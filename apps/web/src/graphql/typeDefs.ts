export const typeDefs = /* GraphQL */ `
  type Service {
    id: ID!
    name: String!
    durationM: Int!
    price: Int
    isActive: Boolean!
  }

  type Booking {
    id: ID!
    serviceId: ID!
    customerName: String!
    customerEmail: String!
    customerPhone: String
    startAt: String!
    endAt: String!
    status: String!
    service: Service!
  }

  input CreateBookingInput {
    serviceId: ID!
    customerName: String!
    customerEmail: String!
    customerPhone: String
    startAt: String!
  }

  type Query {
    services: [Service!]!
    availableSlots(serviceId: ID!, date: String!): [String!]!
    bookings: [Booking!]
  }

  type Mutation {
    createBooking(input: CreateBookingInput!): Booking!
    cancelBooking(id: ID!): Booking!
  }

`
