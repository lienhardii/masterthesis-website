function renderBlogPost(post) {
  const dateStr = new Date(post.date).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  let tagsHtml = '';
  if (post.tags && post.tags.length > 0) {
    tagsHtml = `
      <div class="post-tags">
        ${post.tags.map(tag => `<a href="#" class="tag" data-tag="${tag}">#${tag}</a>`).join('')}
      </div>
    `;
  }

  return `
    <article class="blog-post">
      <h2>${escapeHtml(post.title)}</h2>
      <div class="post-meta">
        <span class="post-date">${dateStr}</span>
        ${tagsHtml}
      </div>
      <div class="post-content">
        ${post.content}
      </div>
    </article>
  `;
}

function renderBlogPostsList(posts) {
  if (posts.length === 0) {
    return '<p>Noch keine Reflexions-Einträge vorhanden.</p>';
  }

  return `
    <div class="blog-posts-list">
      ${posts.map(post => renderBlogPost(post)).join('')}
    </div>
  `;
}
