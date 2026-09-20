import "server-only";

import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import sharp from "sharp";

import { requireR2Config } from "@/lib/env";

let cachedClient: S3Client | undefined;

function getR2Client() {
  if (!cachedClient) {
    const config = requireR2Config();
    cachedClient = new S3Client({
      region: "auto",
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
    });
  }

  return cachedClient;
}

export function getPublicAssetUrl(key: string) {
  const publicUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");
  return publicUrl ? `${publicUrl}/${key}` : undefined;
}

export async function uploadProductImage(input: Buffer, key: string) {
  const config = requireR2Config();
  const optimized = await sharp(input)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  await getR2Client().send(new PutObjectCommand({
    Bucket: config.bucketName,
    Key: key,
    Body: optimized,
    ContentType: "image/webp",
    CacheControl: "public, max-age=31536000, immutable",
  }));

  return { key, size: optimized.byteLength, url: getPublicAssetUrl(key) };
}

export async function deleteProductImage(key: string) {
  const config = requireR2Config();
  await getR2Client().send(new DeleteObjectCommand({ Bucket: config.bucketName, Key: key }));
}
