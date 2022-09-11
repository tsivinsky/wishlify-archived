import { NextApiHandler } from "next";

import * as AWS from "aws-sdk";
import formidable from "formidable";
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
    return res.status(405).json({});
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({});
  }

  const form = new formidable.IncomingForm({
    keepExtensions: true,
    uploadDir: "./",
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({});
    }

    const file = files.file as formidable.File;

    let filename = fields.filename ?? file.newFilename;
    const filepath = file.filepath;

    if (Array.isArray(filename)) {
      filename = filename[0];
    }

    const data = await fs.readFile(filepath);
    await fs.rm(filepath);

    const params = {
      Bucket: s3Config.name,
      Key: filename,
      Body: data,
    };

    const image = `${s3Config.name}/${params.Key}`;

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

    s3.putObject(params, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({});
      }

      return res.json({ image });
    });
  });
};

export default handler;
