const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");
require("dotenv").config();

const s3 = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results = results.concat(walkDir(filePath)); // Recursively go into subfolders
    } else {
      results.push(filePath); // Only add files
    }
  }

  return results;
}

async function uploadDirToS3(directoryPath, projectId) {
  const files = walkDir(directoryPath);

  for (const filePath of files) {
    const fileStream = fs.createReadStream(filePath);
    const relativeKey = path.relative(directoryPath, filePath);
    const contentType = mime.lookup(filePath) || "application/octet-stream";

    const uploadParams = {
      Bucket: process.env.S3_BUCKET,
      Key: `${projectId}/${relativeKey}`,
      Body: fileStream,
      ContentType: contentType,
    };

    await s3.send(new PutObjectCommand(uploadParams));
  }
  console.log("✅ All files uploaded to S3");

  if (!process.env.AWS_PROJECT_BASE_LINK) {
    console.log(
      "AWS_PROJECT_BASE_LINK is not defined in the environment variables."
    );
  }
  return `${process.env.AWS_PROJECT_BASE_LINK}/${projectId}`;
}

module.exports = { uploadDirToS3 };
