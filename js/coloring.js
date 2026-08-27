(function () {
  const { icon, getTemplateById } = window.Paintle;

  const PALETTE = [
    '#EF4444', '#F97316', '#F59E0B', '#FACC15', '#84CC16', '#22C55E',
    '#10B981', '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6', '#D946EF',
    '#EC4899', '#F43F5E', '#92400E', '#1F2937', '#6B7280', '#FFFFFF',
  ];

  const BLANK_TEMPLATE = {
    id: 'blank',
    title: '빈 스케치북',
    category: '스케치북',
    src: null,
  };

  const params = new URLSearchParams(location.search);
  const requestedId = params.get('id');
  const template = requestedId === 'blank' ? BLANK_TEMPLATE : getTemplateById(requestedId);

  const main = document.getElementById('colorMain');

  if (!template) {
    main.innerHTML = `
      <div class="empty-state">
        ${icon('images')}
        <p>도안을 찾을 수 없어요.</p>
        <a href="gallery.html" class="btn btn-primary btn-sm">갤러리로 돌아가기</a>
      </div>
    `;
    return;
  }

  document.title = template.src ? `${template.title} 색칠하기 — Paintle` : `${template.title} — Paintle`;

  const pageUrl = `https://idyllic-biscuit-5e4c07.netlify.app/color.html?id=${template.id}`;
  const pageDescription = template.src
    ? `${template.title} 도안을 마우스로 자유롭게 색칠해보세요. ${template.category} 카테고리의 무료 색칠놀이 도안이에요.`
    : '빈 스케치북에 마우스로 자유롭게 그림을 그려보세요. 도안 없이 자유 낙서도 가능해요.';
  document.getElementById('metaDescription')?.setAttribute('content', pageDescription);
  document.getElementById('canonicalLink')?.setAttribute('href', pageUrl);
  document.getElementById('ogTitle')?.setAttribute('content', document.title);
  document.getElementById('ogDescription')?.setAttribute('content', pageDescription);
  document.getElementById('ogUrl')?.setAttribute('content', pageUrl);
  document.getElementById('twitterTitle')?.setAttribute('content', document.title);
  document.getElementById('twitterDescription')?.setAttribute('content', pageDescription);

  main.innerHTML = `
    <div class="color-page-head">
      <h1>${template.title}</h1>
      <span class="badge">${template.category}</span>
    </div>

    <div class="color-layout">
      <aside class="toolbar">
        <div class="toolbar-section">
          <h3>색상</h3>
          <div class="swatch-grid" id="swatchGrid"></div>
          <div class="custom-color-row">
            <input type="color" id="customColor" value="#3B82F6" />
            <span>커스텀 색상</span>
          </div>
        </div>

        <div class="toolbar-section">
          <h3>도구</h3>
          <div class="tool-toggle">
            <button class="btn btn-outline active" id="brushToolBtn">${icon('brush')}붓</button>
            <button class="btn btn-outline" id="eraserToolBtn">${icon('eraser')}지우개</button>
          </div>
        </div>

        <div class="toolbar-section">
          <h3>굵기</h3>
          <div class="brush-size-row">
            <input type="range" id="brushSize" min="2" max="40" value="14" />
            <div class="brush-preview"><span id="brushPreviewDot"></span></div>
          </div>
        </div>

        <div class="toolbar-section">
          <h3>작업</h3>
          <div class="toolbar-actions">
            <button class="btn btn-ghost btn-sm" id="undoBtn" disabled>${icon('undo')}실행취소</button>
            <button class="btn btn-ghost btn-sm" id="redoBtn" disabled>${icon('redo')}다시하기</button>
            <button class="btn btn-ghost btn-sm full" id="clearBtn">${icon('trash')}전체 지우기</button>
            <button class="btn btn-outline btn-sm full" id="downloadBtn">${icon('download')}다운로드</button>
            <button class="btn btn-primary btn-sm full" id="saveBtn">${icon('save')}내 작품에 저장</button>
          </div>
        </div>
      </aside>

      <div>
        <div class="canvas-stage" id="canvasStage">
          <canvas id="drawCanvas"></canvas>
          ${template.src ? `<img id="lineArt" src="${template.src}" alt="${template.title} 도안" />` : ''}
        </div>
        <p class="save-hint">${template.src ? '붓으로 도안 위를 칠해보세요.' : '빈 스케치북에 자유롭게 그려보세요.'} 저장하면 "내 작품" 페이지에서 다시 볼 수 있어요.</p>
      </div>
    </div>
  `;

  // ---------- swatches ----------
  const swatchGrid = document.getElementById('swatchGrid');
  swatchGrid.innerHTML = PALETTE.map(
    (c, i) => `<button class="swatch ${i === 8 ? 'active' : ''}" data-color="${c}" style="background:${c}" aria-label="${c}"></button>`
  ).join('');

  // ---------- state ----------
  const canvas = document.getElementById('drawCanvas');
  const stage = document.getElementById('canvasStage');
  const ctx = canvas.getContext('2d');
  const lineArtImg = template.src ? document.getElementById('lineArt') : null;

  let color = PALETTE[8];
  let tool = 'brush';
  let brushSize = 14;
  let cssWidth = 0;
  let cssHeight = 0;
  let drawing = false;
  let lastPoint = null;
  let history = [];
  let historyIndex = -1;

  function resizeCanvas() {
    const rect = stage.getBoundingClientRect();
    if (rect.width === 0) return;
    const dpr = window.devicePixelRatio || 1;
    let prevDataURL = null;
    if (cssWidth > 0) {
      prevDataURL = canvas.toDataURL('image/png');
    }
    cssWidth = rect.width;
    cssHeight = rect.height;
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
    canvas.style.width = cssWidth + 'px';
    canvas.style.height = cssHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (prevDataURL) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, cssWidth, cssHeight);
      img.src = prevDataURL;
    }
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function applyStyle() {
    ctx.lineWidth = brushSize;
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
  }

  function drawDot(p) {
    applyStyle();
    ctx.beginPath();
    ctx.arc(p.x, p.y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawSegment(a, b) {
    applyStyle();
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  canvas.addEventListener('pointerdown', (e) => {
    drawing = true;
    canvas.setPointerCapture(e.pointerId);
    lastPoint = getPos(e);
    drawDot(lastPoint);
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!drawing) return;
    const p = getPos(e);
    drawSegment(lastPoint, p);
    lastPoint = p;
  });

  window.addEventListener('pointerup', () => {
    if (drawing) {
      drawing = false;
      pushHistory();
    }
  });

  // ---------- history ----------
  const undoBtn = document.getElementById('undoBtn');
  const redoBtn = document.getElementById('redoBtn');

  function updateHistoryButtons() {
    undoBtn.disabled = historyIndex < 0;
    redoBtn.disabled = historyIndex >= history.length - 1;
  }

  function pushHistory() {
    const dataURL = canvas.toDataURL('image/png');
    history = history.slice(0, historyIndex + 1);
    history.push(dataURL);
    historyIndex = history.length - 1;
    updateHistoryButtons();
  }

  function restore(dataURL) {
    if (!dataURL) {
      ctx.clearRect(0, 0, cssWidth, cssHeight);
      return;
    }
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, cssWidth, cssHeight);
      ctx.drawImage(img, 0, 0, cssWidth, cssHeight);
    };
    img.src = dataURL;
  }

  undoBtn.addEventListener('click', () => {
    if (historyIndex < 0) return;
    historyIndex -= 1;
    restore(history[historyIndex]);
    updateHistoryButtons();
  });

  redoBtn.addEventListener('click', () => {
    if (historyIndex >= history.length - 1) return;
    historyIndex += 1;
    restore(history[historyIndex]);
    updateHistoryButtons();
  });

  document.getElementById('clearBtn').addEventListener('click', () => {
    ctx.clearRect(0, 0, cssWidth, cssHeight);
    pushHistory();
  });

  // ---------- color / tool controls ----------
  function setActiveSwatch(hex) {
    document.querySelectorAll('.swatch').forEach((s) => s.classList.toggle('active', s.dataset.color.toLowerCase() === hex.toLowerCase()));
  }

  swatchGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.swatch');
    if (!btn) return;
    color = btn.dataset.color;
    setActiveSwatch(color);
    setTool('brush');
  });

  document.getElementById('customColor').addEventListener('input', (e) => {
    color = e.target.value;
    setActiveSwatch(color);
    setTool('brush');
  });

  const brushToolBtn = document.getElementById('brushToolBtn');
  const eraserToolBtn = document.getElementById('eraserToolBtn');

  function setTool(next) {
    tool = next;
    brushToolBtn.classList.toggle('active', tool === 'brush');
    eraserToolBtn.classList.toggle('active', tool === 'eraser');
  }

  brushToolBtn.addEventListener('click', () => setTool('brush'));
  eraserToolBtn.addEventListener('click', () => setTool('eraser'));

  const brushSizeInput = document.getElementById('brushSize');
  const brushPreviewDot = document.getElementById('brushPreviewDot');

  function updateBrushPreview() {
    const size = Math.max(4, Math.min(28, brushSize));
    brushPreviewDot.style.width = size + 'px';
    brushPreviewDot.style.height = size + 'px';
  }

  brushSizeInput.addEventListener('input', (e) => {
    brushSize = Number(e.target.value);
    updateBrushPreview();
  });
  updateBrushPreview();

  // ---------- export / save ----------
  function exportMergedImage(size) {
    const out = document.createElement('canvas');
    out.width = size;
    out.height = size;
    const octx = out.getContext('2d');
    octx.fillStyle = '#FFFFFF';
    octx.fillRect(0, 0, size, size);
    octx.drawImage(canvas, 0, 0, size, size);
    if (lineArtImg) {
      octx.drawImage(lineArtImg, 0, 0, size, size);
    }
    return out.toDataURL('image/png');
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 1600);
  }

  document.getElementById('downloadBtn').addEventListener('click', () => {
    const dataURL = exportMergedImage(800);
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = `paintle-${template.id}.png`;
    a.click();
  });

  document.getElementById('saveBtn').addEventListener('click', () => {
    const dataURL = exportMergedImage(320);
    const works = JSON.parse(localStorage.getItem('paintle_my_works') || '[]');
    works.unshift({
      id: String(Date.now()),
      templateId: template.id,
      title: template.title,
      thumbnail: dataURL,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('paintle_my_works', JSON.stringify(works));
    showToast('내 작품에 저장했어요!');
  });

  updateHistoryButtons();
})();
