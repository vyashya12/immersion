"use client";
import {
  Paper,
  Title,
  TextInput,
  Button,
  Container,
  Group,
  Text,
} from "@mantine/core";
import { SubmitHandler, useForm } from "react-hook-form";
import { AddTodoInput, addTodoSchema } from "../schema/todo-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import TodoList from "../components/TodoList";

export type responseData = {
  todos: todoData[];
};

export type todoData = {
  title: string;
  description: string;
};

export default function HomePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddTodoInput>({ resolver: zodResolver(addTodoSchema) });
  const [data, setData] = useState<responseData>();

  const onSubmit: SubmitHandler<AddTodoInput> = async (data) => {
    const postResponse = await axios.post("/api/todos", data);
    reset();
  };

  const fetchTodos = async () => {
    const response = await axios.get("/api/todos");
    const todos: responseData = response.data;
    setData(todos);
    return response;
  };
  return (
    <div>
      <Container size={460} my={30}>
        <Title ta="center">Todo App</Title>

        <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              label="Todo Title"
              placeholder="Contact Exabytes"
              required
              pb={10}
              {...register("title")}
            />
            {errors.title && <Text c="red">{errors.title.message}</Text>}
            <TextInput
              label="Todo Description"
              placeholder="Call Exabytes Sales at 03-80842304"
              required
              pt={10}
              pb={10}
              {...register("description")}
            />
            {errors.description && (
              <Text c="red">{errors.description.message}</Text>
            )}
            <Group justify="space-between" mt="lg">
              <Button type="submit">Add Todo</Button>
              <Button onClick={fetchTodos}>Fetch Todos</Button>
            </Group>
          </form>
        </Paper>

        {data ? (
          <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
            <TodoList todos={data.todos} />
          </Paper>
        ) : null}
      </Container>
    </div>
  );
}
