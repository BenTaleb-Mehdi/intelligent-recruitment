import { auth } from "../src/lib/auth.js";
import prisma from "../src/config/db.js";

async function seedAdmin() {
  const result = await auth.api.signUpEmail({
    body: {
      email: "admin2@test.com",
      password: "AdminPass123!",
      name: "Admin",
    },
  });

  console.log("User created:", result);

  await prisma.user.update({
    where: { email: "admin2@test.com" },
    data: { role: "admin", isOnboarded: true },
  });

  console.log("Promoted to admin !");
}

seedAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());