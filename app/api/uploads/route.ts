import { NextResponse, NextRequest } from "next/server";
import { prisma } from "./_base";
import {
  S3Client,
  GetObjectCommand,
  GetObjectCommandInput,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextApiResponse } from "next";

type imageData = {
  id: number;
  description: string;
  imageName: string;
};

type imageInput = {
  description: string;
  imageName: string;
};

const client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

let getPresignedUrl = async (fileName: string) => {
  const bucketParams: GetObjectCommandInput = {
    Bucket: process.env.NEXT_PUBLIC_BUCKETNAME,
    Key: fileName,
  };
  const command = new GetObjectCommand(bucketParams);
  const signedUrl = await getSignedUrl(client, command, {
    expiresIn: 3600,
  });
  return signedUrl;
};

async function fetchImageUrls(imageData: imageData[]) {
  const urlPromises = imageData.map(async (image: imageData) => {
    const imageUrl = await getPresignedUrl(image.imageName);
    return { id: image.id, url: imageUrl, description: image.description };
  });

  const imageUrls = await Promise.all(urlPromises);
  return imageUrls;
}

export async function GET(req: NextRequest) {
  const imageData = await prisma.imageTable.findMany();
  let dataList = await fetchImageUrls(imageData);
  // Custom success response message.
  return NextResponse.json(
    { message: "Successfully got presigned URLS", dataList },
    { status: 200 }
  );
}

export async function POST(req: NextRequest, res: NextApiResponse) {
  let imageKey = `${new Date(Date.now())
    .toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    .replace(/\//g, "-")}.jpg`;
  if (req.headers.get("Content-Type") === "multipart/form-data") {
    try {
      const formData = await req.formData();
      const fileimage = formData.get("file") as Blob | null;
      const descriptionText = formData.get("description") as string;

      if (!fileimage) {
        return NextResponse.json(
          { error: "File blob is required." },
          { status: 400 }
        );
      }
      const buffer = Buffer.from((await fileimage.arrayBuffer()) as Buffer);

      if (!fileimage) {
        return NextResponse.json(
          { error: "File blob is required." },
          { status: 400 }
        );
      }
      client.send(
        new PutObjectCommand({
          Bucket: process.env.NEXT_PUBLIC_BUCKETNAME,
          Key: imageKey,
          Body: buffer,
        })
      );
      const body: imageInput = {
        description: descriptionText,
        imageName: imageKey,
      };

      const imageInsert = await prisma.imageTable.create({
        data: body,
      });

      return NextResponse.json({
        status: 200,
        message: "Successful Upload",
        imageInsert,
      });
    } catch (err) {
      return NextResponse.json({ error: "Internal Server Error", err });
    }
  } else {
    let response;
    try {
      const formData = await req.formData();
      const files = formData.getAll("file") as File[];
      const descriptionText = formData.get("description") as string;

      response = await Promise.all(
        files.map(async (file) => {
          // not sure why I have to override the types here
          const Body = (await file.arrayBuffer()) as Buffer;
          client.send(
            new PutObjectCommand({
              Bucket: process.env.NEXT_PUBLIC_BUCKETNAME,
              Key: imageKey,
              Body,
            })
          );
        })
      );
      const body: imageInput = {
        description: descriptionText,
        imageName: imageKey,
      };

      const imageInsert = await prisma.imageTable.create({
        data: body,
      });

      return NextResponse.json({
        status: 200,
        message: "Successful Upload",
        imageInsert,
      });
    } catch (err) {
      return NextResponse.json({ error: "Internal Server Error", err });
    }
  }
}
