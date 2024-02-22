import { NextResponse, NextRequest } from "next/server"

export async function PUT() {
    let token;
    let availability;
    await fetch('http://169.254.169.254/latest/api/token', {method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-aws-ec2-metadata-token-ttl-seconds': '3600' }, })
        .then(response => response.json())
        .then(data => token = data );

    await fetch('http://169.254.169.254/latest/meta-data/placement/availability-zone-id', {method: 'GET', headers: {"X-aws-ec2-metadata-token" : `${token}`}, })
        .then(response => response.json())
        .then(data => availability = data)

    
    return NextResponse.json({availability}, {status: 200})
  } 
