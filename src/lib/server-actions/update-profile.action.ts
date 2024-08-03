"use server"

import {getLoggedInUserOrFail} from "@/lib/auth/client-auth.service";
import {updateUser} from "@/lib/domain/user.service";
import {refreshLogin} from "@/lib/auth/auth.service";

export async function updateProfileAction(name: string, avatarUrl: string) {
    const currentUser = await getLoggedInUserOrFail();
    await updateUser({ id: currentUser.id, name, avatarUrl });
    await refreshLogin();
}