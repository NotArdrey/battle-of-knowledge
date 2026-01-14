// Create test accounts via signup (these will work!)
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bthyqczptljdhmioagpl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0aHlxY3pwdGxqZGhtaW9hZ3BsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzOTY2NzAsImV4cCI6MjA4Mzk3MjY3MH0.QKFZapzgWYcCtuw3eEvqg6U6qi06QNpvIRNBw7ABf9I';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const testAccounts = [
    { email: 'admin@battleofknowledge.com', password: 'admin123', full_name: 'System Admin', role: 'admin' },
    { email: 'teacher1@battleofknowledge.com', password: 'teacher123', full_name: 'Maria Santos', role: 'teacher' },
    { email: 'teacher2@battleofknowledge.com', password: 'teacher123', full_name: 'Juan Dela Cruz', role: 'teacher' },
    { email: 'student1@battleofknowledge.com', password: 'student123', full_name: 'Pedro Reyes', role: 'student', student_id_number: 'STU-2024-001' },
    { email: 'student2@battleofknowledge.com', password: 'student123', full_name: 'Ana Garcia', role: 'student', student_id_number: 'STU-2024-002' },
];

async function createAccounts() {
    console.log('Creating test accounts via signup...\n');
    
    for (const account of testAccounts) {
        const { data, error } = await supabase.auth.signUp({
            email: account.email,
            password: account.password,
            options: {
                data: {
                    full_name: account.full_name,
                    role: account.role,
                    student_id_number: account.student_id_number || null
                }
            }
        });
        
        if (error) {
            console.log(`❌ ${account.email}: ${error.message}`);
        } else {
            console.log(`✅ ${account.email} created (${account.role})`);
        }
    }
    
    console.log('\n--- Testing Login ---\n');
    
    // Test login for admin
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: 'admin@battleofknowledge.com',
        password: 'admin123'
    });
    
    if (loginError) {
        console.log(`❌ Admin login failed: ${loginError.message}`);
    } else {
        console.log(`✅ Admin login SUCCESS!`);
        console.log(`   User ID: ${loginData.user.id}`);
        console.log(`   Email: ${loginData.user.email}`);
    }
    
    // Verify profiles
    console.log('\n--- Profiles in Database ---\n');
    const { data: profiles } = await supabase.from('profiles').select('email, role, is_verified');
    if (profiles) {
        profiles.forEach(p => console.log(`  ${p.email} - ${p.role} (verified: ${p.is_verified})`));
    }
}

createAccounts().catch(console.error);
