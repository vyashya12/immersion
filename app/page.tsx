"use client";
import {
  Paper,
  Title,
  TextInput,
  Button,
  Container,
  Group,
  Text,
  Space,
  rem,
  CloseButton,
  SimpleGrid,
} from "@mantine/core";
import { SubmitHandler, useForm } from "react-hook-form";
import { AddImageInput, addImageSchema } from "../schema/image-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import ImageView from "../components/ImageView";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { _Object } from "@aws-sdk/client-s3";
import useSWRMutation from "swr/mutation";

export type responseData = {
  dataList: ImageViewData[];
};
type ImageViewData = {
  id: number;
  url: string;
  description: string;
};

export type imageData = {
  description: string;
  file: File;
};
export type imageResponse = {
  description: string;
  imageName: string;
};

async function uploadDocuments(
  url: string,
  { arg }: { arg: { files: FileWithPath[]; description: string } }
): Promise<_Object[]> {
  const body = new FormData();
  arg.files.forEach((file) => {
    body.append("file", file, file.name);
  });

  body.append("description", arg.description);

  const response = await fetch(url, { method: "POST", body });
  return await response.json();
}

export default function HomePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddImageInput>({ resolver: zodResolver(addImageSchema) });
  const [data, setData] = useState<responseData>();
  const [fileData, setFileData] = useState<FileWithPath[]>();

  const onSubmit: SubmitHandler<AddImageInput> = async (data) => {
    // data.files = fileData
    const postResponse = await trigger({
      description: data.description,
      files: fileData!,
    });
    reset();
    console.log(postResponse);
    setFileData([]);
  };

  const fetchImages = async () => {
    const response = await axios.get("/api/uploads");
    const imageList: responseData = response.data;
    setData(imageList);
    console.log(imageList);
    return response;
  };

  const { trigger } = useSWRMutation("/api/uploads", uploadDocuments);

  let ec2Id = process.env.NEXT_PUBLIC_INSTANCEID;
  let avaz = process.env.NEXT_PUBLIC_AZ;

  const selectedFiles = fileData?.map((file, index) => (
    <Text key={file.name}>
      <b>{file.name}</b> ({(file.size / 1024).toFixed(2)} kb)
      <CloseButton size="xs" onClick={() => setFileData([])} />
    </Text>
  ));

  return (
    <div>
      <Container my={30}>
        <Title ta="center" order={1}>
          CIS Image App
        </Title>

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
            {ec2Id}
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
            {avaz}
          </Title>
        </div>

        <Paper
          withBorder
          shadow="md"
          p="xl"
          radius="md"
          my="lg"
          style={{
            width: 500,
            margin: "auto",
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Dropzone
              onDrop={(files) => setFileData(files)}
              onReject={(files) => console.log("rejected files", files)}
              maxSize={5 * 1024 ** 2}
              accept={IMAGE_MIME_TYPE}
              name="files"
            >
              <Group
                justify="center"
                gap="xl"
                mih={220}
                style={{ pointerEvents: "none" }}
              >
                <Dropzone.Accept>
                  <IconUpload
                    style={{
                      width: rem(52),
                      height: rem(52),
                      color: "var(--mantine-color-blue-6)",
                    }}
                    stroke={1.5}
                  />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX
                    style={{
                      width: rem(52),
                      height: rem(52),
                      color: "var(--mantine-color-red-6)",
                    }}
                    stroke={1.5}
                  />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconPhoto
                    style={{
                      width: rem(52),
                      height: rem(52),
                      color: "var(--mantine-color-dimmed)",
                    }}
                    stroke={1.5}
                  />
                </Dropzone.Idle>

                <div>
                  <Text size="xl" inline>
                    Drag images here or click to select files
                  </Text>
                  <Text size="sm" c="dimmed" inline mt={7}>
                    Attach as many files as you like, each file should not
                    exceed 5mb
                  </Text>
                </div>
              </Group>
            </Dropzone>
            {selectedFiles?.length! > 0 && (
              <>
                <Text mb={5} mt="md">
                  Selected files:
                </Text>
                {selectedFiles}
              </>
            )}
            <TextInput
              label="Description"
              placeholder="Image of a dragon"
              required
              pb={10}
              {...register("description")}
            />
            <Group justify="space-between" mt="lg">
              <Button type="submit">Add Image</Button>
              <Button onClick={fetchImages}>Fetch Images</Button>
            </Group>
          </form>
        </Paper>
        {/* {data?.dataList.length! > 0 ? (
          <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 5 }}
            spacing={{ base: 10, sm: "xl" }}
            verticalSpacing={{ base: "md", sm: "xl" }}
          >
            <ImageView dataList={data?.dataList!} />
          </SimpleGrid>
        ) : null} */}
      </Container>
    </div>
  );
}
