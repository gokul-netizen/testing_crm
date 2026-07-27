import { join } from "path";
import { writeFile, mkdir } from "fs/promises";

 
export async function uploadFile(file: Blob, folder = ""): Promise<string> {
  if (!file) throw new Error("No file provided");

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const projectDir = process.cwd();
  const baseDir = join(projectDir, "public", "photos", folder);
  await mkdir(baseDir, { recursive: true });

  const fileName = (file as any).name || `upload-${Date.now()}`;
  const filePath = join(baseDir, fileName);

  await writeFile(filePath, buffer);

  return join("photos", folder, fileName);
}
