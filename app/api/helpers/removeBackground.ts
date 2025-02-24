"use server";
import {
  ClerkAddMetaData,
  ClerkFetchUser,
} from "@/api/helpers/clerk-fetch-user";
import { RemoveBackgroundProps } from "@/middleware/clerk-component-type";
import { resetUsageIfNeeded } from "../utils/subscriptionUtils";
import { permanentRedirect } from "next/navigation";

export const handleBackgroundRemoval = async ({
  preview,
  fileName,
  assignUrlLink,
}: RemoveBackgroundProps) => {
  if (!preview) {
    console.error("No file selected");
    return;
  }

  // If user doesnt excist fetch
  const { userId, privateMetadata } = await ClerkFetchUser();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/background-removal`,
    {
      method: "POST",
      body: JSON.stringify({
        image_url: assignUrlLink,
        userId,
        privateMetadata,
      }),
    }
  );

  const data = await res.json();

  if (!data?.imagePathDownload?.data?.id) return { error: "No Image Id Found" };

  return data?.imagePathDownload?.data?.id;
};

export const validateSubscription = async ({
  preview,
  fileName,
  assignUrlLink,
}: RemoveBackgroundProps) => {
  const { userId, user, privateMetadata } = await ClerkFetchUser();
  const apiCallCount = privateMetadata?.api_call_count as number;

  await resetUsageIfNeeded(userId as string);

  if (!userId && !privateMetadata?.subscription_type) {
    const processedImage = await handleBackgroundRemoval({
      preview,
      fileName,
      assignUrlLink,
    });

    return processedImage;
  }

  if (user?.id && privateMetadata?.subscription_type === "Free") {
    if (apiCallCount >= 20) {
      return {
        error:
          "Free API limit reached. Please wait until your monthly limit resets or upgrade to Pro.",
      };
    }
    const processedImage = await handleBackgroundRemoval({
      preview,
      fileName,
      assignUrlLink,
    });
    if (!processedImage?.error) {
      await ClerkAddMetaData({ api_call_count: apiCallCount + 1 });
    }

    return processedImage;
  }

  if (user?.id && privateMetadata?.subscription_type === "Pro") {
    if (apiCallCount >= 100) {
      return {
        error:
          "Pro API limit reached. Please wait until your monthly limit resets or upgrade to Pro.",
      };
    }

    const processedImage = await handleBackgroundRemoval({
      preview,
      fileName,
      assignUrlLink,
    });
    if (!processedImage?.error) {
      await ClerkAddMetaData({ api_call_count: apiCallCount + 1 });
    }
    return processedImage;
  }
};

export const getBackgroundRemovalImage = async (slug: number) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/retrieve-removed-image/${slug}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const { data } = await response.json();

    return {
      status: data?.data?.status,
      result: data?.data?.result?.output_object?.tmp_url,
    };
  } catch (error) {
    console.error("Error fetching image:", error);
  }
};

export const uploadImageToS3 = async (
  preview: string,
  fileName: string | null
) => {
  const response = await fetch(preview);
  const blob = await response.blob();
  const file = new File([blob], fileName || "image.png", {
    type: blob.type,
  });

  const formData = new FormData();
  formData.append("file", file);

  const uploadRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!uploadRes?.ok) throw new Error("Upload failed");
  const uploadData = await uploadRes.json();
  const storedImageUrl = uploadData.publicUrl; // Use returned URL

  return storedImageUrl;
};
