/**
 * App - 페이지 스크립트
 */
(function () {
  'use strict';

  // 모바일 전체메뉴 탭/ARIA 상태 제어
  document.addEventListener('DOMContentLoaded', () => {
    const mobileNav = document.querySelector('#mobile-nav.krds-main-menu-mobile');
    if (!mobileNav) return;

    const tabTriggers = mobileNav.querySelectorAll('.gnb-tab-nav .gnb-main-trigger');
    const gnbBody = mobileNav.querySelector('.gnb-body');
    const openBtn = document.querySelector('[aria-controls="mobile-nav"]');
    const closeBtn = mobileNav.querySelector('#close-nav');

    const setActiveTab = (targetId) => {
      tabTriggers.forEach((trigger) => {
        const isMatch = trigger.getAttribute('href') === `#${targetId}`;
        trigger.classList.toggle('active', isMatch);
        trigger.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      });
    };

    // 탭 클릭 시 활성화 및 패널 스크롤
    tabTriggers.forEach((trigger) => {
      trigger.addEventListener('click', (event) => {
        event.preventDefault();
        const targetId = trigger.getAttribute('href')?.replace('#', '');
        if (!targetId) return;
        setActiveTab(targetId);
        const targetPanel = mobileNav.querySelector(`#${targetId}`);
        if (targetPanel && gnbBody) {
          gnbBody.scrollTo({ top: targetPanel.offsetTop, behavior: 'smooth' });
        }
      });
    });

    // 초기 탭 상태 보정
    const firstActive = mobileNav.querySelector('.gnb-tab-nav .gnb-main-trigger.active');
    const defaultId = firstActive?.getAttribute('href')?.replace('#', '') || tabTriggers[0]?.getAttribute('href')?.replace('#', '');
    if (defaultId) setActiveTab(defaultId);

    // aria-expanded 동기화
    const syncExpanded = () => {
      const isOpen = mobileNav.classList.contains('is-open');
      openBtn?.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };

    openBtn?.addEventListener('click', () => {
      requestAnimationFrame(syncExpanded);
    });

    closeBtn?.addEventListener('click', () => {
      requestAnimationFrame(syncExpanded);
    });

    // 클래스 변화를 감지해 외부 요인(ESC, 리사이즈)에도 대응
    const observer = new MutationObserver(syncExpanded);
    observer.observe(mobileNav, { attributes: true, attributeFilter: ['class'] });
  });

})();
