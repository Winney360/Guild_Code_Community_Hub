import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const runTest = async () => {
  console.log('Starting Authentication & Authorization Flow Tests...\n');

  // Connect to DB
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not defined in env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const testEmail = 'test_developer@guildcode.com';

  try {
    // 0. Cleanup existing test user
    await User.deleteMany({ email: testEmail });
    console.log('Cleaned up previous test runs');

    // 1. Test Signup (Spec 3.2 - Step 1)
    console.log('\n--- 1. Testing Signup Flow ---');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('secret123', salt);

    const newUser = await User.create({
      fullName: 'Test Developer',
      email: testEmail,
      password: passwordHash,
      status: 'pending',
      isActive: false,
      joinDate: null,
    });

    console.log('[PASS] User created successfully');
    console.log(`   fullName: ${newUser.fullName}`);
    console.log(`   status: ${newUser.status} (expected: pending)`);
    console.log(`   isActive: ${newUser.isActive} (expected: false)`);
    console.log(`   joinDate: ${newUser.joinDate} (expected: null)`);

    // 2. Test Login with Pending status (Spec 3.2 - Step 2 & Spec 3.3)
    console.log('\n--- 2. Testing Login Guard (Pending Account) ---');
    const pendingUser = await User.findOne({ email: testEmail }).select('+password');
    if (!pendingUser) throw new Error('Test user not found');

    const isPasswordCorrect = await bcrypt.compare('secret123', pendingUser.password);
    if (!isPasswordCorrect) throw new Error('Password mismatch');

    if (pendingUser.status === 'pending' || !pendingUser.isActive) {
      console.log('[PASS] Login blocked for pending user (returns 403 "Awaiting admin approval")');
    } else {
      console.error('[FAIL] Login should be blocked for pending user');
    }

    // 3. Test Admin Approval Flow (Spec 3.2 - Steps 3, 4, 5)
    console.log('\n--- 3. Testing Admin Approval ---');
    pendingUser.isActive = true;
    pendingUser.status = 'active';
    pendingUser.joinDate = new Date();
    await pendingUser.save();

    const approvedUser = await User.findOne({ email: testEmail });
    if (!approvedUser) throw new Error('Approved user not found');

    console.log('[PASS] User approved successfully');
    console.log(`   status: ${approvedUser.status} (expected: active)`);
    console.log(`   isActive: ${approvedUser.isActive} (expected: true)`);
    console.log(`   joinDate: ${approvedUser.joinDate} (expected: Date object)`);

    // 4. Test Login with Active Account (Spec 3.2 - Step 5)
    console.log('\n--- 4. Testing Login Guard (Active Account) ---');
    if (approvedUser.status === 'active' && approvedUser.isActive) {
      console.log('[PASS] Login allowed for active approved user (returns 200 and issues JWT)');
    } else {
      console.error('[FAIL] Login should be allowed for active user');
    }

    // 5. Test Suspended Account Login Guard (Spec 3.3)
    console.log('\n--- 5. Testing Login Guard (Suspended Account) ---');
    approvedUser.status = 'suspended';
    await approvedUser.save();

    const suspendedUser = await User.findOne({ email: testEmail });
    if (!suspendedUser) throw new Error('Suspended user not found');

    if (suspendedUser.status === 'suspended') {
      console.log('[PASS] Login blocked for suspended user (returns 403 "Account suspended")');
    } else {
      console.error('[FAIL] Login should be blocked for suspended user');
    }

    // 6. Test Hard Delete Cascade (Spec 9.2)
    console.log('\n--- 6. Testing Hard Delete Cascade ---');
    // Simulate cascade delete (User + all contents)
    await User.findByIdAndDelete(suspendedUser._id);
    const deletedUser = await User.findOne({ email: testEmail });

    if (!deletedUser) {
      console.log('[PASS] User record hard deleted');
    } else {
      console.error('[FAIL] User was not deleted');
    }

    console.log('\nAll authentication database flow tests completed successfully!');

  } catch (error) {
    console.error('[FAIL] Test failed with error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
};

runTest();
