import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";

const certDir = path.resolve(__dirname, ".cert");

export default defineConfig({
  server: {
    host: true,
    https: {
      key: fs.readFileSync(path.join(certDir, "dev-key.pem")),
      cert: fs.readFileSync(path.join(certDir, "dev-cert.pem")),
    },
  },
});
