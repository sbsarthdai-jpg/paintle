(function () {
  const { icon } = window.Paintle;

  function renderHeader() {
    const mount = document.getElementById('app-header');
    if (!mount) return;

    const page = document.body.dataset.page || '';

    const navItem = (href, label, key) =>
      `<a href="${href}" class="${page === key ? 'active' : ''}">${label}</a>`;

    mount.innerHTML = `
      <header class="site-header">
        <div class="container">
          <a href="index.html" class="brand">${icon('palette')}Paintle</a>

          <nav class="main-nav" id="mainNav">
            ${navItem('index.html', '홈', 'home')}
            ${navItem('gallery.html', '도안 갤러리', 'gallery')}
            ${navItem('myworks.html', '내 작품', 'myworks')}
          </nav>

          <div class="header-actions">
            <button class="btn btn-ghost btn-icon nav-toggle" id="navToggle" aria-label="메뉴">${icon('menu')}</button>
          </div>
        </div>
      </header>
    `;

    document.getElementById('navToggle')?.addEventListener('click', () => {
      document.getElementById('mainNav')?.classList.toggle('open');
    });
  }

  renderHeader();
})();
