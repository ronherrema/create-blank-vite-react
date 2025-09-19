#!/usr/bin/env node

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { execSync } from "child_process"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const projectName = process.argv[2] || "my-blank-react-app"

// Create project directory
const projectPath = path.resolve(projectName)
fs.mkdirSync(projectPath, { recursive: true })

// Copy template files
const templatePath = path.join(__dirname, "..", "template")

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  const entries = fs.readdirSync(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

copyDir(templatePath, projectPath)

// Update package.json name
const packageJsonPath = path.join(projectPath, "package.json")
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))
packageJson.name = projectName
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

console.log(`✅ Created ${projectName}`)
console.log("\nNext steps:")
console.log(`  cd ${projectName}`)
console.log("  npm install")
console.log("  npm run dev")
