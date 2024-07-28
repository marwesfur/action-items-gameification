import {NextRequest, NextResponse} from "next/server";
import {extractCredentials} from "@/lib/auth/auth.service";

export function middleware(req: NextRequest) {
    const credentials = extractCredentials(req.headers);
    if (credentials === 'notFound') {
        return new NextResponse('Authentication required', {
            status: 401,
            headers: { 'WWW-Authenticate': 'Basic' },
        });
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/(.*)',
}