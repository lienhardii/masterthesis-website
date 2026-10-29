function renderSection(title, content, id = '') {
  return `
    <section id="${id}" class="section">
      
      <div class="section-content">
        ${content}
      </div>
    </section>
  `;
}

function renderIntro(content) {
  return `
    <div class="intro-section">
      ${content}
    </div>
  `;
}

// Render thesis overview as grid (3-spaltig responsive)
function renderThesisGrid(thesisSections) {
  const gridItems = thesisSections.map(section => `
    <div class="pure-u-1 pure-u-md-1-3">
      <div class="pure-panel">
        
        <div class="section-preview">
          ${section.content.substring(0, 200)}...
        </div>
      </div>
    </div>
  `).join('');

  return `
    <div class="pure-g">
      ${gridItems}
    </div>
  `;
}

// Render thesis sections as full-width (stacked)
function renderThesisSections(thesisSections) {
  return thesisSections.map(section => 
    renderSection(section.title, section.content, `thesis-${section.title.toLowerCase().replace(/\s+/g, '-')}`)
  ).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}