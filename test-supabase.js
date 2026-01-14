// Quick Supabase connection test
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://bthyqczptljdhmioagpl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0aHlxY3pwdGxqZGhtaW9hZ3BsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzOTY2NzAsImV4cCI6MjA4Mzk3MjY3MH0.QKFZapzgWYcCtuw3eEvqg6U6qi06QNpvIRNBw7ABf9I';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function test() {
    console.log('Testing Supabase connection...\n');
    
    // Test 1: Try to read profiles (no auth)
    console.log('1. Testing profiles table access (anon):');
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('email, role')
        .limit(5);
    
    if (profilesError) {
        console.log('   Error:', profilesError.message);
    } else {
        console.log('   Success! Profiles:', profiles);
    }

    // Test 2: Try signing up a NEW user and then LOGIN with it
    const testEmail = `test${Date.now()}@test.com`;
    const testPass = 'testpass123';
    console.log('\n2. Testing signup with:', testEmail);
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPass
    });
    
    if (signupError) {
        console.log('   Signup Error:', signupError.message);
    } else {
        console.log('   Signup Success! User ID:', signupData.user?.id);
        
        // Now try to login with this NEW user
        console.log('\n2b. Testing login with newly created user:');
        const { data: newLogin, error: newLoginError } = await supabase.auth.signInWithPassword({
            email: testEmail,
            password: testPass
        });
        if (newLoginError) {
            console.log('   New user login Error:', newLoginError.message);
        } else {
            console.log('   New user login SUCCESS!');
        }
    }
    
    // Test 3: Try login with existing user
    console.log('\n3. Testing login with admin@battleofknowledge.com:');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'admin@battleofknowledge.com',
        password: 'admin123'
    });
    
    if (authError) {
        console.log('   Login Error:', authError.message);
        console.log('   Error Code:', authError.code);
    } else {
        console.log('   Login Success!');
        console.log('   User ID:', authData.user?.id);
        console.log('   Email:', authData.user?.email);
    }

    // Test 4: Try login with student (different user)
    console.log('\n4. Testing login with student1@school.edu:');
    const { data: studentAuth, error: studentError } = await supabase.auth.signInWithPassword({
        email: 'student1@school.edu',
        password: 'student123'
    });
    
    if (studentError) {
        console.log('   Login Error:', studentError.message);
    } else {
        console.log('   Login Success!');
        console.log('   User ID:', studentAuth.user?.id);
    }
}

test().catch(console.error);
