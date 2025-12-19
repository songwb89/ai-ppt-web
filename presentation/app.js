// 演示系统核心逻辑

let currentPage = 0;
const totalPages = config.pages.length;

// DOM 元素
const contentFrame = document.getElementById('contentFrame');

const assetsTrigger = document.getElementById('assetsTrigger');
const pageIndicator = document.getElementById('pageIndicator');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const lightbox = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightboxContent');
const lightboxClose = document.getElementById('lightboxClose');

// 初始化
function init() {
  loadPage(0);
  bindEvents();
  updateNavButtons();
  
  // 初次打开显示底部控件5秒
  const bottomControls = document.querySelectorAll('.hover-show');
  const navHint = document.getElementById('navHint');
  
  bottomControls.forEach(el => el.classList.add('visible'));
  if (navHint) navHint.style.opacity = '1';
  
  setTimeout(() => {
    bottomControls.forEach(el => el.classList.remove('visible'));
    if (navHint) navHint.style.opacity = '0';
  }, 10000);
}

// 加载页面内容（带白色遮罩过渡效果）
let isTransitioning = false;
const pageOverlay = document.getElementById('pageOverlay');

function loadPage(index) {
  if (index < 0 || index >= totalPages || isTransitioning) return;
  if (index === currentPage && contentFrame.src !== '') return;
  
  const isFirstLoad = contentFrame.src === '' || contentFrame.src === window.location.href;
  const pageConfig = config.pages[index];
  
  if (isFirstLoad) {
    // 首次加载，直接显示
    currentPage = index;
    contentFrame.src = pageConfig.src;
    updateAssets(pageConfig.assets || []);
    pageIndicator.textContent = `${currentPage + 1} / ${totalPages}`;
    updateNavButtons();
  } else {
    // 切页时使用白色遮罩过渡
    isTransitioning = true;
    pageOverlay.classList.add('active');
    
    setTimeout(() => {
      currentPage = index;
      contentFrame.src = pageConfig.src;
      updateAssets(pageConfig.assets || []);
      pageIndicator.textContent = `${currentPage + 1} / ${totalPages}`;
      updateNavButtons();
    }, 250);
  }
}

// iframe 加载完成后移除遮罩，并绑定键盘事件
contentFrame.addEventListener('load', () => {
  if (isTransitioning) {
    setTimeout(() => {
      pageOverlay.classList.remove('active');
      isTransitioning = false;
    }, 50);
  }
  
  // 给 iframe 内部绑定键盘事件，转发到主页面
  try {
    const iframeDoc = contentFrame.contentDocument || contentFrame.contentWindow.document;
    iframeDoc.addEventListener('keydown', handleKeydown);
  } catch (e) {
    // 跨域 iframe 无法访问，忽略
  }
});

// 更新素材列表 - 浮动图标方式
function updateAssets(assets) {
  if (!assets || assets.length === 0) {
    assetsTrigger.classList.add('hidden');
    assetsTrigger.innerHTML = '';
    return;
  }
  
  assetsTrigger.classList.remove('hidden');
  
  assetsTrigger.innerHTML = assets.map((asset, idx) => {
    let icon, bgColor, hoverColor, shadowColor;
    if (asset.type === 'video') {
      icon = 'fa-circle-play';
      bgColor = 'bg-purple-500';
      hoverColor = 'hover:bg-purple-600';
      shadowColor = 'shadow-purple-500/30';
    } else if (asset.type === 'page') {
      icon = 'fa-window-maximize';
      bgColor = 'bg-green-500';
      hoverColor = 'hover:bg-green-600';
      shadowColor = 'shadow-green-500/30';
    } else if (asset.type === 'link') {
      icon = 'fa-arrow-up-right-from-square';
      bgColor = 'bg-blue-500';
      hoverColor = 'hover:bg-blue-600';
      shadowColor = 'shadow-blue-500/30';
    } else {
      icon = 'fa-image';
      bgColor = 'bg-indigo-500';
      hoverColor = 'hover:bg-indigo-600';
      shadowColor = 'shadow-indigo-500/30';
    }
    
    const label = asset.label || asset.title || (asset.type === 'video' ? '视频' : asset.type === 'page' ? '页面' : asset.type === 'link' ? '外部链接' : '图片');
    return `
      <button class="asset-icon w-9 h-9 rounded-lg ${bgColor} ${hoverColor} text-white text-sm cursor-pointer border-none transition-all flex items-center justify-center shadow-md ${shadowColor}" 
              data-index="${idx}" data-type="${asset.type}" data-src="${asset.src}" title="${label}">
        <i class="fa-solid ${icon}"></i>
      </button>
    `;
  }).join('');
}

// 渲染目录列表
function renderTocList() {
  const tocList = document.getElementById('tocList');
  tocList.innerHTML = config.pages.map((page, idx) => {
    const isActive = idx === currentPage;
    return `
      <div class="toc-item flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50 text-gray-700'}" 
           data-index="${idx}">
        <span class="w-6 h-6 rounded-full ${isActive ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-500'} text-xs flex items-center justify-center font-medium">${idx + 1}</span>
        <span class="text-sm">${page.title || '未命名'}</span>
      </div>
    `;
  }).join('');
}

// 更新导航按钮状态
function updateNavButtons() {
  prevBtn.disabled = currentPage === 0;
  nextBtn.disabled = currentPage === totalPages - 1;
}

// 上一页
function goPrev() {
  if (currentPage > 0) {
    loadPage(currentPage - 1);
  }
}

// 下一页
function goNext() {
  if (currentPage < totalPages - 1) {
    loadPage(currentPage + 1);
  }
}

// 打开 Lightbox（图片/视频/页面/链接）
function openLightbox(type, src) {
  if (type === 'image') {
    lightboxContent.innerHTML = `<img src="${src}" alt="" class="max-w-[90vw] max-h-[90vh] object-contain">`;
    lightbox.classList.add('active');
  } else if (type === 'video') {
    lightboxContent.innerHTML = `<video src="${src}" controls autoplay class="max-w-[90vw] max-h-[90vh]"></video>`;
    lightbox.classList.add('active');
  } else if (type === 'page' || type === 'link') {
    openPageModal(src);
  }
}

// 关闭 Lightbox
function closeLightbox() {
  lightbox.classList.remove('active');
  const video = lightboxContent.querySelector('video');
  if (video) video.pause();
  lightboxContent.innerHTML = '';
}

// 打开页面预览模态窗
function openPageModal(src) {
  const pageModal = document.getElementById('pageModal');
  const pageModalFrame = document.getElementById('pageModalFrame');
  pageModalFrame.src = src;
  pageModal.classList.add('active');
}

// 关闭页面预览模态窗
function closePageModal() {
  const pageModal = document.getElementById('pageModal');
  const pageModalFrame = document.getElementById('pageModalFrame');
  pageModal.classList.remove('active');
  pageModalFrame.src = '';
}

// 打开目录抽屉
function openTocDrawer() {
  renderTocList();
  document.getElementById('tocDrawer').classList.add('open');
  document.getElementById('tocBackdrop').classList.add('open');
}

// 关闭目录抽屉
function closeTocDrawer() {
  document.getElementById('tocDrawer').classList.remove('open');
  document.getElementById('tocBackdrop').classList.remove('open');
}

// 全屏切换
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    fullscreenBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
  } else {
    document.exitFullscreen();
    fullscreenBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
  }
}

// 键盘事件处理函数
function handleKeydown(e) {
  if (lightbox.classList.contains('active')) {
    if (e.key === 'Escape') closeLightbox();
    return;
  }
  
  if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
    goPrev();
  } else if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
    e.preventDefault();
    goNext();
  } else if (e.key === 'Home') {
    loadPage(0);
  } else if (e.key === 'End') {
    loadPage(totalPages - 1);
  } else if (e.key === 'f' || e.key === 'F') {
    toggleFullscreen();
  } else if (e.key === 'Escape') {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  } else if (e.key === 't' || e.key === 'T') {
    const tocDrawer = document.getElementById('tocDrawer');
    if (tocDrawer.classList.contains('open')) {
      closeTocDrawer();
    } else {
      openTocDrawer();
    }
  }
}

// 绑定事件
function bindEvents() {
  prevBtn.addEventListener('click', goPrev);
  nextBtn.addEventListener('click', goNext);
  
  // 键盘事件
  document.addEventListener('keydown', handleKeydown);
  
  fullscreenBtn.addEventListener('click', toggleFullscreen);
  
  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
      fullscreenBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
    } else {
      fullscreenBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
    }
  });
  
  // 素材图标点击
  assetsTrigger.addEventListener('click', (e) => {
    const item = e.target.closest('.asset-icon');
    if (item) {
      openLightbox(item.dataset.type, item.dataset.src);
    }
  });
  
  // 关闭 Lightbox
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  
  // 底部控件显示隐藏
  const bottomControls = document.querySelectorAll('.hover-show:not(.assets-trigger)');
  const bottomTriggerZone = document.getElementById('bottomTriggerZone');
  
  // 鼠标进入底部触发区域
  bottomTriggerZone.addEventListener('mouseenter', () => {
    bottomControls.forEach(el => el.classList.add('visible'));
  });
  
  // 鼠标离开底部触发区域
  bottomTriggerZone.addEventListener('mouseleave', (e) => {
    // 检查是否移动到了底部控件上
    const isOnControls = Array.from(bottomControls).some(el => el.contains(e.relatedTarget));
    if (!isOnControls) {
      bottomControls.forEach(el => el.classList.remove('visible'));
    }
  });
  
  // 底部控件的鼠标离开事件
  bottomControls.forEach(control => {
    control.addEventListener('mouseleave', (e) => {
      // 检查是否移动到了其他底部控件或触发区域
      const isOnOtherControl = Array.from(bottomControls).some(el => el.contains(e.relatedTarget));
      const isOnTriggerZone = bottomTriggerZone.contains(e.relatedTarget);
      if (!isOnOtherControl && !isOnTriggerZone) {
        bottomControls.forEach(el => el.classList.remove('visible'));
      }
    });
  });
  
  
  // 目录按钮点击
  const tocBtn = document.getElementById('tocBtn');
  const tocCloseBtn = document.getElementById('tocCloseBtn');
  const tocBackdrop = document.getElementById('tocBackdrop');
  const tocList = document.getElementById('tocList');
  
  tocBtn.addEventListener('click', openTocDrawer);
  tocCloseBtn.addEventListener('click', closeTocDrawer);
  tocBackdrop.addEventListener('click', closeTocDrawer);
  
  // 目录项点击跳转
  tocList.addEventListener('click', (e) => {
    const item = e.target.closest('.toc-item');
    if (item) {
      const index = parseInt(item.dataset.index);
      closeTocDrawer();
      loadPage(index);
    }
  });
  
  // 页面预览模态窗关闭
  const pageModalClose = document.getElementById('pageModalClose');
  const pageModal = document.getElementById('pageModal');
  
  pageModalClose.addEventListener('click', closePageModal);
  pageModal.addEventListener('click', (e) => {
    if (e.target === pageModal) closePageModal();
  });
  
}

// 启动
init();
