import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

const REGION = process.env.AWS_REGION as string;
const BUCKET = process.env.AWS_S3_BUCKET as string;

if (!REGION) throw new Error("AWS_REGION env var not set");
if (!BUCKET) throw new Error("AWS_S3_BUCKET env var not set");

const s3 = new S3Client({ region: REGION });

export function getS3Url(key: string): string {
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
}

export function extractKeyFromUrl(url: string): string | null {
  const prefix = `https://${BUCKET}.s3.${REGION}.amazonaws.com/`;
  if (url.startsWith(prefix)) return url.slice(prefix.length);
  return null;
}

export function computeFileHash(buffer: Buffer): string {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

export async function uploadToS3(
  body: Buffer,
  key: string,
  mime: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: body,
    ContentType: mime,
  });
  await s3.send(command);
  return getS3Url(key);
}

export async function deleteFromS3(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({ Bucket: BUCKET, Key: key });
    await s3.send(command);
  } catch (e) {
    console.warn("S3 delete failed:", e);
  }
}
