const API_URL = "https://api.claid.ai/v1-beta1/image/edit/async";
const API_TOKEN = "485b3e54f57b495890069d570b3b3e8f";

export async function apiRequest<T>(
  endpoint: string,
  method: string = "GET",
  body?: any
): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
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
export async function postImage(image_url: string) {
  return apiRequest<{ imagePathDownload: string }>("", "POST", {
    input: image_url,
    operations: {
      background: {
        remove: true,
        color: "transparent",
      },
    },
    output: {
      format: "png",
    },
  });
}

export async function getProcessedImage(id: string) {
  return apiRequest(`/${id}`, "GET");
}
