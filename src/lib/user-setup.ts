import type { Prisma, PrismaClient } from "@prisma/client";
import { startOfDay } from "@/lib/utils";

type DbClient = PrismaClient | Prisma.TransactionClient;

/**
 * Provisions default records for a newly created user account.
 */
export async function createUserDefaults(
  db: DbClient,
  userId: string
): Promise<void> {
  const today = startOfDay();

  await db.profile.create({
    data: { userId },
  });

  await db.notificationPreference.create({
    data: { userId },
  });

  await db.statistic.create({
    data: {
      userId,
      date: today,
    },
  });
}
