const fs = require("fs")
const path = require("path")

// Копіюємо CSS файл в dist
const srcCss = path.join(__dirname, "../src/styles/editor.css")
const destCss = path.join(__dirname, "../dist/editor.css")

try {
  // Створюємо папку dist якщо не існує
  const distDir = path.dirname(destCss)
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true })
  }

  // Копіюємо файл
  fs.copyFileSync(srcCss, destCss)
  console.log("✅ CSS файл скопійовано в dist/editor.css")
} catch (error) {
  console.error("❌ Помилка при копіюванні CSS:", error.message)
  process.exit(1)
}
