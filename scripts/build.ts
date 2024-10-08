// DO NOT CHANGE THIS FILE :D unless you know what you're doing
// This file is used to configure the build process
// tweeking this file will mess up the build process (but it's not illegal ;))

import { plugin, type BunPlugin } from "bun";

console.time("It Took");
// The root directory of the project TODO: maybe there is a better way to get the root dir
const MAIN_ROOT = Bun.main.replace("build/build.config.ts", "");

// --- PLUGINS

const logPrefixPlugin: BunPlugin = {
  name: "Log Prefix Plugin",
  setup(build) {
    build.onLoad({ filter: /\.(js|ts|jsx|tsx)$/ }, async ({ path }) => {
      const file = Bun.file(path);
      const content = await file.text();
      const modifiedContent = content.replace(
        /console\.(.*)\((.*)\)/g,
        (
          match: string,
          method: string,
          args: string,
          offset: number,
          string: string,
        ): string => {
          const lineNumber = string.substring(0, offset).split("\n").length;
          return `console.${method}('----> ${file.name?.replace(
            MAIN_ROOT,
            "",
          )}:${lineNumber} ::', ${args})`;
        },
      );
      return {
        contents: modifiedContent,
        loader: "js",
      };
    });
  },
};

plugin(logPrefixPlugin);

// --- BUILD

const buildResult = await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  root: "./",
  plugins: [logPrefixPlugin],
  splitting: true,
});

if (!buildResult.success) {
  console.error("Build failed");
  for (const message of buildResult.logs) {
    // Bun will pretty print the message object
    console.error(message);
  }
} else {
  console.info("🏗  Building was successfull");
  console.timeEnd("It Took");
}
