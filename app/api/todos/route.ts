import { NextResponse, NextRequest } from "next/server"
import { prisma } from "./_base"
import {
  S3Client,
  ListObjectsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const Bucket = process.env.BUCKETNAME;
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

type todoData = {
  title: string,
  description: string
}

export async function GET() {
  const todos = await prisma.todotable.findMany()
  return NextResponse.json({todos})
} 
 


export async function POST(req: Request) {
  const body: todoData = await req.json()
  const todo = await prisma.todotable.create({
    data: body
  })
  return NextResponse.json({message: 'Added Todo', todo}, {status: 200})
}