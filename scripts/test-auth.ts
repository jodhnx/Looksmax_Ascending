/**
 * Auth system verification script.
 * Run: npm run test:auth
 *
 * Requires DATABASE_URL in environment (.env loaded automatically by Prisma).
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { registerSchema, loginSchema } from "../src/lib/validations/auth";
import { createUserDefaults } from "../src/lib/user-setup";

const prisma = new PrismaClient();

const TEST_EMAIL = `test-auth-${Date.now()}@ascend-ai.test`;
const TEST_PASSWORD = "TestPass123";
const TEST_NAME = "Auth Test User";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ ${message}`);
    failed++;
  }
}

async function cleanup(userId?: string) {
  if (!userId) return;
  await prisma.user.delete({ where: { id: userId } }).catch(() => {});
}

async function main() {
  console.log("\nASCEND AI — Auth System Tests\n");

  // 1. Validation
  console.log("1. Input validation");
  const validRegister = registerSchema.safeParse({
    name: TEST_NAME,
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });
  assert(validRegister.success, "Valid registration input passes");

  const weakPassword = registerSchema.safeParse({
    name: TEST_NAME,
    email: TEST_EMAIL,
    password: "short",
  });
  assert(!weakPassword.success, "Weak password rejected");

  const invalidEmail = registerSchema.safeParse({
    name: TEST_NAME,
    email: "not-an-email",
    password: TEST_PASSWORD,
  });
  assert(!invalidEmail.success, "Invalid email rejected");

  const emptyLogin = loginSchema.safeParse({ email: "", password: "" });
  assert(!emptyLogin.success, "Empty login fields rejected");

  // 2. User creation with defaults
  console.log("\n2. User creation & provisioning");
  let userId: string | undefined;

  try {
    const hashed = await bcrypt.hash(TEST_PASSWORD, 12);
    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          name: TEST_NAME,
          email: TEST_EMAIL,
          password: hashed,
          onboardingComplete: false,
        },
      });
      await createUserDefaults(tx, created.id);
      return created;
    });
    userId = user.id;

    assert(!!user.id, "User created in database");

    const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
    assert(!!profile, "Profile created for new user");

    const settings = await prisma.notificationPreference.findUnique({
      where: { userId: user.id },
    });
    assert(!!settings, "Notification settings created for new user");

    const stats = await prisma.statistic.findFirst({ where: { userId: user.id } });
    assert(!!stats, "Statistics record created for new user");

    // 3. Duplicate email
    console.log("\n3. Duplicate email prevention");
    let duplicateBlocked = false;
    try {
      await prisma.user.create({
        data: { name: "Dup", email: TEST_EMAIL, password: hashed },
      });
    } catch {
      duplicateBlocked = true;
    }
    assert(duplicateBlocked, "Duplicate email rejected by database");

    // 4. Password hashing
    console.log("\n4. Password security");
    const match = await bcrypt.compare(TEST_PASSWORD, hashed);
    assert(match, "Bcrypt password verifies correctly");
    const noMatch = await bcrypt.compare("WrongPassword1", hashed);
    assert(!noMatch, "Wrong password does not verify");

    // 5. Email normalization
    console.log("\n5. Email normalization");
    const normalized = registerSchema.parse({
      name: TEST_NAME,
      email: `  ${TEST_EMAIL.toUpperCase()}  `,
      password: TEST_PASSWORD,
    });
    assert(normalized.email === TEST_EMAIL.toLowerCase(), "Email normalized to lowercase");

    console.log("\n--- Results ---");
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);

    await cleanup(userId);

    if (failed > 0) {
      process.exit(1);
    }
    console.log("\nAll auth tests passed.\n");
  } catch (error) {
    console.error("\nTest run failed:", error);
    await cleanup(userId);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
