import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const projectRoot = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root to this project so a stray lockfile elsewhere on the
  // machine does not get picked up as the root.
  outputFileTracingRoot: projectRoot,
};

export default nextConfig;
