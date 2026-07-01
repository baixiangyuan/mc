/**
 * 寰宇航空 - 全局主脚本
 * 包含：导航、模态框、全球时间、链接跳转、Toast 等
 */
(function() {
    'use strict';

    // ==================== 导航栏滚动效果 ====================
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // ==================== 移动端汉堡菜单 ====================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });

        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            }
        });
    }

    // ==================== 锚点平滑滚动 ====================
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        const targetId = link.getAttribute('href');
        if (targetId === '#' || targetId.length < 2) return;
        const target = document.getElementById(targetId.substring(1));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // ==================== 外部链接在新标签页打开（不影响本地跳转） ====================
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href^="http"]');
        if (!link) return;
        // 如果是本站域名，不处理
        if (link.hostname === window.location.hostname) return;

        e.preventDefault();
        const url = link.href;
        // 同步打开新窗口（不会被拦截）
        window.open(url, '_blank');
        // 可选提示
        if (typeof showToast === 'function') {
            showToast('🌐 已在新标签页打开外部链接', 'success');
        }
    });

    // ==================== 模态框系统 ====================
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) setTimeout(() => closeBtn.focus(), 100);
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function closeAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(closeModal);
    }

    document.addEventListener('click', function(e) {
        const trigger = e.target.closest('[data-modal]');
        if (trigger) {
            e.preventDefault();
            openModal(trigger.getAttribute('data-modal'));
        }
    });

    document.addEventListener('click', function(e) {
        if (e.target.hasAttribute('data-close') || e.target.classList.contains('modal-close')) {
            const modal = e.target.closest('.modal-overlay');
            if (modal) closeModal(modal);
        }
        if (e.target.classList.contains('modal-overlay')) {
            closeModal(e.target);
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeAllModals();
    });

    // ==================== 全球时间更新 ====================
    function updateAllClocks() {
        const now = new Date();

        const dateEl = document.getElementById('currentDate');
        const weekdayEl = document.getElementById('currentWeekday');
        if (dateEl) {
            dateEl.textContent = now.toLocaleDateString('zh-CN', {
                year: 'numeric', month: 'long', day: 'numeric'
            });
        }
        if (weekdayEl) {
            weekdayEl.textContent = now.toLocaleDateString('zh-CN', { weekday: 'long' });
        }

        const utcEl = document.getElementById('utcTime');
        if (utcEl) {
            utcEl.textContent = now.toISOString().substring(11, 19);
        }

        function setCityTime(id, timeZone) {
            const el = document.getElementById(id);
            if (!el) return;
            el.textContent = now.toLocaleString('en-GB', {
                hour: '2-digit', minute: '2-digit', hour12: false, timeZone
            });
        }
        setCityTime('timeBeijing', 'Asia/Shanghai');
        setCityTime('timeNewYork', 'America/New_York');
        setCityTime('timeLondon', 'Europe/London');
        setCityTime('timeTokyo', 'Asia/Tokyo');
        setCityTime('timeDubai', 'Asia/Dubai');
        setCityTime('timeSydney', 'Australia/Sydney');
    }
    updateAllClocks();
    setInterval(updateAllClocks, 1000);

    // ==================== 回到顶部按钮 ====================
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            backToTopBtn.classList.toggle('visible', window.scrollY > 400);
        });
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==================== Toast 通知系统 ====================
    const toastContainer = document.getElementById('toastContainer');
    window.showToast = function(message, type = 'info') {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = 'toast ' + type;
        toast.textContent = message;
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = 'background:none;border:none;font-size:1.2rem;margin-left:auto;cursor:pointer;color:#999;';
        closeBtn.addEventListener('click', () => toast.remove());
        toast.appendChild(closeBtn);
        const timer = setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => { if (toast.parentNode) toast.remove(); }, 300);
        }, 4000);
        toast.addEventListener('touchstart', () => clearTimeout(timer));
        toast.addEventListener('touchend', () => {
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(100%)';
                setTimeout(() => { if (toast.parentNode) toast.remove(); }, 300);
            }, 1500);
        });
        toastContainer.appendChild(toast);
    };

    // ==================== 演示交互提示（可保留或删除） ====================
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.btn-primary');
        if (btn && !btn.hasAttribute('data-modal') && !btn.closest('.modal-container')) {
            if (btn.textContent.includes('预订') || btn.textContent.includes('连接') || btn.textContent.includes('浏览')) {
                window.showToast('✨ 功能演示：即将跳转至对应页面', 'info');
            }
        }
    });

    console.log('🛩️ 寰宇航空 前端就绪 (完整功能版)');
})();