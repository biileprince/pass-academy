const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex === -1) return;
    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();
    if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  });
}

loadEnvFile(path.join(process.cwd(), ".env"));
loadEnvFile(path.join(process.cwd(), ".env.local"));

const prisma = new PrismaClient();

const SEED_USERS = [
  { name: "Admin User", email: "admin@pasacademy.com", role: "ADMIN" },
  { name: "Mentor One", email: "mentor1@pasacademy.com", role: "MENTOR" },
  { name: "Mentor Two", email: "mentor2@pasacademy.com", role: "MENTOR" },
];

async function main() {
  const plainPassword = process.env.SEED_PASSWORD || "Pass@1234";
  const hashedPassword = await bcrypt.hash(plainPassword, 12);

  for (const user of SEED_USERS) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, role: user.role },
      create: {
        name: user.name,
        email: user.email,
        role: user.role,
        password: hashedPassword,
      },
    });
  }

  console.log("Seeded users:");
  SEED_USERS.forEach((user) => {
    console.log(`- ${user.email} (${user.role})`);
  });
  console.log(`Password: ${plainPassword}`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
