import { headers } from 'next/headers'
import {NextRequest} from "next/server";

export function getUser(): string {
    const credentials = extractCredentials(headers());
    return credentials === 'notFound' ? '' : credentials.user;
}



export function extractCredentials(headers: Headers): { user: string; pass: string } | 'notFound' {
    const authHeader = headers.get('authorization') || headers.get('Authorization');
    if (!authHeader) {
        return 'notFound';
    }

    const [user, pass] = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    return user && pass ? { user, pass } : 'notFound';
}