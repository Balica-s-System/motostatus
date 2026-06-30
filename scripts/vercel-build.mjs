import { execSync } from "node:child_process";

execSync("prisma generate", { stdio: "inherit" });

if (process.env.VERCEL_ENV === "production") {
  execSync("prisma migrate deploy", { stdio: "inherit" });
}

execSync("next build", { stdio: "inherit" });
