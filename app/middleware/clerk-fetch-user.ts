"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

export default async function ClerkFetchUser() {
  const user = await currentUser();
  const { userId } = await auth();

  if (!user) return { user: null, userId: null };

  return {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.emailAddresses[0]?.emailAddress || "",
      profileImage: user.imageUrl,
    },
    userId,
  };
}

