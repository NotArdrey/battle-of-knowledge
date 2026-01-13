// ============================================
// SUPABASE CONFIGURATION
// Battle of Knowledge - Educational Game
// ============================================

// Supabase project credentials
const SUPABASE_URL = 'https://vjrgwoqbewdahoipsuqo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqcmd3b3FiZXdkYWhvaXBzdXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNDMzOTUsImV4cCI6MjA4MzcxOTM5NX0.GIrUAmehdtdG3gxnvdjO71uiz-L7yYkBStNrf9_vr3s';

// Initialize Supabase client with safety check
let _supabaseClient = null;

function initSupabaseClient() {
    if (_supabaseClient && _supabaseClient.auth) return _supabaseClient;
    
    // Check for the Supabase library under different possible exports
    const supabaseLib = window.supabase || window.Supabase;
    
    if (!supabaseLib) {
        console.error('Supabase JS library not loaded. Make sure the CDN script is included before supabase-config.js');
        console.error('window.supabase:', window.supabase);
        return null;
    }
    
    // The CDN exports createClient directly on the supabase object
    const createClient = supabaseLib.createClient;
    
    if (!createClient) {
        console.error('Supabase createClient function not found. Library may not have loaded correctly.');
        console.error('Available properties:', Object.keys(supabaseLib));
        return null;
    }
    
    try {
        _supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        window.supabaseClient = _supabaseClient;
        console.log('Supabase client initialized successfully');
        return _supabaseClient;
    } catch (error) {
        console.error('Error creating Supabase client:', error);
        return null;
    }
}

// Try to initialize immediately if CDN is already loaded
(function() {
    const supabaseLib = window.supabase || window.Supabase;
    if (supabaseLib && supabaseLib.createClient) {
        try {
            _supabaseClient = supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            window.supabaseClient = _supabaseClient;
            console.log('Supabase client initialized on load');
        } catch (error) {
            console.error('Error initializing Supabase on load:', error);
        }
    } else {
        console.warn('Supabase library not found on initial load. Will attempt lazy initialization.');
    }
})();

// ============================================
// SESSION MANAGEMENT
// ============================================

/**
 * Get current session
 * @returns {Promise<Object|null>} Session object or null
 */
async function getSession() {
    try {
        const client = initSupabaseClient();
        if (!client) throw new Error('Supabase client not available');
        const { data: { session }, error } = await client.auth.getSession();
        if (error) throw error;
        return session;
    } catch (error) {
        console.error('Error getting session:', error);
        return null;
    }
}

/**
 * Get current user
 * @returns {Promise<Object|null>} User object or null
 */
async function getCurrentUser() {
    try {
        const client = initSupabaseClient();
        if (!client) throw new Error('Supabase client not available');
        const { data: { user }, error } = await client.auth.getUser();
        if (error) throw error;
        return user;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
}

/**
 * Get current user's profile with role
 * @returns {Promise<Object|null>} Profile object or null
 */
async function getCurrentProfile() {
    try {
        const client = initSupabaseClient();
        if (!client) throw new Error('Supabase client not available');
        const user = await getCurrentUser();
        if (!user) return null;

        const { data: profile, error } = await client
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) throw error;
        return profile;
    } catch (error) {
        console.error('Error getting profile:', error);
        return null;
    }
}

/**
 * Check if user is authenticated, redirect to login if not
 * @param {string} redirectUrl - URL to redirect after login
 * @returns {Promise<boolean>} True if authenticated
 */
async function requireAuth(redirectUrl = 'login.html') {
    const session = await getSession();
    if (!session) {
        // Save intended destination
        localStorage.setItem('redirectAfterLogin', window.location.href);
        window.location.href = redirectUrl;
        return false;
    }
    return true;
}

/**
 * Check if user has required role
 * @param {string|string[]} requiredRoles - Role(s) required
 * @param {string} redirectUrl - URL to redirect if unauthorized
 * @returns {Promise<Object|null>} Profile if authorized, null otherwise
 */
async function requireRole(requiredRoles, redirectUrl = 'index.html') {
    const profile = await getCurrentProfile();
    
    if (!profile) {
        window.location.href = 'login.html';
        return null;
    }

    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    
    if (!roles.includes(profile.role)) {
        alert('You do not have permission to access this page.');
        window.location.href = redirectUrl;
        return null;
    }

    return profile;
}

/**
 * Sign out user
 */
async function signOut() {
    try {
        const client = initSupabaseClient();
        if (!client) throw new Error('Supabase client not available');
        const { error } = await client.auth.signOut();
        if (error) throw error;
        
        // Clear local storage
        localStorage.removeItem('userProfile');
        localStorage.removeItem('redirectAfterLogin');
        
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error signing out:', error);
        alert('Error signing out. Please try again.');
    }
}

// ============================================
// AUTH STATE LISTENER
// ============================================

// Listen for auth state changes (only if client is available)
function setupAuthListener() {
    const client = initSupabaseClient();
    if (client) {
        client.auth.onAuthStateChange((event, session) => {
            console.log('Auth state changed:', event);
            
            if (event === 'SIGNED_IN') {
                console.log('User signed in');
            } else if (event === 'SIGNED_OUT') {
                console.log('User signed out');
                localStorage.removeItem('userProfile');
            } else if (event === 'TOKEN_REFRESHED') {
                console.log('Token refreshed');
            }
        });
    }
}

// Setup listener if client is ready
if (_supabaseClient) {
    setupAuthListener();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Show loading spinner
 * @param {boolean} show - Whether to show or hide
 */
function showLoading(show = true) {
    let loader = document.getElementById('globalLoader');
    if (!loader && show) {
        loader = document.createElement('div');
        loader.id = 'globalLoader';
        loader.innerHTML = `
            <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999;">
                <div style="background: white; padding: 2rem; border-radius: 1rem; text-align: center;">
                    <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #b45309; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
                    <p style="color: #7c2d12; font-weight: 600;">Loading...</p>
                </div>
            </div>
            <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
        `;
        document.body.appendChild(loader);
    } else if (loader && !show) {
        loader.remove();
    }
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - 'success', 'error', 'info'
 */
function showToast(message, type = 'info') {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6'
    };
    
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 9999;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;
    
    const style = document.createElement('style');
    style.textContent = '@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }';
    toast.appendChild(style);
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Export for use in other files
window.SupabaseConfig = {
    get supabase() { return _supabaseClient || initSupabaseClient(); },
    initSupabaseClient,
    getSession,
    getCurrentUser,
    getCurrentProfile,
    requireAuth,
    requireRole,
    signOut,
    formatDate,
    showLoading,
    showToast
};
