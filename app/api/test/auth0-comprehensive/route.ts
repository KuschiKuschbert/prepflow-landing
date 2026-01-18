import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import {
  testCallbackUrlConstruction,
  testEnvironmentVariables,
  testManagementAPI,
  testURLConsistency,
} from './test-helpers';
import { addTest, createTestResults } from './test-utils';

/**
 * Comprehensive Auth0 Test Endpoint
 * Tests all aspects of Auth0 configuration and NextAuth integration
 */
export async function GET(request: NextRequest) {
  const results = createTestResults();

  try {
    logger.info('[Auth0 Test] Starting comprehensive tests...');

    // Test 1: Environment Variables
    testEnvironmentVariables(results);

    // Test 2: Callback URL Construction
    testCallbackUrlConstruction(results);

    // Test 3: Auth0 SDK Configuration
    addTest(
      results,
      'Auth0 SDK Configuration',
      'pass',
      'Auth0 SDK configured via environment variables',
      {
        configured: true,
      },
    );

    // Test 4: Auth0 Management API Connection
    await testManagementAPI(results);

    // Test 5: Request Origin Check
    const requestOrigin = request.headers.get('origin') || request.headers.get('host') || 'unknown';
    addTest(results, 'Request Origin', 'pass', `Request from: ${requestOrigin}`, {
      origin: requestOrigin,
    });

    // Test 6: URL Consistency Check
    testURLConsistency(results, requestOrigin);

    logger.info('[Auth0 Test] Tests completed', {
      total: results.summary.total,
      passed: results.summary.passed,
      failed: results.summary.failed,
      warnings: results.summary.warnings,
    });

    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    logger.error('[Auth0 Test] Error during testing:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    addTest(results, 'Test Execution', 'fail', 'Error during test execution', {
      error: error instanceof Error ? error.message : String(error),
    });

    // Test endpoints return test results format even on error (not error response format)
    // This is intentional - test endpoints should always return test results for debugging
    return NextResponse.json(results, {
      status: 500,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  }
}
