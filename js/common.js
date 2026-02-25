/**
 * Common Utilities
 */
const App = (function () {
  'use strict';

  /** DOM 유틸 */
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  /** 초기화 */
  function init() {
    console.log('[App] initialized');
    _restoreSettings();
    _bindEvents();
  }

  /** localStorage 설정 복원 (페이지 로드 시) */
  function _restoreSettings() {
    if (localStorage.getItem('lsw-dark-mode') === 'true') {
      document.body.classList.add('lsw-dark-mode');
      const chk = $('#darkModeToggle');
      if (chk) chk.checked = true;
    }
    if (localStorage.getItem('lsw-font-large') === 'true') {
      document.body.classList.add('lsw-font-large');
      const chk = $('#fontSizeToggle');
      if (chk) chk.checked = true;
    }
  }

  /** 공통 이벤트 바인딩 */
  function _bindEvents() {
    // ============================
    // 모바일 전체메뉴 드로어 토글
    // ============================
    const mobileNav   = $('#mobile-nav');
    const navOpenBtn  = $('[aria-controls="mobile-nav"]');
    const navCloseBtn = $('#close-nav');

    function openNav() {
      if (!mobileNav) return;
      mobileNav.classList.add('is-open');
      mobileNav.removeAttribute('hidden');
      if (navOpenBtn) navOpenBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeNav() {
      if (!mobileNav) return;
      mobileNav.classList.remove('is-open');
      if (navOpenBtn) navOpenBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    if (navOpenBtn)  navOpenBtn.addEventListener('click', openNav);
    if (navCloseBtn) navCloseBtn.addEventListener('click', closeNav);

    // ============================
    // 카테고리 오버레이 레이어 토글
    // ============================
    (function initPulldownLayer() {
      const layer = document.getElementById('pulldownLayer');
      const backdrop = document.getElementById('pulldownBackdrop');
      const closeBtn = document.getElementById('pulldownClose');
      if (!layer) return;

      function openLayer() {
        layer.classList.add('is-open');
        if (backdrop) backdrop.classList.add('is-open');
        layer.setAttribute('aria-hidden', 'false');
      }

      function closeLayer() {
        layer.classList.remove('is-open');
        if (backdrop) backdrop.classList.remove('is-open');
        layer.setAttribute('aria-hidden', 'true');
      }

      if (closeBtn) closeBtn.addEventListener('click', closeLayer);
      if (backdrop) backdrop.addEventListener('click', closeLayer);

      // 페이지 로드 시 자동 열기
      setTimeout(openLayer, 500);
    })();

    // 빠른메뉴 단축 액션 라우팅 (위임)
    document.addEventListener('click', function (e) {
      const quickBtn = e.target.closest('.lsw-quick-btn');
      if (!quickBtn) return;
      const action = quickBtn.dataset.action;
      if (!action) return;
      e.preventDefault();
      switch (action) {
        case 'toc':
          openToc();
          break;
        case 'compare':
          openCompare('');
          break;
        case 'threeway':
          alert('3단비교는 추후 제공 예정입니다.');
          break;
        case 'raw':
          alert('원문변환은 추후 제공 예정입니다.');
          break;
        case 'cases':
          alert('관련판례는 추후 제공 예정입니다.');
          break;
        case 'history':
          alert('연혁은 추후 제공 예정입니다.');
          break;
        case 'reason':
          alert('상개이유는 추후 제공 예정입니다.');
          break;
        default:
          break;
      }
    });

    // 하단 탭바 아이템 클릭 (law-detail 페이지)
    $$('.lsw-tabbar-item').forEach((item) => {
      const btn = item.querySelector('.lsw-tabbar-btn');
      if (btn) {
        btn.addEventListener('click', function () {
          const isMore = this.id === 'tabMore';
          if (isMore) {
            openTabMore();
            return;
          }
          // 단일 활성 상태 유지
          $$('.lsw-tabbar-item').forEach((it) => {
            it.classList.remove('active');
            it.setAttribute('aria-selected', 'false');
          });
          item.classList.add('active');
          item.setAttribute('aria-selected', 'true');
        });
      }
    });

    // 탭 더보기 바텀 시트
    const tabMoreSheet   = $('#tabMoreSheet');
    const tabMoreOverlay = $('#tabMoreOverlay');
    const tabMoreBtn     = $('#tabMore');

    function openTabMore() {
      if (!tabMoreSheet) return;
      tabMoreSheet.removeAttribute('hidden');
      requestAnimationFrame(() => tabMoreSheet.classList.add('is-open'));
      if (tabMoreOverlay) tabMoreOverlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      if (tabMoreBtn) tabMoreBtn.setAttribute('aria-expanded', 'true');
    }

    function closeTabMore() {
      if (!tabMoreSheet) return;
      tabMoreSheet.classList.remove('is-open');
      if (tabMoreOverlay) tabMoreOverlay.classList.remove('is-open');
      document.body.style.overflow = '';
      if (tabMoreBtn) tabMoreBtn.setAttribute('aria-expanded', 'false');
      setTimeout(() => tabMoreSheet.setAttribute('hidden', ''), 300);
    }

    if (tabMoreOverlay) tabMoreOverlay.addEventListener('click', closeTabMore);
    $$("[data-more-action]").forEach((btn) => {
      btn.addEventListener('click', function () {
        const act = this.dataset.moreAction;
        alert(`${act} 기능은 추후 제공 예정입니다.`);
        closeTabMore();
      });
    });

    // 플로팅 FAB → 화면 설정 바텀 시트 (index.html)
    const fabToggleBtn      = $('#fabToggleBtn');
    const fabSettingsSheet   = $('#fabSettingsSheet');
    const fabSettingsOverlay = $('#fabSettingsOverlay');

    function openFabSettings() {
      if (!fabSettingsSheet) return;
      fabSettingsSheet.removeAttribute('hidden');
      requestAnimationFrame(() => fabSettingsSheet.classList.add('is-open'));
      if (fabSettingsOverlay) fabSettingsOverlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      if (fabToggleBtn) fabToggleBtn.setAttribute('aria-expanded', 'true');
    }
    function closeFabSettings() {
      if (!fabSettingsSheet) return;
      fabSettingsSheet.classList.remove('is-open');
      if (fabSettingsOverlay) fabSettingsOverlay.classList.remove('is-open');
      document.body.style.overflow = '';
      if (fabToggleBtn) fabToggleBtn.setAttribute('aria-expanded', 'false');
      setTimeout(() => { fabSettingsSheet.setAttribute('hidden', ''); }, 300);
    }

    if (fabToggleBtn) {
      fabToggleBtn.addEventListener('click', function () {
        const isOpen = this.getAttribute('aria-expanded') === 'true';
        isOpen ? closeFabSettings() : openFabSettings();
      });
    }
    if (fabSettingsOverlay) {
      fabSettingsOverlay.addEventListener('click', closeFabSettings);
    }

    // ============================
    // 검색 드롭다운 (메인 페이지)
    // ============================
    const searchInput    = $('#lsw-search');
    const searchDropdown = $('#searchDropdown');

    if (searchInput && searchDropdown) {
      // 포커스 시 드롭다운 열기
      searchInput.addEventListener('focus', () => {
        searchDropdown.classList.add('is-open');
      });
      // 외부 클릭 시 닫기
      document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
          searchDropdown.classList.remove('is-open');
        }
      });
      // 인기 검색어 칩 클릭 → 입력창 채우기
      $$('.lsw-search-chip').forEach((chip) => {
        chip.addEventListener('click', function () {
          searchInput.value = this.textContent.trim();
          searchDropdown.classList.remove('is-open');
          searchInput.focus();
        });
      });
      // 최근 검색어 클릭 → 입력창 채우기
      $$('.lsw-recent-item').forEach((item) => {
        item.addEventListener('click', function () {
          // 아이콘 svg 텍스트 제외하고 순수 텍스트만 추출
          const text = Array.from(this.childNodes)
            .filter(n => n.nodeType === Node.TEXT_NODE)
            .map(n => n.textContent.trim())
            .join('');
          searchInput.value = text || this.textContent.trim();
          searchDropdown.classList.remove('is-open');
          searchInput.focus();
        });
      });
      // 최근 검색어 삭제 버튼
      $$('.lsw-recent-delete').forEach((btn) => {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          this.closest('li').remove();
        });
      });
    }

    // ============================
    // 목차 트리 드로어 (법령 상세 페이지)
    // ============================
    const tocBtn       = $('#tocBtn');
    const tocDrawer    = $('#tocDrawer');
    const tocOverlay   = $('#tocOverlay');
    const tocCloseBtn  = $('#tocCloseBtn');

    function openToc() {
      if (!tocDrawer) return;
      tocDrawer.removeAttribute('hidden');
      requestAnimationFrame(() => tocDrawer.classList.add('is-open'));
      tocOverlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      if (tocBtn) tocBtn.setAttribute('aria-expanded', 'true');
    }
    function closeToc() {
      if (!tocDrawer) return;
      tocDrawer.classList.remove('is-open');
      tocOverlay.classList.remove('is-open');
      document.body.style.overflow = '';
      if (tocBtn) tocBtn.setAttribute('aria-expanded', 'false');
      // hidden 복원은 transition 후
      setTimeout(() => { tocDrawer.setAttribute('hidden', ''); }, 300);
    }

    if (tocBtn)      tocBtn.addEventListener('click', openToc);
    if (tocCloseBtn) tocCloseBtn.addEventListener('click', closeToc);
    if (tocOverlay)  tocOverlay.addEventListener('click', closeToc);

    // 목차 항목 클릭 → 해당 조문으로 스크롤
    $$('.lsw-toc-article-link').forEach((link) => {
      link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          closeToc();
          setTimeout(() => {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 350);
        }
        $$('.lsw-toc-article-link').forEach(l => l.classList.remove('is-current'));
        this.classList.add('is-current');
      });
    });

    // ============================
    // 조문 액션 바텀 시트 (법령 상세 페이지)
    // ============================
    const actionSheet        = $('#articleActionSheet');
    const actionSheetOverlay = $('#actionSheetOverlay');
    const actionSheetTitle   = $('#actionSheetTitle');

    function openActionSheet(title) {
      if (!actionSheet) return;
      if (actionSheetTitle) actionSheetTitle.textContent = title;
      actionSheet.removeAttribute('hidden');
      requestAnimationFrame(() => actionSheet.classList.add('is-open'));
      actionSheetOverlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function closeActionSheet() {
      if (!actionSheet) return;
      actionSheet.classList.remove('is-open');
      actionSheetOverlay.classList.remove('is-open');
      document.body.style.overflow = '';
      setTimeout(() => { actionSheet.setAttribute('hidden', ''); }, 300);
    }

    $$('.lsw-article-action-btn').forEach((btn) => {
      btn.addEventListener('click', function () {
        const title = this.dataset.article || '조문';
        openActionSheet(title);
      });
    });

    if (actionSheetOverlay) actionSheetOverlay.addEventListener('click', closeActionSheet);

    // 바텀 시트 내 항목 피드백
    $$('.lsw-action-sheet-item button').forEach((btn) => {
      btn.addEventListener('click', function () {
        const label = this.textContent.trim();
        // 복사 기능 구현 예시
        if (label.includes('복사')) {
          const article = document.querySelector(
            `[data-article="${actionSheetTitle?.textContent}"]`
          )?.closest('.lsw-article');
          if (article && navigator.clipboard) {
            navigator.clipboard.writeText(article.innerText.trim());
          }
        }
        closeActionSheet();
      });
    });

    // ============================
    // 목차 챕터 아코디언 토글 (법령 상세)
    // ============================
    $$('.lsw-toc-chapter-toggle').forEach((btn) => {
      btn.addEventListener('click', function () {
        const isExpanded = this.classList.toggle('is-expanded');
        this.setAttribute('aria-expanded', isExpanded);
        const list = this.nextElementSibling;
        if (list && list.tagName === 'UL') {
          list.hidden = !isExpanded;
        }
      });
    });

    // ============================
    // 읽기 설정 바텀 시트 (법령 상세)
    // ============================
    const readingSettings        = $('#readingSettings');
    const readingSettingsOverlay = $('#readingSettingsOverlay');
    const readingSettingsBtn     = $('#readingSettingsBtn');
    const tabReadingSettings     = $('#tabReadingSettings');

    function openReadingSettings() {
      if (!readingSettings) return;
      readingSettings.removeAttribute('hidden');
      requestAnimationFrame(() => readingSettings.classList.add('is-open'));
      readingSettingsOverlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      if (readingSettingsBtn) readingSettingsBtn.setAttribute('aria-expanded', 'true');
    }
    function closeReadingSettings() {
      if (!readingSettings) return;
      readingSettings.classList.remove('is-open');
      readingSettingsOverlay.classList.remove('is-open');
      document.body.style.overflow = '';
      if (readingSettingsBtn) readingSettingsBtn.setAttribute('aria-expanded', 'false');
      setTimeout(() => { readingSettings.setAttribute('hidden', ''); }, 300);
    }

    if (readingSettingsBtn)     readingSettingsBtn.addEventListener('click', openReadingSettings);
    if (tabReadingSettings)     tabReadingSettings.addEventListener('click', openReadingSettings);
    if (readingSettingsOverlay) readingSettingsOverlay.addEventListener('click', closeReadingSettings);



    // ============================
    // 다크모드 / 큰글씨 — 읽기 설정 체크박스 (law-detail.html)
    // ============================
    const darkModeToggle = $('#darkModeToggle');
    if (darkModeToggle) {
      darkModeToggle.checked = document.body.classList.contains('lsw-dark-mode');
      darkModeToggle.addEventListener('change', function () {
        const isActive = this.checked;
        document.body.classList.toggle('lsw-dark-mode', isActive);
        localStorage.setItem('lsw-dark-mode', String(isActive));
        if (isActive) {
          document.body.classList.remove('lsw-high-contrast');
          localStorage.removeItem('lsw-high-contrast');
          const hc = $('#highContrastToggle');
          if (hc) hc.checked = false;
        }
      });
    }

    const fontSizeToggle = $('#fontSizeToggle');
    if (fontSizeToggle) {
      fontSizeToggle.checked = document.body.classList.contains('lsw-font-large');
      fontSizeToggle.addEventListener('change', function () {
        const isActive = this.checked;
        document.body.classList.toggle('lsw-font-large', isActive);
        localStorage.setItem('lsw-font-large', String(isActive));
      });
    }

    // 고대비 토글
    const highContrastToggle = $('#highContrastToggle');
    if (highContrastToggle) {
      highContrastToggle.addEventListener('change', function () {
        document.body.classList.toggle('lsw-high-contrast', this.checked);
        // 고대비 활성 시 다크 모드 해제
        if (this.checked) {
          document.body.classList.remove('lsw-dark-mode');
          localStorage.setItem('lsw-dark-mode', 'false');
          const dm = $('#darkModeToggle');
          if (dm) dm.checked = false;
        }
      });
    }

    // 줄간격 옵션
    $$('[data-lh]').forEach((btn) => {
      btn.addEventListener('click', function () {
        $$('[data-lh]').forEach(b => b.classList.remove('is-active'));
        this.classList.add('is-active');
        const lh = this.dataset.lh;
        const contentArea = $('.lsw-law-body') || $('.content-inner');
        if (contentArea) contentArea.style.lineHeight = lh;
      });
    });

    // 본문 너비 옵션
    $$('[data-width]').forEach((btn) => {
      btn.addEventListener('click', function () {
        $$('[data-width]').forEach(b => b.classList.remove('is-active'));
        this.classList.add('is-active');
        const contentArea = $('.content-inner');
        if (!contentArea) return;
        if (this.dataset.width === 'narrow') {
          contentArea.style.maxWidth = '360px';
          contentArea.style.margin = '0 auto';
        } else {
          contentArea.style.maxWidth = '';
          contentArea.style.margin = '';
        }
      });
    });

    // ============================
    // 신구법 비교 레이어 (법령 상세)
    // ============================
    const compareSheet   = $('#compareSheet');
    const compareOverlay = $('#compareOverlay');
    const compareCloseBtn = $('#compareCloseBtn');

    function openCompare(articleName) {
      if (!compareSheet) return;
      compareSheet.removeAttribute('hidden');
      requestAnimationFrame(() => compareSheet.classList.add('is-open'));
      if (compareOverlay) compareOverlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function closeCompare() {
      if (!compareSheet) return;
      compareSheet.classList.remove('is-open');
      if (compareOverlay) compareOverlay.classList.remove('is-open');
      document.body.style.overflow = '';
      setTimeout(() => { compareSheet.setAttribute('hidden', ''); }, 300);
    }

    $$('.lsw-compare-trigger').forEach((btn) => {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const article = this.dataset.article || '';
        openCompare(article);
      });
    });

    if (compareCloseBtn) compareCloseBtn.addEventListener('click', closeCompare);
    if (compareOverlay)  compareOverlay.addEventListener('click', closeCompare);

    // ============================
    // 플로팅 조문 액션 툴바 (법령 상세)
    // ============================
    const floatingToolbar = $('#floatingArticleToolbar');
    let selectedArticle = null;

    $$('.lsw-article').forEach((article) => {
      article.addEventListener('click', function (e) {
        // 이미 선택된 조문이면 해제
        if (selectedArticle === this) {
          deselectArticle();
          return;
        }
        // 액션 버튼이나 비교 트리거 클릭 시 무시
        if (e.target.closest('.lsw-article-action-btn') || e.target.closest('.lsw-compare-trigger')) return;

        // 기존 선택 해제
        if (selectedArticle) selectedArticle.classList.remove('is-selected');

        selectedArticle = this;
        this.classList.add('is-selected');
        showFloatingToolbar();
      });
    });

    function showFloatingToolbar() {
      if (!floatingToolbar) return;
      floatingToolbar.removeAttribute('hidden');
      requestAnimationFrame(() => floatingToolbar.classList.add('is-visible'));
    }

    function hideFloatingToolbar() {
      if (!floatingToolbar) return;
      floatingToolbar.classList.remove('is-visible');
      setTimeout(() => { floatingToolbar.setAttribute('hidden', ''); }, 200);
    }

    function deselectArticle() {
      if (selectedArticle) selectedArticle.classList.remove('is-selected');
      selectedArticle = null;
      hideFloatingToolbar();
    }

    // 외부 클릭 시 조문 선택 해제
    document.addEventListener('click', function (e) {
      if (!floatingToolbar || !selectedArticle) return;
      if (e.target.closest('.lsw-article') || e.target.closest('.lsw-floating-toolbar')) return;
      deselectArticle();
    });

    // 플로팅 툴바 버튼 액션
    $$('.lsw-ftb-btn').forEach((btn) => {
      btn.addEventListener('click', function () {
        const action = this.dataset.action;
        const articleTitle = selectedArticle?.querySelector('.lsw-article-title')?.textContent?.trim() || '조문';
        switch (action) {
          case 'copy':
            if (selectedArticle && navigator.clipboard) {
              navigator.clipboard.writeText(selectedArticle.innerText.trim());
            }
            break;
          case 'share':
          case 'cases':
          case 'memo':
            alert(`"${articleTitle}" ${action} 기능은 추후 구현 예정입니다.`);
            break;
          case 'more':
            openActionSheet(articleTitle);
            break;
        }
        deselectArticle();
      });
    });

    // ============================
    // ESC 키로 드로어/바텀시트 닫기
    // ============================
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (compareSheet && compareSheet.classList.contains('is-open'))           closeCompare();
      if (tabMoreSheet && tabMoreSheet.classList.contains('is-open'))          closeTabMore();
      if (readingSettings && readingSettings.classList.contains('is-open'))     closeReadingSettings();
      if (tocDrawer && tocDrawer.classList.contains('is-open'))                closeToc();
      if (actionSheet && actionSheet.classList.contains('is-open'))            closeActionSheet();
      if (floatingToolbar && floatingToolbar.classList.contains('is-visible')) deselectArticle();
      if (mobileNav && mobileNav.classList.contains('is-open')) {
        closeNav();
        if (navOpenBtn) navOpenBtn.focus();
      }
    });
  }

  return { init, $, $$ };
})();

document.addEventListener('DOMContentLoaded', App.init);
