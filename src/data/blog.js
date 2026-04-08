const modules = import.meta.glob('../content/blog/*.md', { eager: true })

export const posts = Object.entries(modules)
  .map(([path, mod]) => {
    const slug = path.split('/').pop().replace(/\.md$/, '')
    const attrs = mod.frontmatter
    return {
      slug,
      title: attrs.title?.replace(/^["']|["']$/g, '') || slug,
      date: attrs.date || '',
      tags: Array.isArray(attrs.tags) ? attrs.tags : [],
      excerpt: attrs.excerpt?.replace(/^["']|["']$/g, '') || '',
      content: mod.content,
    }
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date))

export const getPost = (slug) => posts.find((p) => p.slug === slug)

export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
