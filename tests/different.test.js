import { test, expect } from '@jest/globals';
import runCli from "./run-cli.js";

test("--list-different - checks different files", async () => {
  const result = await runCli("cli/different", ["--list-different"]);
  expect(result.status).toMatchSnapshot();
  expect(result.stdout).toMatchSnapshot();
  expect(result.stderr).toMatchSnapshot();
  expect(result.write).toMatchSnapshot();
});
