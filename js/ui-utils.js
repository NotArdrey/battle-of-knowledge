// UI Utilities - Button Protection & Loading Animations
// Prevents button spam clicks and provides consistent loading states

(function () {
    'use strict';

    // ============================================
    // BUTTON CLICK PROTECTION
    // ============================================

    const buttonLocks = new Map();

    window.isButtonLocked = function (buttonId) {
        return buttonLocks.get(buttonId) === true;
    };

    window.lockButton = function (buttonId, duration = 1000) {
        buttonLocks.set(buttonId, true);
        setTimeout(() => buttonLocks.set(buttonId, false), duration);
    };

    // Wrap a function with click protection
    window.withClickProtection = function (buttonId, fn, duration = 1000) {
        return async function (...args) {
            if (window.isButtonLocked(buttonId)) return;
            window.lockButton(buttonId, duration);
            try {
                return await fn.apply(this, args);
            } catch (e) {
                console.error('Button action error:', e);
                throw e;
            }
        };
    };

    // Auto-protect buttons with data-protect attribute
    function autoProtectButtons() {
        document.querySelectorAll('[data-protect]').forEach(btn => {
            if (btn._protected) return;
            btn._protected = true;

            const duration = parseInt(btn.dataset.protectDuration) || 1000;
            const originalOnclick = btn.onclick;

            if (originalOnclick) {
                btn.onclick = function (e) {
                    const btnId = btn.id || btn.dataset.protect || 'btn_' + Math.random();
                    if (window.isButtonLocked(btnId)) {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }
                    window.lockButton(btnId, duration);
                    return originalOnclick.call(this, e);
                };
            }
        });
    }

    // ============================================
    // LOADING OVERLAY
    // ============================================

    const loadingStyles = `
        /* ... existing loading styles ... */
        .page-loading-overlay {
            position: fixed;
            inset: 0;
            background: linear-gradient(to bottom right, #fef3c7, #fde68a, #fef3c7);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            transition: opacity 0.4s ease-out;
        }
        
        .page-loading-overlay.hidden {
            opacity: 0;
            pointer-events: none;
        }
        
        .loading-spinner {
            width: 60px;
            height: 60px;
            border: 5px solid rgba(120, 53, 15, 0.2);
            border-top-color: #b45309;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        .loading-text {
            margin-top: 1.5rem;
            font-family: 'Baloo 2', cursive;
            font-size: 1.25rem;
            font-weight: 600;
            color: #7c2d12;
            animation: pulse 1.5s ease-in-out infinite;
        }
        
        .loading-dots::after {
            content: '';
            animation: dots 1.5s steps(4, end) infinite;
        }

        /* Modern Alert System Styles */
        .custom-alert-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100000;
            animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .custom-alert-box {
            background: linear-gradient(135deg, #ffffff, #fffbeb);
            padding: 2.5rem;
            border-radius: 24px;
            box-shadow: 
                0 20px 25px -5px rgba(0, 0, 0, 0.1), 
                0 10px 10px -5px rgba(0, 0, 0, 0.04),
                0 0 0 1px rgba(180, 83, 9, 0.1);
            max-width: 450px;
            width: 90%;
            text-align: center;
            animation: modalPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            position: relative;
            overflow: hidden;
        }

        .custom-alert-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
            display: inline-block;
            animation: iconBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s backwards;
        }

        .custom-alert-title {
            color: #78350f;
            font-size: 1.75rem;
            font-weight: 800;
            margin-bottom: 0.75rem;
            font-family: 'Baloo 2', cursive;
        }

        .custom-alert-message {
            color: #92400e;
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 2rem;
            font-family: 'Baloo 2', cursive;
        }

        .custom-alert-btn {
            background: linear-gradient(135deg, #b45309, #d97706);
            color: white;
            border: none;
            padding: 0.85rem 2rem;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(180, 83, 9, 0.3);
            font-family: 'Baloo 2', cursive;
            min-width: 120px;
        }

        .custom-alert-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(180, 83, 9, 0.4);
        }

        /* Toast Styles */
        .toast-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 100000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .custom-toast {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 1rem 1.5rem;
            border-radius: 16px;
            color: #451a03;
            font-weight: 600;
            font-family: 'Baloo 2', cursive;
            box-shadow: 
                0 10px 15px -3px rgba(0, 0, 0, 0.1),
                0 4px 6px -2px rgba(0, 0, 0, 0.05),
                0 0 0 1px rgba(0,0,0,0.05);
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 300px;
            animation: toastSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            border-left: 5px solid #d97706;
            cursor: pointer;
            transition: transform 0.2s;
        }

        .custom-toast:hover {
            transform: translateX(-5px);
        }

        .custom-toast.success { border-left-color: #10b981; }
        .custom-toast.error { border-left-color: #ef4444; }
        .custom-toast.info { border-left-color: #3b82f6; }
        .custom-toast.warning { border-left-color: #f59e0b; }

        .toast-icon { font-size: 1.5rem; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalPop { 
            from { opacity: 0; transform: scale(0.8) translateY(20px); } 
            to { opacity: 1; transform: scale(1) translateY(0); } 
        }
        @keyframes iconBounce {
            0% { transform: scale(0.5) rotate(-45deg); opacity: 0; }
            50% { transform: scale(1.2) rotate(10deg); }
            100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        @keyframes toastSlideIn {
            from { opacity: 0; transform: translateX(50px); }
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes toastSlideOut {
            to { opacity: 0; transform: translateX(100%); }
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
        }
        
        @keyframes dots {
            0% { content: ''; }
            25% { content: '.'; }
            50% { content: '..'; }
            75% { content: '...'; }
            100% { content: ''; }
        }
        
        /* Navigation button loading state */
        .btn-loading {
            position: relative;
            pointer-events: none;
            opacity: 0.7;
        }
        
        .btn-loading::after {
            content: '';
            position: absolute;
            width: 20px;
            height: 20px;
            top: 50%;
            left: 50%;
            margin-top: -10px;
            margin-left: -10px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top-color: #fff;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }
    `;

    // Inject loading styles
    function injectStyles() {
        if (document.getElementById('ui-utils-styles')) return;
        const style = document.createElement('style');
        style.id = 'ui-utils-styles';
        style.textContent = loadingStyles;
        document.head.appendChild(style);
    }

    // Create loading overlay
    function createLoadingOverlay() {
        if (document.getElementById('pageLoadingOverlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'pageLoadingOverlay';
        overlay.className = 'page-loading-overlay';
        overlay.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">Loading<span class="loading-dots"></span></div>
        `;
        document.body.insertBefore(overlay, document.body.firstChild);
    }

    // Hide loading overlay
    window.hidePageLoading = function () {
        const overlay = document.getElementById('pageLoadingOverlay');
        if (overlay) {
            overlay.classList.add('hidden');
            setTimeout(() => overlay.remove(), 400);
        }
    };

    // Show loading overlay
    window.showPageLoading = function (text = 'Loading') {
        createLoadingOverlay();
        const overlay = document.getElementById('pageLoadingOverlay');
        const textEl = overlay.querySelector('.loading-text');
        if (textEl) {
            textEl.innerHTML = `${text}<span class="loading-dots"></span>`;
        }
        overlay.classList.remove('hidden');
    };

    // ============================================
    // NAVIGATION WITH LOADING
    // ============================================

    // Navigate to a page with loading animation
    window.navigateTo = function (url, buttonElement) {
        if (buttonElement) {
            const btnId = buttonElement.id || 'nav_' + url;
            if (window.isButtonLocked(btnId)) return;
            window.lockButton(btnId, 3000);
            buttonElement.classList.add('btn-loading');
        }

        window.showPageLoading('Loading');

        // Small delay for visual feedback
        setTimeout(() => {
            window.location.href = url;
        }, 150);
    };

    // ============================================
    // INITIALIZATION
    // ============================================

    function init() {
        injectStyles();

        // Check if this is battlefield page - skip loading overlay
        const isBattlefield = window.location.pathname.includes('battlefield');

        if (!isBattlefield) {
            createLoadingOverlay();
        }

        // Auto-protect buttons
        autoProtectButtons();

        // Hide loading when DOM is ready
        if (document.readyState === 'complete') {
            if (!isBattlefield) {
                setTimeout(window.hidePageLoading, 100);
            }
        } else {
            window.addEventListener('load', () => {
                if (!isBattlefield) {
                    setTimeout(window.hidePageLoading, 100);
                }
            });
        }

        // Re-run auto-protect after dynamic content loads
        const observer = new MutationObserver(() => {
            autoProtectButtons();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ============================================
    // MODERN ALERT SYSTEM
    // ============================================

    // Toast Notification
    window.showToast = function (message, type = 'info') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `custom-toast ${type}`;

        const icons = {
            success: '✅',
            error: '🛑',
            warning: '⚠️',
            info: 'ℹ️'
        };

        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
            <span>${message}</span>
        `;

        // Remove on click
        toast.onclick = () => {
            toast.style.animation = 'toastSlideOut 0.3s forwards';
            setTimeout(() => toast.remove(), 300);
        };

        container.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.animation = 'toastSlideOut 0.3s forwards';
                setTimeout(() => toast.remove(), 300);
            }
        }, 4000);
    };

    // Modal Alert
    window.showSystemAlert = function (message, title = 'Alert', type = 'info') {
        return new Promise((resolve) => {
            // Remove existing alert if any
            const existing = document.getElementById('customAlertOverlay');
            if (existing) existing.remove();

            const icons = {
                success: '🎉',
                error: '❌',
                warning: '⚠️',
                info: '💡'
            };

            const overlay = document.createElement('div');
            overlay.id = 'customAlertOverlay';
            overlay.className = 'custom-alert-overlay'; // Removed hidden class, we animate in CSS

            overlay.innerHTML = `
                <div class="custom-alert-box">
                    <div class="custom-alert-icon">${icons[type] || '💡'}</div>
                    <h3 class="custom-alert-title">${title}</h3>
                    <div class="custom-alert-message">${message}</div>
                    <button class="custom-alert-btn" id="customAlertBtn">OK</button>
                </div>
            `;

            document.body.appendChild(overlay);

            // Button Action
            const btn = overlay.querySelector('#customAlertBtn');
            btn.onclick = () => {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.remove();
                    resolve();
                }, 300);
            };

            // Focus button
            btn.focus();
        });
    };

    // Override Native Alert
    window.originalAlert = window.alert;
    window.alert = function (message) {
        window.showSystemAlert(message, 'Read Carefully', 'info');
    };

    // Helper for errors
    window.showError = function (message) {
        window.showSystemAlert(message, 'Oops!', 'error');
    };

    // Helper for success
    window.showSuccess = function (message) {
        window.showToast(message, 'success');
    };

    // Run init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
