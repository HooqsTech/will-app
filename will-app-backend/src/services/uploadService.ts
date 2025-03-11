import { Storage } from "@google-cloud/storage";
import path from "path";
import { Readable } from "stream";

const storage = new Storage({
  keyFilename: path.join(__dirname, "../haramawill-storage-secret-key.json"),
});

const BUCKET_NAME = "hamara-will-storage";

const uploadFile = async (userId: string, filename: string, fileStream: Readable): Promise<string> => {
  try {
    const destination = `uploads/${userId}/${filename}`;
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(destination);

    const writeStream = file.createWriteStream({
      resumable: false,
      metadata: { contentType: "application/pdf" },
    });

    fileStream.pipe(writeStream);

    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${destination}`;
    console.log("File uploaded:", publicUrl);

    return publicUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("File upload failed.");
  }
};

export { uploadFile };