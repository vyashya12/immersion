"use client";
import {
  Paper,
  Title,
  TextInput,
  Button,
  Container,
  Group,
  Text,
  rem,
  CloseButton,
  SimpleGrid,
} from "@mantine/core";
import { SubmitHandler, useForm } from "react-hook-form";
import { AddImageInput, addImageSchema } from "../schema/image-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import {
  IconPhoto,
  IconTrashXFilled,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { _Object } from "@aws-sdk/client-s3";
import useSWRMutation from "swr/mutation";
// import dynamic from "next/dynamic";
// const InstanceDetails = dynamic(() => import("./components/InstanceDetails"), { ssr: false })

export type responseData = {
  dataList: ImageViewData[];
};
type ImageViewData = {
  id: number;
  url: string;
  description: string;
  key: string;
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

  const delImage = async (key: string) => {
    const formData = new FormData();
    formData.append("key", key);
    const response = await axios({
      method: "delete",
      url: "/api/uploads",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  const fetchImages = async () => {
    const response = await axios.get("/api/uploads");
    const imageList: responseData = response.data;
    setData(imageList);
    console.log(imageList);
    return response;
  };

  const { trigger } = useSWRMutation("/api/uploads", uploadDocuments);

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

         {/* <InstanceDetails /> */}

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
        {data?.dataList.length! > 0 ? (
          <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 5 }}
            spacing={{ base: 10, sm: "xl" }}
            verticalSpacing={{ base: "md", sm: "xl" }}
          >
            {data?.dataList.map((item) => (
              <div
                key={item.id}
                style={{
                  alignItems: "center",
                  justifyContent: "start",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <img width={150} height={150} src={item.url} />
                <Button
                  onClick={() => delImage(item.key)}
                  style={{
                    alignSelf: "center",
                    marginTop: "5px",
                  }}
                >
                  <IconTrashXFilled />
                </Button>
                <h6>{item.description}</h6>
              </div>
            ))}
          </SimpleGrid>
        ) : null}
      </Container>
    </div>
  );
}
