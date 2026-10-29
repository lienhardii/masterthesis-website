// Einfacher Markdown-Parser (ohne Dependencies)
class MarkdownParser {
  static parse(markdown) {
    let html = markdown;

    // Headings (h2, h3, h4)
    html = html.replace(/^### (.*?)$/gm, '<h4>$1</h4>');
    html = html.replace(/^## (.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/^# (.*?)$/gm, '<h2>$1</h2>');

    // Bold & Italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');

    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

    // Code inline
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');

    // Blockquotes
    html = html.replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>');

    // Line breaks zu Paragraphen
    html = html
      .split('\n\n')
      .map(block => {
        if (block.match(/^<h[2-4]|^<blockquote|^<ul|^<ol|^<pre|^<code/)) {
          return block;
        }
        if (block.trim() === '') return '';
        return `<p>${block.trim()}</p>`;
      })
      .join('\n');

    // Lists
    html = html.replace(/^\* (.*?)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*?<\/li>)/s, '<ul>$1</ul>');
    html = html.replace(/^\d+\. (.*?)$/gm, '<li>$1</li>');

    // Code blocks
    html = html.replace(/```(.*?)```/s, '<pre><code>$1</code></pre>');

    return html;
  }
}

// Content Manager
class ContentManager {
  constructor() {
    this.pages = new Map();
    this.thesis = [];
    this.reflexion = [];
  }

  async loadMarkdownFile(path) {
    try {
      const response = await fetch(path);
      if (!response.ok) return null;
      return await response.text();
    } catch (error) {
      console.error('Error loading file:', path, error);
      return null;
    }
  }

  parseMetadata(content) {
    const lines = content.split('\n');
    const metadata = {};
    let bodyStart = 0;

    // Parse optional front matter (lines starting with key: value)
    for (let i = 0; i < Math.min(10, lines.length); i++) {
      if (lines[i].includes(':') && !lines[i].startsWith('#')) {
        const [key, value] = lines[i].split(':').map(s => s.trim());
        metadata[key.toLowerCase()] = value;
      } else if (lines[i].trim() === '') {
        bodyStart = i + 1;
        break;
      } else {
        bodyStart = i;
        break;
      }
    }

    const body = lines.slice(bodyStart).join('\n');
    return { metadata, body };
  }

  async loadThesisPages() {
    // List of thesis pages - du kannst das updaten
    const pages = [
      { id: '01-intro', file: 'content/thesis/01-intro.md', title: 'Einführung' },
      { id: '02-problem', file: 'content/thesis/02-problem.md', title: 'Problemstellung' },
      { id: '03-method', file: 'content/thesis/03-method.md', title: 'Methodologie' },
      { id: '04-results', file: 'content/thesis/04-results.md', title: 'Ergebnisse' },
      { id: '05-conclusion', file: 'content/thesis/05-conclusion.md', title: 'Fazit' },
    ];

    for (const page of pages) {
      const content = await this.loadMarkdownFile(page.file);
      if (content) {
        const { metadata, body } = this.parseMetadata(content);
        this.thesis.push({
          ...page,
          metadata,
          body,
          html: MarkdownParser.parse(body),
        });
        this.pages.set(`thesis-${page.id}`, {
          title: page.title,
          content: this.generateThesisPageHTML(page.title, this.pages.size, body),
        });
      }
    }
  }

  async loadReflexionPosts() {
    // Beispiel: du kannst die Liste auch dynamisch laden
    const posts = [
      { id: 'first-thoughts', file: 'content/reflexion/2024-10-29-first-thoughts.md' },
      { id: 'update-nov', file: 'content/reflexion/2024-11-15-update.md' },
      { id: 'test', file: 'content/reflexion/2026-10-29.md'},
      { id: 'test-update', file: 'content/reflexion/2026-10-29-update.md'},
    ];

    for (const post of posts) {
      const content = await this.loadMarkdownFile(post.file);
      if (content) {
        const { metadata, body } = this.parseMetadata(content);
        this.reflexion.push({
          ...post,
          metadata,
          body,
          html: MarkdownParser.parse(body),
        });
      }
    }

    // Sortiere nach Datum (neueste zuerst)
    this.reflexion.sort((a, b) => {
      const dateA = new Date(a.metadata.date || 0);
      const dateB = new Date(b.metadata.date || 0);
      return dateB - dateA;
    });

    this.pages.set('reflexion-index', {
      title: 'Reflexion',
      content: this.generateReflexionIndexHTML(),
    });
  }

  generateThesisPageHTML(title, order, body) {
    return `
      <article>
        <h2>${title}</h2>
        ${MarkdownParser.parse(body)}
        <nav class="chapter-nav">
          <a href="#thesis">← Zurück zur These</a>
        </nav>
      </article>
    `;
  }

  generateReflexionIndexHTML() {
    const items = this.reflexion
      .map(post => {
        const date = post.metadata.date ? new Date(post.metadata.date).toLocaleDateString('de-DE') : '—';
        const tags = post.metadata.tags ? post.metadata.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
        return `
          <li class="index-item">
            <h3><a href="#reflexion-${post.id}" class="index-link">${post.metadata.title || 'Untitled'}</a></h3>
            <div class="item-meta">
              <span class="post-date">${date}</span>
              ${tags.length > 0 ? `<div class="post-tags">${tags.map(t => `<a href="#reflexion?tag=${t}" class="tag">#${t}</a>`).join('')}</div>` : ''}
            </div>
          </li>
        `;
      })
      .join('');

    return `
      <section>
        <h2>Reflexion</h2>
        <p>Gedanken, Erkenntnisse und Fortschritt während der Masterarbeit.</p>
        <ul class="index-list">
          ${items}
        </ul>
      </section>
    `;
  }

  generateThesisIndexHTML() {
    const items = this.thesis
      .map(page => `
        <li class="index-item">
          <h3><a href="#thesis-${page.id}" class="index-link">${page.title}</a></h3>
        </li>
      `)
      .join('');

    return `
      <section>
        <h2>These</h2>
        <p>Überblick über die Masterarbeit in einzelnen Themen.</p>
        <ul class="index-list">
          ${items}
        </ul>
      </section>
    `;
  }
}

// Router
class Router {
  constructor(contentManager) {
    this.contentManager = contentManager;
    this.currentPage = 'home';
  }

  async route(page) {
    const contentEl = document.getElementById('content');
    let html = '';

    if (page === 'home') {
      html = this.renderHomePage();
    } else if (page === 'thesis-index') {
      html = this.contentManager.generateThesisIndexHTML();
    } else if (page === 'reflexion-index') {
      html = this.contentManager.generateReflexionIndexHTML();
    } else if (page.startsWith('thesis-')) {
      const id = page.slice(7);
      const thesisPage = this.contentManager.thesis.find(t => t.id === id);
      if (thesisPage) {
        html = this.contentManager.generateThesisPageHTML(thesisPage.title, 0, thesisPage.body);
      }
    } else if (page.startsWith('reflexion-')) {
      const id = page.slice(10);
      const post = this.contentManager.reflexion.find(r => r.id === id);
      if (post) {
        const date = post.metadata.date ? new Date(post.metadata.date).toLocaleDateString('de-DE') : '—';
        const tags = post.metadata.tags ? post.metadata.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
        html = `
          <article>
            <h2>${post.metadata.title || 'Untitled'}</h2>
            <div class="post-meta">
              <span class="post-date">${date}</span>
              ${tags.length > 0 ? `<div class="post-tags">${tags.map(t => `<a href="#reflexion?tag=${t}" class="tag">#${t}</a>`).join('')}</div>` : ''}
            </div>
            ${post.html}
            <nav class="chapter-nav">
              <a href="#reflexion">← Zurück zur Reflexion</a>
            </nav>
          </article>
        `;
      }
    }

    contentEl.innerHTML = html;
    this.updateNavigation(page);
  }

  renderHomePage() {
    return `
      <section>
                <p>Willkommen. Diese Seite dokumentiert meine Masterarbeit und den Reflexionsprozess.</p>
        
      </section>
    `;
  }

  updateNavigation(page) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (page === 'home' && link.dataset.page === 'home') {
        link.classList.add('active');
      } else if (page.startsWith('thesis') && link.dataset.page === 'thesis-index') {
        link.classList.add('active');
      } else if (page.startsWith('reflexion') && link.dataset.page === 'reflexion-index') {
        link.classList.add('active');
      }
    });
  }
}

// App Initialization
document.addEventListener('DOMContentLoaded', async () => {
  const contentManager = new ContentManager();
  const router = new Router(contentManager);

  // Load all content
  await contentManager.loadThesisPages();
  await contentManager.loadReflexionPosts();

  // Handle navigation
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      router.route(link.dataset.page);
    });
  });

  // Handle hash-based routing (für Links innerhalb des Contents)
  window.addEventListener('hashchange', () => {
    const hash = location.hash.slice(1) || 'home';
    router.route(hash);
  });

  // Initial page load
  const hash = location.hash.slice(1) || 'home';
  router.route(hash);

  // Footer
  const year = new Date().getFullYear();
  document.getElementById('footer-text').textContent = `© ${year} · Made with care`;
});
