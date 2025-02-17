import { ClerkAddMetaData, ClerkFetchUser } from "../helpers/clerk-fetch-user";

export async function resetUsageIfNeeded(userId: string): Promise<void> {
  // Fetch the user's metadata
  const { privateMetadata } = await ClerkFetchUser();
  const metadata = privateMetadata || {};
  // Use last_reset_timestamp if available, otherwise fall back to created_account_timestamp
  const timestamp =
    metadata.last_reset_timestamp || metadata.created_account_timestamp;

  if (!timestamp || typeof timestamp !== "string") {
    // No valid timestamp available, so we don't reset anything.

    return;
  }

  // Parse the timestamp into a Date object
  const lastResetDate = new Date(timestamp);
  if (isNaN(lastResetDate.getTime())) {
    // The timestamp is not a valid date.

    return;
  }

  const now = new Date();
  // Calculate the difference in days between now and the last reset date
  const diffInDays = Math.floor(
    (now.getTime() - lastResetDate.getTime()) / (1000 * 3600 * 24)
  );

  if (diffInDays >= 30) {
    // 30 or more days have passed: reset the API call count and update the last reset timestamp.

    await ClerkAddMetaData({
      last_reset_timestamp: now.toISOString(),
      api_call_count: 0,
    });
    console.log(
      `Reset API call count for user ${userId} after ${diffInDays} days.`
    );
  }
}
