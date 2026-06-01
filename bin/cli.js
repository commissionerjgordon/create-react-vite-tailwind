#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import ora from "ora";
import { Command } from "commander";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const program = new Command();

program
  .name("create-vite-react-tailwind")
  .description("Scaffold a modern React + Vite + Tailwind v4 app")
  .argument("[project-name]", "Name of the project", "my-react-app")
  .option("--minimal", "Skip creating additional folder structure")
  .option("--no-structure", "Skip creating additional folder structure")
  .parse();

const projectName = program.args[0];
const options = program.opts();
const shouldCreateStructure = !options.minimal && !options.structure === false;

console.log(
  chalk.cyan.bold(
    `\nScaffolding React + Vite + Tailwind v4 + ESLint + Prettier\n`,
  ),
);

const spinner = ora("Creating Vite project...").start();

try {
  // 1. Create Vite React + TypeScript project (non-interactive)
  execSync(
    `npm create vite@latest ${projectName} -- --template react-ts --no-interactive --no-immediate`,
    { stdio: "inherit", shell: true },
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

  // 3. Tailwind v4 Setup
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

  // 4. Create Folder Structure (if not minimal)
  if (shouldCreateStructure) {
    spinner.start("Creating folder structure...");

    const folders = [
      "src/components",
      "src/components/ui",
      "src/hooks",
      "src/lib",
      "src/assets",
    ];

    folders.forEach((folder) => {
      fs.mkdirSync(folder, { recursive: true });
    });

    // Create example files
    fs.writeFileSync(
      "src/lib/utils.ts",
      `export const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');\n`,
    );

    fs.writeFileSync(
      "src/hooks/useCounter.ts",
      `import { useState } from 'react';

export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  return { count, increment, decrement };
}\n`,
    );

    // Example UI component
    fs.writeFileSync(
      "src/components/ui/Button.tsx",
      `import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export default function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={\`px-4 py-2 rounded-lg font-medium transition-all \${className}\`}
      {...props}
    />
  );
}\n`,
    );

    spinner.succeed(chalk.green("Folder structure created!"));
  } else {
    console.log(chalk.yellow("→ Skipping folder structure (minimal mode)"));
  }

  // 5. ESLint + Prettier Setup
  spinner.start("Setting up ESLint & Prettier...");

  const eslintTemplate = fs.readFileSync(
    path.join(__dirname, "../templates/eslint.config.js"),
    "utf-8",
  );
  fs.writeFileSync("eslint.config.js", eslintTemplate);

  fs.writeFileSync(
    ".prettierrc",
    `{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}`,
  );

  fs.writeFileSync(
    ".prettierignore",
    `dist
node_modules
public
*.min.js
`,
  );

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

  // Final Message
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
