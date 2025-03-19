"use server";

import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";

export async function ClerkFetchUser() {
  const user = await currentUser();
  const client = await clerkClient();
  const { userId } = await auth();

  if (!user) return { user: null, userId: null };

  const { privateMetadata } = await client.users.getUser(user.id);
  return {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.emailAddresses[0]?.emailAddress || "",
      profileImage: user.imageUrl,
    },
    userId,
    privateMetadata,
  };
}

export async function ClerkAddMetaData(props?: any) {
  const user = await currentUser();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/created-free-user`,
      {
        method: "POST",
        body: JSON.stringify({ userId: user?.id, ...props }),
      }
    );

    return res.json();
  } catch (error) {
    return error;
  }
}

export async function GetClerkUsers() {
  try {
    const client = await clerkClient();

    const { totalCount } = await client.users.getUserList();

    return totalCount;
  } catch (error) {
    return error;
  }
}
