import { Hono } from "hono";
import { handle } from "hono/vercel";
import { HTTPException } from "hono/http-exception";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

export const runtime = "nodejs";
type PostImageProps = {
  imgSource: any;
};
const app = new Hono().basePath("/api");
const apiUrl = "https://api.claid.ai/v1-beta1/image/edit/async";
const apiToken = "485b3e54f57b495890069d570b3b3e8f";

async function postImage(image_url: PostImageProps) {
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

app.get("/retrieve-removed-image/:id", async (c) => {
  const { id } = c.req.param();
  // const response = await fetch(
  //   "http://api.claid.ai/v1-beta1/image/edit/async/image/",
  //   {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${apiToken}`,
  //     },
  //   }
  // );
  // const data = await response.json();
  return c.json({ id });
});


app.post("/upload", async (c) => {
  const body = await c.req.parseBody();
  const file = body.file as File;

  if (!file) {
    return c.json({ error: "No file uploaded" }, 400);
  }

  // Convert file to Buffer
  const bytes = await file.arrayBuffer();
  const buffer = new Uint8Array(bytes); // ✅ Fix: Use Uint8Array instead of Buffer

  // Define storage details
  const storageName = "local-storage"; // Custom storage name
  const imageFolder = "uploads"; // Folder where images are stored
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`; // Unique filename

  // Ensure the upload directory exists
  const uploadDir = path.join(process.cwd(), "public", imageFolder);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Save file locally
  const filePath = `${uploadDir}/${fileName}`;
  await writeFile(filePath, buffer);

  // Generate Custom Storage URL
  const storagePath = `storage://${storageName}/${imageFolder}/${fileName}`;
  const publicUrl = `/${imageFolder}/${fileName}`;

  return c.json({ storagePath, publicUrl });
});


export const GET = handle(app);
export const POST = handle(app);
