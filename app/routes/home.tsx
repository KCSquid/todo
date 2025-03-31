import type { Route } from "./+types/home";
import { Main } from "../main/index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Todo List" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <Main />;
}
