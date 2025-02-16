import { test, expect } from '@jest/globals';
import runCli from "./run-cli.js";

test("--help - shows help message", async () => {
  const result = await runCli(".", ["--help"]);
  expect(result.status).toMatchSnapshot();
  expect(result.stdout).toMatchSnapshot();
  expect(result.stderr).toMatchSnapshot();
  expect(result.write).toMatchSnapshot();
});
