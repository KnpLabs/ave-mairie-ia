import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Ave Mairie" },
    { name: "description", content: "Welcome to Ave Mairie!" },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Ave Mairie</h1>
    </div>
  );
}
