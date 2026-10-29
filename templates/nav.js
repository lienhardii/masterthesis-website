function renderNav(currentPage = 'start') {
  const nav = document.getElementById('nav-container');
  nav.innerHTML = `
    <nav>
      <button class="nav-btn ${currentPage === 'start' ? 'active' : ''}" data-page="start">Start</button>
      <button class="nav-btn ${currentPage === 'reflexion' ? 'active' : ''}" data-page="reflexion">Reflexion</button>
    </nav>
  `;

  // Add click handlers
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const page = e.target.dataset.page;
      app.setCurrentPage(page);
    });
  });
}

function setActiveNav(page) {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.page === page) {
      btn.classList.add('active');
    }
  });
}