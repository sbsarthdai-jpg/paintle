(function () {
  window.Paintle = window.Paintle || {};
  const { icon } = window.Paintle;

  function templateCardHTML(t) {
    return `
      <article class="card template-card">
        <a href="color.html?id=${t.id}" class="template-thumb">
          <img src="${t.src}" alt="${t.title} 도안" />
        </a>
        <div class="template-body">
          <div class="template-title">${t.title}</div>
          <div class="template-meta">
            <span class="badge">${t.category}</span>
            <span>${icon('star')} ${t.popularity.toLocaleString()}</span>
          </div>
          <div class="template-actions">
            <a href="color.html?id=${t.id}" class="btn btn-primary btn-sm">${icon('brush')}칠하기</a>
          </div>
        </div>
      </article>
    `;
  }

  window.Paintle.templateCardHTML = templateCardHTML;
})();
