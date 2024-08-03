/**
 * As this will be used from the middleware, we cannot import any DB related modules (mongoose/mongo-client will throw exceptions).
 * It is still a mystery to my what that is the case.
 *
 * Anyway. For this reason the AuthService has been split into two parts. This is the one without DB access.
 */

import {Credentials, LoggedInUser} from "@/lib/auth/auth.model";
import {cookies, headers} from "next/headers";
import {config} from "@/lib/config/config";
import * as jose from 'jose'

const authCookieName = 'SMAuth';
const secret = new TextEncoder().encode(config.jwtSecret);

export function logout() {
    cookies().delete(authCookieName);
}

export function tryGetCredentials(): Credentials | 'notFound' {
    const authHeader = headers().get('authorization') || headers().get('Authorization');
    if (!authHeader) {
        return 'notFound';
    }

    const [user, pass] = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    return user && pass ? { user, pass } : 'notFound';
}

export async function tryGetLoggedInUser(): Promise<LoggedInUser | 'notFound' | 'validationFailed'> {
    const authCookie = cookies().get(authCookieName);
    if (!authCookie) {
        return 'notFound';
    }

    try {
        const { payload } = await jose.jwtVerify(authCookie.value, secret);
        return payloadToLoggedInUser(payload);
    }
    catch (e) {
        console.error('Failed to validate auth token', e);
        return 'validationFailed';
    }
}

export async function getLoggedInUserOrFail(): Promise<LoggedInUser> {
    const loggedInUser = await tryGetLoggedInUser();
    if (loggedInUser === 'notFound' || loggedInUser === 'validationFailed') {
        throw new Error('At this point the user should be logged in');
    }

    return loggedInUser;
}

function payloadToLoggedInUser(payload: jose.JWTPayload): LoggedInUser {
    return {
        id: payload.sub!,
        userName: payload.userName as string,
        name: payload.name as string,
        roles: JSON.parse(payload.roles as string) as string[],
        avatarUrl: payload.avatarUrl as string
    };
}