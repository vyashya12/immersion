import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, res: NextResponse) {
  if(process.env.NEXT_PUBLIC_AZ && process.env.NEXT_PUBLIC_INSTANCEID) {
    return NextResponse.json({
      status: 200,
      message: {"AZ": process.env.NEXT_PUBLIC_AZ, "InstanceID": process.env.NEXT_PUBLIC_INSTANCEID},
    });
  } else {
    return NextResponse.json({
      status: 500,
      message: {"AZ": "No AZ Found", "InstanceID": "No ID found"},
    });
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
    const startTime = new Date().getTime();
    while (new Date().getTime() - startTime < 30000) {
      // Perform a CPU-intensive task
      // For example, calculate prime numbers or perform heavy computations
      let isPrime = true;
      const num = Math.floor(Math.random() * 10000) + 1;
      for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
          isPrime = false;
          break;
        }
      }
    }

return NextResponse.json({
        status: 200,
        message: "CPU increased usage for 30 seconds",
        
      });}
