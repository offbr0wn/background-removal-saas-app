"use server";

type RemoveBackgroundProps = {
  preview: string | null;
  fileName: string | null;
  assignUrlLink: string;
};

export const handleBackgroundRemoval = async ({
  preview,
  fileName,
  assignUrlLink,
}: RemoveBackgroundProps) => {
  if (!preview) {
    console.error("No file selected");
    return;
  }

  // Fetch
  const response = await fetch(preview);
  const blob = await response.blob();
  const file = new File([blob], fileName || "uploaded-image.png", {
    type: blob.type,
  });

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/background-removal`,
    {
      method: "POST",
      body: JSON.stringify({ image_url: assignUrlLink }),
    }
  );
  const data = await res.json();
  if (!data?.imagePathDownload?.data?.id) throw new Error("Processing failed");
  return data?.imagePathDownload?.data?.id;
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
