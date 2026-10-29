function renderFooter() {
  const footer = document.getElementById('footer-container');
  const year = new Date().getFullYear();
  footer.innerHTML = `
    <footer>
      <div class="container">
        <p>&copy; ${year} Masterarbeit.</p>
      </div>
    </footer>
  `;
}

// Call on page load
renderFooter();
