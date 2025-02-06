import { Hono } from "hono";
import { handle } from "hono/vercel";
import { HTTPException } from "hono/http-exception";

export const runtime = "nodejs";
type PostImageProps = {
  imgSource: any;
};
const app = new Hono().basePath("/api");
console.log("-----------------------------");
async function postImage(image_url: PostImageProps) {
  const apiUrl = "https://api.claid.ai/v1-beta1/image/edit/async";
  const apiToken = "485b3e54f57b495890069d570b3b3e8f";

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify({
      input: image_url,
      operations: {
        background: {
          remove: true,
        },
      },
    }),
  });
  const data = await response.json();
 
  return data;
}

app.post("/background-removal", async (c) => {
  try {
    const { image_url } = await c.req.json();
 
    if (image_url) {
      const imagePathDownload = await postImage(image_url);
      // const imagePath = fs.writeFileSync("no-bg.png", Buffer.from(imagePathDownload));
      return c.json({ imagePathDownload });
    } else {
      throw new HTTPException(401, { message: "No image found" });
    }
  } catch (error) {
    return c.json({ error: error }, error || 500);
  }
});
console.log("-----------------------------");

export const GET = handle(app);
export const POST = handle(app);
