import prisma from "../src/config/db.js";

// Fix: DB stored "ADMIN" uppercase — normalize to lowercase to match all code checks
const result = await prisma.user.update({
  where: { email: "admin2@test.com" },
  data: { role: "admin" },
  select: { email: true, role: true, isOnboarded: true },
});
console.log("Fixed admin user:", result);
await prisma.$disconnect();
