import { NextApiHandler } from "next";

import { prisma } from "@/server/prisma";
import * as AWS from "aws-sdk";
import formidable, { File } from "formidable";
import fs from "fs/promises";
import { unstable_getServerSession } from "next-auth";

import { s3Config } from "@/utils/s3";

import { authOptions } from "./auth/[...nextauth]";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    return res.end();
  }

  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({});
  }

  const form = new formidable.IncomingForm({
    keepExtensions: true,
    filename: (name, ext) =>
      `${name}-${session.user.username ?? Date.now()}${ext}`,
    uploadDir: "./",
  });

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

    const imagePath = `${s3Config.name}/${params.Key}`;

    const user = await prisma.user.findFirst({ where: { avatar: imagePath } });
    if (user) {
      return res.json({ imagePath });
    }

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
        console.log(err);
        return res.end();
      }

      const imagePath = `${s3Config.name}/${params.Key}`;
      return res.json({ imagePath });
    });
  });
};

export default handler;
