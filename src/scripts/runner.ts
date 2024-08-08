import path from "path";
import fs from "fs";
import { loadEnvConfig } from "@next/env";

type ScriptParams = {
  env: typeof process.env;
};

loadEnvConfig(process.cwd());

const runAsync = async () => {
  // find all scripts in subfolder
  const files = fs
    .readdirSync(path.join(__dirname, "prebuild"))
    .filter((file) => file.endsWith(".ts"))
    .sort();
  for (const file of files) {
    const {
      default: defaultFunc,
    }: { default: (params: ScriptParams) => void } = await import(
      `./prebuild/${file}`
    );
    try {
      console.log(`Running prebuild script '${file}'`);
      await defaultFunc({ env: process.env });
    } catch (e) {
      console.error(
        `SCRIPT RUNNER: failed to execute prebuild script '${file}'`
      );
      console.error(e);
    }
  }
};

// Self-invocation async function
(async () => {
  await runAsync();
})().catch((err) => {
  console.error(err);
  throw err;
});
