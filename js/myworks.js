(function () {
  const { icon } = window.Paintle;

  const main = document.getElementById('myworksMain');

  function worksList() {
    try {
      return JSON.parse(localStorage.getItem('paintle_my_works') || '[]');
    } catch {
      return [];
    }
  }

  function formatDate(iso) {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  }

  function workCardHTML(w) {
    return `
      <article class="card" data-work-id="${w.id}">
        <div class="work-card-thumb">
          <img src="${w.thumbnail}" alt="${w.title}" style="width:100%;height:100%;object-fit:contain;" />
        </div>
        <div class="work-card-body">
          <div class="template-title">${w.title}</div>
          <div class="work-card-date">${formatDate(w.createdAt)}에 저장됨</div>
          <div class="work-card-actions">
            <a href="color.html?id=${w.templateId}" class="btn btn-outline btn-sm">${icon('brush')}다시 칠하기</a>
            <button class="btn btn-ghost btn-sm delete-work-btn" data-id="${w.id}">${icon('trash')}삭제</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderWorks() {
    const works = worksList();
    const grid = document.getElementById('worksGrid');
    const empty = document.getElementById('worksEmpty');
    grid.hidden = works.length === 0;
    empty.hidden = works.length > 0;
    grid.innerHTML = works.map(workCardHTML).join('');
  }

  main.innerHTML = `
    <div class="section-head">
      <h1>내 작품</h1>
    </div>
    <p class="save-hint" style="text-align:left;margin-bottom:24px;">이 브라우저에 저장된 색칠 작품이에요. 브라우저 저장 공간을 지우면 함께 사라져요.</p>
    <div class="works-grid" id="worksGrid"></div>
    <div class="empty-state" id="worksEmpty" hidden>
      ${icon('images')}
      <p>아직 저장한 작품이 없어요. 도안을 골라 색칠해보세요!</p>
      <a href="gallery.html" class="btn btn-primary btn-sm">도안 갤러리로 가기</a>
    </div>
  `;

  document.getElementById('worksGrid').addEventListener('click', (e) => {
    const btn = e.target.closest('.delete-work-btn');
    if (!btn) return;
    const id = btn.dataset.id;
    const works = worksList().filter((w) => w.id !== id);
    localStorage.setItem('paintle_my_works', JSON.stringify(works));
    renderWorks();
  });

  renderWorks();
})();
