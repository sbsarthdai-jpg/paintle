(function () {
  function renderFooter() {
    const mount = document.getElementById('app-footer');
    if (!mount) return;

    mount.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <p>© 2026 Paintle. 마우스로 칠하는 색칠 놀이터.</p>
          <div class="footer-links">
            <a href="about.html">소개</a>
            <a href="gallery.html">도안 갤러리</a>
            <a href="myworks.html">내 작품</a>
            <a href="terms.html">이용약관</a>
            <a href="privacy.html">개인정보처리방침</a>
          </div>
        </div>
      </footer>
    `;
  }

  renderFooter();
})();
