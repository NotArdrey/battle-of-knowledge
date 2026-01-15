// ============================================
// SHARED AUTHENTICATION LOGIC
// Battle of Knowledge - Educational Game
// ============================================

// ============================================
// GUEST SESSION MANAGEMENT
// ============================================

/**
 * Check if current user is a guest
 * @returns {boolean}
 */
function isGuestUser() {
    const guestSession = JSON.parse(localStorage.getItem('guestSession') || 'null');
    return guestSession && guestSession.isGuest === true;
}

/**
 * Get guest session data
 * @returns {Object|null}
 */
function getGuestSession() {
    const guestSession = JSON.parse(localStorage.getItem('guestSession') || 'null');
    return guestSession && guestSession.isGuest ? guestSession : null;
}

/**
 * Clear guest session
 */
function clearGuestSession() {
    localStorage.removeItem('guestSession');
}

/**
 * Create a guest profile object (for compatibility with code expecting profile data)
 * @returns {Object}
 */
function getGuestProfile() {
    const guestSession = getGuestSession();
    if (!guestSession) return null;
    
    return {
        id: guestSession.guestId,
        email: 'guest@local',
        full_name: 'Guest Player',
        role: 'guest',
        is_verified: false,
        isGuest: true
    };
}

/**
 * Get guest mode settings (set by admin)
 * @returns {Object} Guest settings
 */
function getGuestModeSettings() {
    const GUEST_SETTINGS_KEY = 'guestModeSettings';
    const defaultSettings = {
        unlockProgress: false,
        skipVideos: false
    };
    
    const saved = localStorage.getItem(GUEST_SETTINGS_KEY);
    const settings = saved ? { ...defaultSettings, ...JSON.parse(saved) } : { ...defaultSettings };
    
    // unlockCollections is automatically enabled when unlockProgress is enabled
    settings.unlockCollections = settings.unlockProgress;
    
    return settings;
}

/**
 * Check if guest has a specific permission unlocked
 * @param {string} permission - 'unlockProgress', 'unlockCollections', or 'skipVideos'
 * @returns {boolean}
 */
function guestHasPermission(permission) {
    if (!isGuestUser()) return false;
    const settings = getGuestModeSettings();
    return settings[permission] === true;
}

// Safely retrieve the Supabase client regardless of load order
function getSupabaseClient() {
    // Try SupabaseConfig first (uses getter with lazy init)
    if (window.SupabaseConfig) {
        const client = window.SupabaseConfig.supabase;
        if (client?.auth) {
            return client;
        }
        // Try explicit initialization
        if (window.SupabaseConfig.initSupabaseClient) {
            const initialized = window.SupabaseConfig.initSupabaseClient();
            if (initialized?.auth) {
                return initialized;
            }
        }
    }
    
    // Fallback to global supabase variable (set by supabase-config.js)
    if (typeof supabase !== 'undefined' && supabase?.auth) {
        return supabase;
    }
    
    // Fallback to window.supabaseClient
    if (window.supabaseClient?.auth) {
        return window.supabaseClient;
    }
    
    // Last resort: try to initialize directly
    const supabaseLib = window.supabase || window.Supabase;
    if (supabaseLib?.createClient) {
        console.warn('Attempting emergency Supabase client initialization...');
        try {
            const SUPABASE_URL = 'https://bthyqczptljdhmioagpl.supabase.co';
            const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0aHlxY3pwdGxqZGhtaW9hZ3BsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzOTY2NzAsImV4cCI6MjA4Mzk3MjY3MH0.QKFZapzgWYcCtuw3eEvqg6U6qi06QNpvIRNBw7ABf9I';
            const client = supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            window.supabaseClient = client;
            return client;
        } catch (e) {
            console.error('Emergency initialization failed:', e);
        }
    }
    
    // Debug info
    console.error('Supabase client not available. Debug info:');
    console.error('- window.SupabaseConfig:', !!window.SupabaseConfig);
    console.error('- window.supabase:', !!window.supabase);
    console.error('- window.supabaseClient:', !!window.supabaseClient);
    console.error('- typeof supabase:', typeof supabase);
    
    throw new Error('Supabase client not initialized. Please ensure the Supabase CDN script and supabase-config.js are loaded first. Check browser console for network errors.');
}

/**
 * Validate student ID against registered students database
 * @param {string} studentIdNumber - Student ID to validate
 * @returns {Promise<Object|null>} Registered student data or null
 */
async function validateStudentId(studentIdNumber) {
    try {
        const client = getSupabaseClient();
        const { data, error } = await client
            .from('registered_students')
            .select('*')
            .eq('student_id_number', studentIdNumber)
            .eq('is_claimed', false)
            .single();

        if (error) {
            console.log('Student ID not found or already claimed');
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error validating student ID:', error);
        return null;
    }
}

/**
 * Sign up a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Result object with success/error
 */
async function signUpUser(userData) {
    const { email, password, fullName, role, studentIdNumber, classCode } = userData;

    try {
        const client = getSupabaseClient();

        // Validate student ID if role is student
        if (role === 'student') {
            if (!studentIdNumber) {
                return { success: false, error: 'Student ID is required for student registration.' };
            }

            const validStudent = await validateStudentId(studentIdNumber);
            if (!validStudent) {
                return { 
                    success: false, 
                    error: 'Invalid Student ID. Please check your ID number or contact the administrator if you believe this is an error.' 
                };
            }
        }

        // Create auth user
        const { data: authData, error: authError } = await client.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: role,
                    student_id_number: studentIdNumber || null
                }
            }
        });

        if (authError) throw authError;

        if (!authData.user) {
            return { success: false, error: 'Registration failed. Please try again.' };
        }

        // Update profile with additional data
        const { error: profileError } = await client
            .from('profiles')
            .update({
                full_name: fullName,
                role: role,
                student_id_number: studentIdNumber || null,
                is_verified: role === 'student' // Students are auto-verified if ID matches
            })
            .eq('id', authData.user.id);

        if (profileError) {
            console.warn('Profile update warning:', profileError);
        }

        // If student, mark student ID as claimed
        if (role === 'student' && studentIdNumber) {
            await client
                .from('registered_students')
                .update({
                    is_claimed: true,
                    claimed_by: authData.user.id
                })
                .eq('student_id_number', studentIdNumber);
        }

        // If student provided class code, enroll in class
        if (role === 'student' && classCode) {
            const enrollResult = await enrollInClass(authData.user.id, classCode);
            if (!enrollResult.success) {
                console.warn('Class enrollment warning:', enrollResult.error);
            }
        }

        return { 
            success: true, 
            user: authData.user,
            message: 'Registration successful! Please check your email to verify your account.'
        };

    } catch (error) {
        console.error('Sign up error:', error);
        
        // Handle specific error cases
        if (error.message.includes('already registered')) {
            return { success: false, error: 'This email is already registered. Please log in instead.' };
        }
        
        return { success: false, error: error.message || 'Registration failed. Please try again.' };
    }
}

/**
 * Sign in user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Result object with success/error
 */
async function signInUser(email, password) {
    try {
        const client = getSupabaseClient();
        const { data, error } = await client.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        // Get user profile to check role
        const { data: profile, error: profileError } = await client
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        if (profileError) {
            console.warn('Could not fetch profile:', profileError);
        }

        // Store profile in localStorage for quick access
        if (profile) {
            localStorage.setItem('userProfile', JSON.stringify(profile));
        }

        return { 
            success: true, 
            user: data.user,
            profile: profile,
            session: data.session
        };

    } catch (error) {
        console.error('Sign in error:', error);
        
        if (error.message.includes('Invalid login credentials')) {
            return { success: false, error: 'Invalid email or password. Please try again.' };
        }
        
        return { success: false, error: error.message || 'Login failed. Please try again.' };
    }
}

/**
 * Enroll student in a class using class code
 * @param {string} studentId - Student's user ID
 * @param {string} classCode - Class code to enroll in
 * @returns {Promise<Object>} Result object
 */
async function enrollInClass(studentId, classCode) {
    try {
        const client = getSupabaseClient();

        // Find class by code
        const { data: classData, error: classError } = await client
            .from('classes')
            .select('id, teacher_id, class_name')
            .eq('class_code', classCode.toUpperCase())
            .eq('is_active', true)
            .single();

        if (classError || !classData) {
            return { success: false, error: 'Invalid class code. Please check and try again.' };
        }

        // Create enrollment
        const { error: enrollError } = await client
            .from('class_enrollments')
            .insert({
                class_id: classData.id,
                student_id: studentId
            });

        if (enrollError) {
            if (enrollError.code === '23505') { // Unique constraint violation
                return { success: false, error: 'You are already enrolled in this class.' };
            }
            throw enrollError;
        }

        // Update student's teacher_id and class_id
        await client
            .from('profiles')
            .update({
                teacher_id: classData.teacher_id,
                class_id: classData.id
            })
            .eq('id', studentId);

        return { success: true, className: classData.class_name };

    } catch (error) {
        console.error('Enrollment error:', error);
        return { success: false, error: 'Failed to enroll in class. Please try again.' };
    }
}

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise<Object>} Result object
 */
async function resetPassword(email) {
    try {
        const client = getSupabaseClient();
        const { error } = await client.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password.html`
        });

        if (error) throw error;

        return { success: true, message: 'Password reset email sent! Check your inbox.' };

    } catch (error) {
        console.error('Password reset error:', error);
        return { success: false, error: error.message || 'Failed to send reset email.' };
    }
}

/**
 * Update user password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Result object
 */
async function updatePassword(newPassword) {
    try {
        const client = getSupabaseClient();
        const { error } = await client.auth.updateUser({
            password: newPassword
        });

        if (error) throw error;

        return { success: true, message: 'Password updated successfully!' };

    } catch (error) {
        console.error('Password update error:', error);
        return { success: false, error: error.message || 'Failed to update password.' };
    }
}

/**
 * Redirect user based on their role
 * @param {Object} profile - User profile with role
 */
function redirectByRole(profile) {
    const redirectUrl = localStorage.getItem('redirectAfterLogin');
    localStorage.removeItem('redirectAfterLogin');

    if (redirectUrl && !redirectUrl.includes('login') && !redirectUrl.includes('signup')) {
        window.location.href = redirectUrl;
        return;
    }

    switch (profile.role) {
        case 'admin':
            window.location.href = 'admin.html';
            break;
        case 'teacher':
            window.location.href = 'teacher.html';
            break;
        case 'student':
        default:
            window.location.href = 'era-selection.html';
            break;
    }
}

/**
 * Get role display name
 * @param {string} role - Role key
 * @returns {string} Display name
 */
function getRoleDisplayName(role) {
    const roleNames = {
        'admin': 'Administrator',
        'teacher': 'Teacher',
        'student': 'Student'
    };
    return roleNames[role] || 'User';
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result
 */
function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const errors = [];
    
    if (password.length < minLength) {
        errors.push(`Password must be at least ${minLength} characters`);
    }
    if (!hasUpperCase) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!hasLowerCase) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!hasNumbers) {
        errors.push('Password must contain at least one number');
    }
    
    const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar, password.length >= minLength]
        .filter(Boolean).length;
    
    return {
        valid: errors.length === 0,
        errors: errors,
        strength: strength // 0-5
    };
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Export for use in other files
window.SharedAuth = {
    // Guest session functions
    isGuestUser,
    getGuestSession,
    clearGuestSession,
    getGuestProfile,
    getGuestModeSettings,
    guestHasPermission,
    // Auth functions
    validateStudentId,
    signUpUser,
    signInUser,
    enrollInClass,
    resetPassword,
    updatePassword,
    redirectByRole,
    getRoleDisplayName,
    validatePassword,
    validateEmail
};
