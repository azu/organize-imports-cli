import { test, expect } from '@jest/globals';
import runCli from "./run-cli.js";

test("grouped imports - processes grouped imports", async () => {
  const result = await runCli("cli/grouped", ["file.js"]);
  expect(result.status).toMatchSnapshot();
  expect(result.stdout).toMatchSnapshot();
  expect(result.stderr).toMatchSnapshot();
  expect(result.write).toMatchSnapshot();
});
