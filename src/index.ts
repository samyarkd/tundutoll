import { Hono } from "hono"

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

console.info("WE ARE GOING TO RUN THE APP on port 3000");

export default app;
