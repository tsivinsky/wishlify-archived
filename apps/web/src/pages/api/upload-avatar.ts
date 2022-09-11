import { NextApiHandler } from "next";

import * as AWS from "aws-sdk";
import formidable, { File } from "formidable";
import fs from "fs/promises";

import { getServerSession } from "@/utils/getServerSession";
import { s3Config } from "@/utils/s3";

import { authOptions } from "./auth/[...nextauth]";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    return res.json({});
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({});
  }

  const form = new formidable.IncomingForm({
    keepExtensions: true,
    filename: (name, ext) => `${name}-${Date.now()}${ext}`,
    uploadDir: "./",
  });

  const s3 = new AWS.S3({
    endpoint: s3Config.url,
    region: s3Config.region,
    credentials: {
      accessKeyId: s3Config.accessKey,
      secretAccessKey: s3Config.secretKey,
    },
    params: {
      Bucket: s3Config.name,
    },
  });

  // TODO: delete old avatar object here

  form.parse(req, async (err, fields, files) => {
    const file = files.file as File;

    const filename = file.newFilename;
    const filepath = file.filepath;

    const data = await fs.readFile(filepath);
    await fs.rm(filepath);

    const params = {
      Bucket: s3Config.name,
      Key: filename,
      Body: data,
    };

    await s3.putObject(params).promise();
    const image = params.Key;

    return res.json({ image });
  });
};

export default handler;
