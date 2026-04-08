import { marked } from 'marked'
import { createHighlighter } from 'shiki'

const THEME = 'vesper'
const LANGS = [
  'javascript', 'typescript', 'bash', 'shell', 'python', 'json',
  'html', 'css', 'java', 'kotlin', 'swift', 'sql', 'yaml', 'markdown',
  'c', 'cpp', 'go', 'rust', 'ruby', 'php', 'xml', 'text',
]

let highlighterPromise = null

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({ themes: [THEME], langs: LANGS })
  }
  return highlighterPromise
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { attrs: {}, body: raw }

  const attrs = {}
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let val = line.slice(idx + 1).trim()
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''))
    }
    attrs[key] = val
  }

  return { attrs, body: match[2] }
}

export default function markdownPlugin() {
  return {
    name: 'vite-plugin-markdown',
    async transform(code, id) {
      if (!id.endsWith('.md')) return null

      const highlighter = await getHighlighter()
      const { attrs, body } = parseFrontmatter(code)

      const renderer = new marked.Renderer()
      renderer.code = ({ text, lang }) => {
        const language = lang && LANGS.includes(lang) ? lang : 'text'
        try {
          return highlighter.codeToHtml(text, { lang: language, theme: THEME })
        } catch {
          return `<pre><code>${text}</code></pre>`
        }
      }

      const html = marked(body, { renderer })

      return {
        code: `export const frontmatter = ${JSON.stringify(attrs)};\nexport const content = ${JSON.stringify(html)};`,
        map: null,
      }
    },
  }
}
