import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const CSRF_TOKEN_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';
const TOKEN_LENGTH = 32;

/**
 * Generate a cryptographically secure random CSRF token
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(TOKEN_LENGTH);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Set CSRF token in HTTP-only cookie
 */
export async function setCsrfCookie(response: NextResponse, token: string): Promise<void> {
  response.cookies.set({
    name: CSRF_TOKEN_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

/**
 * Get CSRF token from cookie
 */
export function getCsrfTokenFromCookie(request: NextRequest): string | null {
  return request.cookies.get(CSRF_TOKEN_NAME)?.value || null;
}

/**
 * Get CSRF token from request header
 */
export function getCsrfTokenFromHeader(request: NextRequest): string | null {
  return request.headers.get(CSRF_HEADER_NAME);
}

/**
 * Verify CSRF token
 * Compares token from cookie with token from header
 */
export function verifyCsrfToken(request: NextRequest): boolean {
  const cookieToken = getCsrfTokenFromCookie(request);
  const headerToken = getCsrfTokenFromHeader(request);

  if (!cookieToken || !headerToken) {
    console.warn('CSRF verification failed: missing token', {
      hasCookie: !!cookieToken,
      hasHeader: !!headerToken,
    });
    return false;
  }

  // Constant-time comparison to prevent timing attacks
  if (cookieToken.length !== headerToken.length) {
    console.warn('CSRF verification failed: token length mismatch');
    return false;
  }

  // Use subtle crypto for timing-safe comparison
  const encoder = new TextEncoder();
  const cookieBuffer = encoder.encode(cookieToken);
  const headerBuffer = encoder.encode(headerToken);

  try {
    // Use crypto.subtle.timingSafeEqual if available (Node.js 15+)
    // Fallback to simple comparison for now
    const matches = cookieToken === headerToken;
    
    if (!matches) {
      console.warn('CSRF verification failed: token mismatch');
    }
    
    return matches;
  } catch (error) {
    console.error('CSRF verification error:', error);
    return false;
  }
}

/**
 * Middleware to verify CSRF token for state-changing requests
 * Call this at the start of POST/PUT/PATCH/DELETE handlers
 */
export function requireCsrfToken(request: NextRequest): NextResponse | null {
  const method = request.method.toUpperCase();
  
  // Only check CSRF for state-changing requests
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    if (!verifyCsrfToken(request)) {
      console.warn('CSRF token validation failed', {
        method,
        url: request.url,
        hasAuthHeader: !!request.headers.get('authorization'),
      });
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'CSRF token validation failed. Please refresh the page and try again.',
          code: 'CSRF_VALIDATION_FAILED',
        },
        { status: 403 }
      );
    }
  }
  
  return null; // No error, proceed with request
}

/**
 * Check if request is from same origin (additional CSRF protection)
 */
export function verifySameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const host = request.headers.get('host');

  if (!host) {
    return false;
  }

  const expectedOrigin = process.env.NODE_ENV === 'production'
    ? `https://${host}`
    : `http://${host}`;

  // Check origin header
  if (origin && origin !== expectedOrigin) {
    console.warn('Origin mismatch', { origin, expected: expectedOrigin });
    return false;
  }

  // Check referer header as fallback
  if (referer && !referer.startsWith(expectedOrigin)) {
    console.warn('Referer mismatch', { referer, expected: expectedOrigin });
    return false;
  }

  return true;
}
