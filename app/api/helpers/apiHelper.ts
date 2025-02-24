export async function apiRequest<T>(
  endpoint: string,
  method: string = "GET",
  body?: any
): Promise<T> {
  try {
    const response = await fetch(`${process.env.CLAD_API_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CLAD_API_TOKEN}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error("API Request Failed:", error);
    throw error;
  }
}

/**
 * Function to send an image for background removal.

 */
export async function postImage(
  image_url: string,
  userId: string,
  privateMetadata: any
) {
  const setUserImageQuality = () => {
    if (!userId) {
      return "30%";
    }

    if (userId && privateMetadata?.subscription_type === "Free") {
      return "50%";
    }

    if (userId && privateMetadata?.subscription_type === "Pro") {
      return "100%";
    }
  };

  return apiRequest<{ imagePathDownload: string }>("", "POST", {
    input: image_url,
    operations: {
      background: {
        remove: true,
        color: "transparent",
      },
      resizing: {
        width: setUserImageQuality(),
        height: setUserImageQuality(),
        fit: "bounds",
      },
    },
    output: {
      format: {
        type: "png",
        compression: "fast",
      },
    },
  });
}

export async function getProcessedImage(id: string) {
  return apiRequest(`/${id}`, "GET");
}
