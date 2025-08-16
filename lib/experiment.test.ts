// Simple test file for experiment framework
// Run with: npx tsx lib/experiment.test.ts

import { getVariantForUser, validateVariantAssignment } from './experiment';

// Mock experiment data for testing
const mockExperiment = {
  split: { control: 25, v1: 25, v2: 25, v3: 25 },
  variants: ['control', 'v1', 'v2', 'v3']
};

// Test variant assignment consistency
function testVariantConsistency() {
  console.log('🧪 Testing variant assignment consistency...');
  
  const userId = 'test_user_123';
  const experimentKey = 'landing_ab_001';
  
  // Test multiple calls with same user
  const variant1 = getVariantForUser(userId, experimentKey);
  const variant2 = getVariantForUser(userId, experimentKey);
  const variant3 = getVariantForUser(userId, experimentKey);
  
  if (variant1 === variant2 && variant2 === variant3) {
    console.log('✅ Variant assignment is consistent for same user');
  } else {
    console.log('❌ Variant assignment is inconsistent');
    console.log(`Variant 1: ${variant1}, Variant 2: ${variant2}, Variant 3: ${variant3}`);
  }
  
  return variant1 === variant2 && variant2 === variant3;
}

// Test variant distribution
function testVariantDistribution() {
  console.log('\n🧪 Testing variant distribution...');
  
  const userIds = Array.from({ length: 1000 }, (_, i) => `user_${i}`);
  const experimentKey = 'landing_ab_001';
  
  const distribution: Record<string, number> = { control: 0, v1: 0, v2: 0, v3: 0 };
  
  userIds.forEach(userId => {
    const variant = getVariantForUser(userId, experimentKey);
    distribution[variant]++;
  });
  
  console.log('Variant distribution (1000 users):');
  Object.entries(distribution).forEach(([variant, count]) => {
    const percentage = ((count / 1000) * 100).toFixed(1);
    console.log(`${variant}: ${count} (${percentage}%)`);
  });
  
  // Check if distribution is roughly 25% each (within 5% tolerance)
  const expectedPercentage = 25;
  const tolerance = 5;
  
  const isBalanced = Object.values(distribution).every(count => {
    const percentage = (count / 1000) * 100;
    return Math.abs(percentage - expectedPercentage) <= tolerance;
  });
  
  if (isBalanced) {
    console.log('✅ Variant distribution is balanced');
  } else {
    console.log('❌ Variant distribution is unbalanced');
  }
  
  return isBalanced;
}

// Test validation function
function testValidation() {
  console.log('\n🧪 Testing validation function...');
  
  const userId = 'test_user_456';
  const experimentKey = 'landing_ab_001';
  const actualVariant = getVariantForUser(userId, experimentKey);
  
  const isValid = validateVariantAssignment(userId, experimentKey, actualVariant);
  
  if (isValid) {
    console.log('✅ Validation function works correctly');
  } else {
    console.log('❌ Validation function failed');
  }
  
  return isValid;
}

// Run all tests
function runTests() {
  console.log('🚀 Running experiment framework tests...\n');
  
  const test1 = testVariantConsistency();
  const test2 = testVariantDistribution();
  const test3 = testValidation();
  
  console.log('\n📊 Test Results:');
  console.log(`Consistency: ${test1 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Distribution: ${test2 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Validation: ${test3 ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = test1 && test2 && test3;
  
  if (allPassed) {
    console.log('\n🎉 All tests passed! Experiment framework is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the implementation.');
  }
  
  return allPassed;
}

// Export for use in other test files
export { runTests, testVariantConsistency, testVariantDistribution, testValidation };

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}
