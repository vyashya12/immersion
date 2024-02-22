import { NextResponse, NextRequest } from "next/server"

type todoData = {
  title: string,
  description: string
}

export async function PUT() {
    let token;
    let instanceId;
    await fetch('http://169.254.169.254/latest/api/token', {method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-aws-ec2-metadata-token-ttl-seconds': '3600' }, })
        .then(response => response.json())
        .then(data => token = data );

    await fetch('http://169.254.169.254/latest/meta-data/instance-id', {method: 'GET', headers: {"X-aws-ec2-metadata-token" : `${token}`}, })
        .then(response => response.json())
        .then(data => instanceId = data)

    
    return NextResponse.json({instanceId}, {status: 200})
  } 
