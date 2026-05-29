#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import ora from "ora";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const projectName = process.argv[2] || "my-react-app";

console.log(
  chalk.cyan.bold(
    `\nScaffolding React + Vite + Tailwind v4 + ESLint + Prettier\n`,
  ),
);

const spinner = ora("Creating Vite project...").start();

try {
  // 1. Create Vite React + TypeScript project
  execSync(
    `npm create vite@latest ${projectName} -- --template react-ts --no-interactive --no-immediate`,
    {
      stdio: "inherit",
      shell: true,
    },
  );

  const projectPath = path.join(process.cwd(), projectName);
  process.chdir(projectPath);

  spinner.succeed(chalk.green("Vite project created!"));

  // 2. Install dependencies
  spinner.start("Installing dependencies...");

  execSync(
    "npm install -D autoprefixer tailwindcss @tailwindcss/vite postcss",
    {
      stdio: "inherit",
    },
  );
  execSync("npm install react-icons", { stdio: "inherit" });

  execSync(
    "npm install -D eslint prettier eslint-plugin-react-hooks @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier eslint-plugin-prettier @eslint/css",
    { stdio: "inherit" },
  );

  spinner.succeed(chalk.green("Dependencies installed!"));

  // 3. Tailwind v4 Setup (Modern way)
  spinner.start("Setting up Tailwind CSS v4...");

  // Update vite.config.ts
  const viteConfigPath = "vite.config.ts";
  let viteConfig = fs.readFileSync(viteConfigPath, "utf-8");

  // Add Tailwind plugin import and plugin array
  viteConfig = viteConfig.replace(
    /import { defineConfig } from 'vite'/,
    `import { defineConfig } from 'vite'\nimport tailwindcss from '@tailwindcss/vite'`,
  );

  viteConfig = viteConfig.replace(
    /plugins:\s*\[\s*react\(\),?\s*\]/,
    `plugins: [react(), tailwindcss()]`,
  );

  fs.writeFileSync(viteConfigPath, viteConfig);

  // Add @import "tailwindcss"; to the top of src/index.css (don't overwrite)
  const cssPath = "src/index.css";
  let cssContent = fs.readFileSync(cssPath, "utf-8");
  cssContent = `@import "tailwindcss";\n\n${cssContent}`;
  fs.writeFileSync(cssPath, cssContent);

  spinner.succeed(chalk.green("Tailwind CSS v4 configured!"));

  // 4. ESLint + Prettier setup
  spinner.start("Setting up ESLint & Prettier...");

  const eslintTemplate = fs.readFileSync(
    path.join(__dirname, "../templates/eslint.config.js"),
    "utf-8",
  );
  fs.writeFileSync("eslint.config.js", eslintTemplate);

  // Prettier config
  const prettierConfig = `{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}`;
  fs.writeFileSync(".prettierrc", prettierConfig);

  // Prettier ignore
  const prettierIgnore = `dist
node_modules
public
*.min.js
`;
  fs.writeFileSync(".prettierignore", prettierIgnore);

  // Update package.json scripts
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));
  pkg.scripts = {
    ...pkg.scripts,
    lint: "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    format: 'prettier --write "src/**/*.{ts,tsx,css,js,json}"',
  };
  fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));

  spinner.succeed(chalk.green("ESLint & Prettier configured!"));

  // Final success message
  console.log(
    chalk.green.bold(`\n✅ Project "${projectName}" created successfully!\n`),
  );
  console.log(chalk.cyan("Next steps:"));
  console.log(`   cd ${projectName}`);
  console.log(`   npm run dev\n`);
} catch (error) {
  spinner.fail(chalk.red("Error during scaffolding"));
  console.error(error);
  process.exit(1);
}
