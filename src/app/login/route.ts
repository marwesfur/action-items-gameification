import {login} from "@/lib/auth/auth.service";
import {redirect} from "next/navigation";
import {tryGetCredentials} from "@/lib/auth/client-auth.service";

export async function GET() {
    const credentials = tryGetCredentials();
    if (credentials === 'notFound') {
        throw new Error('Expected credentials at this point. Something wrong with the middleware?');
    }

    await login(credentials);
    redirect('/');
}
