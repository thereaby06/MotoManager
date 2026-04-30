const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const workshop = await prisma.workshop.upsert({
    where: { id: "seed-workshop" },
    update: {},
    create: { id: "seed-workshop", name: "MotoManager Demo Workshop" },
  });

  const password = await bcrypt.hash("Admin123*", 10);
  await prisma.user.upsert({
    where: { email: "owner@motomanager.com" },
    update: {},
    create: {
      email: "owner@motomanager.com",
      password,
      fullName: "Owner Demo",
      role: "OWNER",
      workshopId: workshop.id,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
