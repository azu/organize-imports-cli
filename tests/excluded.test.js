import { test, expect } from '@jest/globals';
import runCli from "./run-cli.js";

test("exclude in tsconfig - excludes files correctly", async () => {
  const result = await runCli("cli/exclude", ["--list"]);
  expect(result.status).toMatchSnapshot();
  expect(result.stdout).toMatchSnapshot();
  expect(result.stderr).toMatchSnapshot();
  expect(result.write).toMatchSnapshot();
});
