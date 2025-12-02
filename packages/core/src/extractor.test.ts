import { describe, it, expect } from 'vitest'
import { JSDOM } from 'jsdom'
import { ContentExtractor } from './extractor'

describe('ContentExtractor', () => {
    it('should extract content from a simple HTML document', () => {
        const html = `
      <!DOCTYPE html>
      <html>
        <head><title>Test Page</title></head>
        <body>
          <article>
            <h1>Main Article Title</h1>
            <p>This is the main content of the article.</p>
            <p>It has multiple paragraphs.</p>
          </article>
          <nav>Menu</nav>
          <footer>Copyright</footer>
        </body>
      </html>
    `
        const dom = new JSDOM(html, { url: 'https://example.com' })
        const extracted = ContentExtractor.extract(dom.window.document)

        expect(extracted).not.toBeNull()
        // Readability often falls back to <title> for small documents
        expect(extracted?.title).toBe('Test Page')
        expect(extracted?.textContent).toContain('This is the main content of the article.')
        expect(extracted?.textContent).not.toContain('Menu')
    })

    it('should return null for empty document', () => {
        const html = '<html><body></body></html>'
        const dom = new JSDOM(html, { url: 'https://example.com' })
        const extracted = ContentExtractor.extract(dom.window.document)

        // Readability might still find something or return null depending on strictness
        // But for empty body it usually returns null
        expect(extracted).toBeNull()
    })
})
