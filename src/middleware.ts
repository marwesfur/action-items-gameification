import {NextRequest, NextResponse} from "next/server";
import {logout, tryGetCredentials, tryGetLoggedInUser} from "@/lib/auth/client-auth.service";

export async function middleware(req: NextRequest) {
    const isLoginRoute = req.nextUrl.pathname === '/login';
    const credentials = tryGetCredentials();
    const user = await tryGetLoggedInUser();

    if (user === 'validationFailed') {
        logout(); // cannot happen here, need to redirect to /logout and use a route handler there
        return requireAuthentication();
    }

    if (user === 'notFound' && !isLoginRoute) {
        // see https://nextjs.org/docs/messages/middleware-relative-urls
        const url = req.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url);
    }

    if (user ==='notFound' && isLoginRoute && credentials === 'notFound') {
        return requireAuthentication();
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/(.*)',
}

function requireAuthentication() {
    return new NextResponse('Authentication required', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic' },
    });
}