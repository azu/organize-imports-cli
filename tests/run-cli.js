// Based on https://github.com/prettier/prettier/blob/master/tests_integration/runPrettier.js
import fs from "node:fs";
import path from "node:path";
import stripAnsi from "strip-ansi";
import escapeStringRegexp from "escape-string-regexp";
import { fileURLToPath } from "node:url";
import { jest, expect } from '@jest/globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = "../";
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, rootDir, "package.json"), 'utf8'));
const cli = path.join(__dirname, rootDir, pkg.bin);

/**
 * @param {string} dir
 * @param {string[]=} args
 * @param {*=} options
 */
async function runCli(dir, args = [], options = {}) {
  dir = normalizeDir(dir);

  let status;
  let stdout = "";
  let stderr = "";

  jest.spyOn(process, "exit").mockImplementation(exitCode => {
    if (status === undefined) {
      status = exitCode || 0;
    }
  });

  jest
    .spyOn(process.stdout, "write")
    .mockImplementation(text => appendStdout(text));

  jest
    .spyOn(process.stderr, "write")
    .mockImplementation(text => appendStderr(text));

  jest
    .spyOn(console, "log")
    .mockImplementation(text => appendStdout(text + "\n"));

  jest
    .spyOn(console, "warn")
    .mockImplementation(text => appendStderr(text + "\n"));

  jest
    .spyOn(console, "error")
    .mockImplementation(text => appendStderr(text + "\n"));

  jest.spyOn(Date, "now").mockImplementation(() => 0);

  const write = [];

  jest.spyOn(fs, "writeFileSync").mockImplementation((filename, content) => {
    write.push({
      filename: path.relative(dir, filename),
      content
    });
  });

  const origStatSync = fs.statSync;

  jest.spyOn(fs, "statSync").mockImplementation(filename => {
    if (path.basename(filename) === `virtualDirectory`) {
      return origStatSync(path.join(__dirname, __filename));
    }
    return origStatSync(filename);
  });

  const originalCwd = process.cwd();
  const originalArgv = process.argv;
  const originalExitCode = process.exitCode;
  const originalStdinIsTTY = process.stdin.isTTY;
  const originalStdoutIsTTY = process.stdout.isTTY;
  const originalEnv = process.env;

  process.chdir(dir);
  process.stdin.isTTY = !!options.isTTY;
  process.stdout.isTTY = !!options.stdoutIsTTY;
  process.argv = ["path/to/node", "path/to/bin"].concat(args);
  process.env = { ...process.env, ...options.env };

  jest.resetModules();

  try {
    const module = await import(cli);
    status = (status === undefined ? process.exitCode : status) || 0;
  } catch (error) {
    status = 1;
    stderr += error.message;
  } finally {
    process.chdir(originalCwd);
    process.argv = originalArgv;
    process.exitCode = originalExitCode;
    process.stdin.isTTY = originalStdinIsTTY;
    process.stdout.isTTY = originalStdoutIsTTY;
    process.env = originalEnv;
    jest.restoreAllMocks();
  }

  return {
    status,
    stdout: stripAnsi(stdout),
    stderr: stripAnsi(stderr),
    write
  };
}

function normalizeDir(dir) {
  return path.resolve(__dirname, dir).replace(/\\/g, "/");
}

export default runCli;
