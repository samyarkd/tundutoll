import { $, spawn } from "bun";
import { watch } from "fs";

let serverProcess: ReturnType<typeof spawn> | null = null;

const startDevServer = async () => {
  console.log("Starting dev server...");

  if (serverProcess) {
    serverProcess.kill();
    console.log("Server restarted...");
  }
  serverProcess = spawn(["bun", "run", "--hot", "dist/src/index.js"]);

  if (serverProcess.stderr) {
    const errors = await Bun.readableStreamToText(serverProcess.stderr);
    if (errors) {
      console.error(`stderr: ${errors}`);
    }
  }

  if (serverProcess.stdout) {
    for await (const chunk of serverProcess.stdout as any) {
      console.log(new TextDecoder().decode(chunk));
    }
  }
};

async function buildCommand() {
  const output = await $`bun run scripts/build.ts`.text();

  console.log(output);
}

// Watch for changes and rebuild
watch("./src", async () => {
  buildCommand();
});

await buildCommand();
startDevServer();
