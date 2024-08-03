import {login} from "@/lib/auth/auth.service";
import {redirect} from "next/navigation";
import {tryGetCredentials} from "@/lib/auth/client-auth.service";
import {NextResponse} from "next/server";

export async function GET() {
    const credentials = tryGetCredentials();
    if (credentials === 'notFound') {
        throw new Error('Expected credentials at this point. Something wrong with the middleware?');
    }

    const result = await login(credentials);

    if (result === 'success') {
        redirect('/');
    } else {
        return new NextResponse('Authentication required', {
            status: 401,
            headers: { 'WWW-Authenticate': 'Basic' },
        });
    }
}
