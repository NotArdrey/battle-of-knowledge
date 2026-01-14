// UI Utilities - Button Protection & Loading Animations
// Prevents button spam clicks and provides consistent loading states

(function() {
    'use strict';
    
    // ============================================
    // BUTTON CLICK PROTECTION
    // ============================================
    
    const buttonLocks = new Map();
    
    window.isButtonLocked = function(buttonId) {
        return buttonLocks.get(buttonId) === true;
    };
    
    window.lockButton = function(buttonId, duration = 1000) {
        buttonLocks.set(buttonId, true);
        setTimeout(() => buttonLocks.set(buttonId, false), duration);
    };
    
    // Wrap a function with click protection
    window.withClickProtection = function(buttonId, fn, duration = 1000) {
        return async function(...args) {
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
                btn.onclick = function(e) {
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
    window.hidePageLoading = function() {
        const overlay = document.getElementById('pageLoadingOverlay');
        if (overlay) {
            overlay.classList.add('hidden');
            setTimeout(() => overlay.remove(), 400);
        }
    };
    
    // Show loading overlay
    window.showPageLoading = function(text = 'Loading') {
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
    window.navigateTo = function(url, buttonElement) {
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
    
    // Run init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
