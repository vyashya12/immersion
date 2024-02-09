import { NextResponse, NextRequest } from "next/server"
import { prisma } from "./_base"

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