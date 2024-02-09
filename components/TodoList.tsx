import { Accordion } from "@mantine/core";
import React from "react";
import { todoData } from "../app/page";
import { IconHexagonLetterE } from "@tabler/icons-react";

function TodoList({ todos }: { todos: todoData[] }) {
  const items = todos.map((item) => (
    <Accordion.Item key={item.title} value={item.title}>
      <Accordion.Control icon={<IconHexagonLetterE />}>
        {item.title}
      </Accordion.Control>
      <Accordion.Panel>{item.description}</Accordion.Panel>
    </Accordion.Item>
  ));
  return <Accordion>{items}</Accordion>;
}

export default TodoList;
