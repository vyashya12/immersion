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
    // const todos = await prisma.todotable.findMany()
    // return NextResponse.json({todos})
    const response = await s3.send(new ListObjectsCommand({ Bucket }));
    return NextResponse.json(response?.Contents ?? []);
  } 
   
  
  
  export async function POST(req: Request) {
    // const body: todoData = await req.json()
    // const todo = await prisma.todotable.create({
    //   data: body
    // })
    // return NextResponse.json({message: 'Added Todo', todo}, {status: 200})
      // const formData = await req.formData();
      // const files = formData.getAll("file") as File[];
    
      console.log(req.formData())
      // const response = await Promise.all(
      //   files.map(async (file) => {
      //     // not sure why I have to override the types here
      //     const Body = (await file.arrayBuffer()) as Buffer;
      //     s3.send(new PutObjectCommand({ Bucket, Key: file.name, Body }));
      //   })
      // );
    
      return NextResponse.json({message: "Yes we hit s3 function"});
  }