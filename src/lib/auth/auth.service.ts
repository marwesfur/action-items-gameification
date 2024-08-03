"use server"

import {Credentials} from "@/lib/auth/auth.model";
import {config} from "@/lib/config/config";
import {createUser, getUser, tryGetUserByUserName} from "@/lib/domain/user.service";
import {User} from "@/lib/domain/user.model";
import * as jose from 'jose'
import {getLoggedInUserOrFail} from "@/lib/auth/client-auth.service";
import {cookies} from "next/headers";

const secret = new TextEncoder().encode(config.jwtSecret);

/**
 * Transparent registration: If the username does not yet exist, we create a new user on the fly.
 * Deliberately no password check atm -- who wants to remember/manage yet another password?!
 */
export async function login(credentials: Credentials): Promise<'success' | 'invalidCredentials'> {
    if (credentials.pass !== config.password) {
        return 'invalidCredentials';
    }


    let user = await tryGetUserByUserName(credentials.user);
    if (!user) {
        user = await createUser({ userName: credentials.user });
    }

    const payload = userToPayload(user);
    const token = await new jose.SignJWT(payload)
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .sign(secret);
    cookies().set('SMAuth', token);

    return 'success';
}

export async function refreshLogin(): Promise<void> {
    const loggedInUser = await getLoggedInUserOrFail();
    const user = await getUser(loggedInUser.id);
    const payload = userToPayload(user);
    const token = await new jose.SignJWT(payload)
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .sign(secret);

    cookies().set('SMAuth', token);
}

function userToPayload(user: User): jose.JWTPayload {
    return {
        sub: user._id.toString(),
        userName: user.userName,
        name: user.name,
        roles: JSON.stringify(user.roles),
        avatarUrl: user.avatarUrl
    };
}
