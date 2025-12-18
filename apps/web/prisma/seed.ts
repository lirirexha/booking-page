import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.service.createMany({
    data: [
      { name: 'Consultation', durationM: 30, price: 3000 },
      { name: 'Follow-up', durationM: 15, price: 1500 },
      { name: 'Therapy Session', durationM: 60, price: 6000 },
    ],
    skipDuplicates: true,
  })
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
