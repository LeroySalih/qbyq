import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const requestHeaders = new Headers(req.headers);
    // Store current request pathname in a custom header
    requestHeaders.set('x-pathname', req.nextUrl.pathname);

    const res = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    const supabase = createMiddlewareSupabaseClient({req, res});
    await supabase.auth.getSession();
    //console.log("Middleware completed.")
    return res;
}