import { marked } from 'marked'
import { createHighlighter } from 'shiki'

const LIGHT_THEME = 'github-light'
const DARK_THEME = 'vesper'
const LANGS = [
  'javascript', 'typescript', 'bash', 'shell', 'python', 'json',
  'html', 'css', 'java', 'kotlin', 'swift', 'sql', 'yaml', 'markdown',
  'c', 'cpp', 'go', 'rust', 'ruby', 'php', 'xml', 'text',
]

let highlighterPromise = null

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({ themes: [LIGHT_THEME, DARK_THEME], langs: LANGS })
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

      renderer.heading = ({ text, depth }) => {
        const raw = text.replace(/<[^>]*>/g, '')
        const slug = raw.toLowerCase().replace(/\s*\u2014\s*/g, '--').replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').trim()
        return `<h${depth} id="${slug}">${text}</h${depth}>\n`
      }

      renderer.link = ({ href, text }) => {
        if (href.startsWith('#') || href.startsWith('/')) {
          return `<a href="${href}">${text}</a>`
        }
        return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`
      }

      renderer.blockquote = ({ text }) => {
        const alertMatch = text.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n?([\s\S]*)$/i)
        if (alertMatch) {
          const type = alertMatch[1].toLowerCase()
          const body = marked.parse(alertMatch[2].trim(), { renderer })
          const labels = { note: 'Note', tip: 'Tip', important: 'Important', warning: 'Warning', caution: 'Caution' }
          return `<div class="alert alert-${type}"><p class="alert-title">${labels[type]}</p>${body}</div>\n`
        }
        return `<blockquote>${marked.parse(text, { renderer })}</blockquote>\n`
      }

      renderer.code = ({ text, lang }) => {
        const language = lang && LANGS.includes(lang) ? lang : 'text'
        try {
          return highlighter.codeToHtml(text, {
            lang: language,
            themes: { light: LIGHT_THEME, dark: DARK_THEME },
            defaultColor: false,
          })
        } catch {
          return `<pre><code>${text}</code></pre>`
        }
      }

      const parts = body.split(/<!--\s*page-break\s*-->/)
      const pages = parts.map(part => marked(part.trim(), { renderer }))

      return {
        code: `export const frontmatter = ${JSON.stringify(attrs)};\nexport const pages = ${JSON.stringify(pages)};\nexport const content = ${JSON.stringify(pages[0])};`,
        map: null,
      }
    },
  }
}
