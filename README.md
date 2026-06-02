# create-vite-react-tailwind

Scaffold a modern React + Vite + TypeScript app with Tailwind CSS v4, React Icons, ESLint, and Prettier in seconds.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)

## ✨ Features

- ⚡ **Vite** + **React 19** + **TypeScript**
- 🎨 **Tailwind CSS v4** (using the new `@tailwindcss/vite` plugin)
- 🧩 **React Icons** pre-installed
- 🔍 **ESLint** (Flat config) with TypeScript & React support
- ✨ **Prettier** with clean formatting rules
- 📦 `.prettierignore` configured
- ⚙️ Ready-to-use `lint`, `lint:fix`, and `format` scripts
- 📁 Optional folder structure
- 🛣️ Optional React Router DOM setup

## 🚀 Quick Start

Create a new project with one command:

```bash
npx create-react-vite-tailwind my-awesome-app
```

Or with npm

```bash
npm create react-vite-tailwind@latest my-awesome-app
```

Then run your app

```bash
cd my-awesome-app
npm run dev
```

### Additional Options

```bash
# Without routing
npx create-vite-react-tailwind my-awesome-app --no-routing
```

```bash
# Without extra folders
npx create-vite-react-tailwind my-awesome-app --no-structure
```

## Available Flags

| Flag             | Description                                        | Defualt |
| ---------------- | -------------------------------------------------- | ------- |
| `--no-routing`   | Skips `react-router-dom` + basic routing setup     | `false` |
| `--minimal`      | Skips folder structure, example files, and routing | `false` |
| `--no-structure` | Skips folder structure and example files           | `false` |

## 📋 What's Included

| Feature              | Status   | Details                                |
| -------------------- | -------- | -------------------------------------- |
| Vite + React + TS    | ✓        | Latest templates                       |
| Tailwind CSS v4      | ✓        | `@import "tailwindcss";` + Vite plugin |
| React Icons          | ✓        | Ready to import                        |
| ESLint (Flat Config) | ✓        | TypeScript + React rules               |
| Prettier             | ✓        | Integrated with ESLint                 |
| Scripts              | ✓        | `lint`, `lint:fix`, `format`           |
| Folder Structure     | Optional | `componenets/`, `hooks/`, `lib/`, etc. |
| React Router DOM     | Optional | With example pages & layout            |

## 📁 Project Structure (after creation)

```bash
my-app/
├── src/
│ ├── components/
│ │ └── ui/
│ ├── pages/
│ ├── routes/
│ ├── hooks/
│ ├── lib/
│ ├── assets/
│ ├── App.tsx
│ ├── main.tsx
│ └── index.css
├── vite.config.ts
├── eslint.config.js
├── .prettierrc
├── .prettierignore
├── package.json
└── tsconfig.json
```

## 🛠️ Available Scripts

```bash
npm run dev # Start development server
npm run build # Build for production
npm run preview # Preview production build
npm run lint # Run ESLint
npm run lint:fix # Fix lint issues automatically
npm run format # Format code with Prettier
```

## 📄 License

MIT License - feel free to use this template in your personal or commercial projects.Made with for fast and clean React development
