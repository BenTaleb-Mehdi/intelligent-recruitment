import "dotenv/config";
import { auth } from "../src/lib/auth.js";
import prisma from "../src/config/db.js";

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin2@test.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "AdminPass123!";
  const adminName = process.env.ADMIN_NAME || "Admin";

  console.log(`Checking admin account for ${adminEmail}...`);

  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingUser) {
    console.log("Creating new user account...");
    const result = await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: adminName,
      },
    });
    console.log("User created:", result.user?.email || adminEmail);
  } else {
    console.log("User already exists. Updating role to ADMIN...");
  }

  await prisma.user.update({
    where: { email: adminEmail },
    data: { role: "ADMIN", isOnboarded: true },
  });

  console.log(`✅ Successfully seeded admin: ${adminEmail} with role ADMIN!`);
}

seedAdmin()
  .catch((err) => {
    console.error("❌ Error seeding admin:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });