
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import createMiddlewareServer from "app/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  
  
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });


  // refresh token if required
  const supabase = createMiddlewareServer(request, response);
  const user = await supabase.auth.getUser()
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

