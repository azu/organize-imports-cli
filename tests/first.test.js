import { test, expect } from '@jest/globals';
import runCli from "./run-cli.js";

test("The first Test - processes file correctly", async () => {
  const result = await runCli("cli/first", ["file1.js"]);
  expect(result.status).toMatchSnapshot();
  expect(result.stdout).toMatchSnapshot();
  expect(result.stderr).toMatchSnapshot();
  expect(result.write).toMatchSnapshot();
});
