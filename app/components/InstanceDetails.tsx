import { Title } from '@mantine/core'
import React, { useEffect, useState } from 'react'

type InstanceDataType = {
    avaz: string,
    ec2Id: string,
  }

export default function InstanceDetails() {
    const [instanceData, setInstanceData] = useState<InstanceDataType>()

  useEffect(() => {
    setInstanceData({avaz: process.env.NEXT_PUBLIC_AZ!!, ec2Id: process.env.NEXT_PUBLIC_INSTANCEID!!})
  }, [])
  return (
    <>
    <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          <Title ta="center" order={4}>
            Instance ID:
          </Title>
          <Title ta="center" order={4}>
            {instanceData?.ec2Id}
          </Title>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          <Title ta="center" order={4}>
            Availability Zone:
          </Title>
          <Title ta="center" order={4}>
            {instanceData?.avaz}
          </Title>
        </div>
        </>
  )
}
