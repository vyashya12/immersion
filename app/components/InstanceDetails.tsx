import { Title } from '@mantine/core'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

type InstanceDataType = {
    avaz: string,
    ec2Id: string,
  }

export default function InstanceDetails() {
    const [instanceData, setInstanceData] = useState<InstanceDataType>()

  useEffect(() => {
    const getDisplays = async () => {
      const response = await axios({
        method: "get",
        url: "/api/chaos",
      });
      setInstanceData({avaz: response.data.message.AZ, ec2Id: response.data.message.InstanceID})
    }
        getDisplays()
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
          <Title ta="center" order={4} >
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
          <Title ta="center" order={4} >
            {instanceData?.avaz}
          </Title>
        </div>
        </>
  )
}
