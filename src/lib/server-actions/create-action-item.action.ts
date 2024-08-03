"use server"

import {getLoggedInUserOrFail} from "@/lib/auth/client-auth.service";
import {createActionItem as createActionItemService} from "@/lib/domain/action-items.service";

export async function createActionItem(title: string, description: string) {
    const user = await getLoggedInUserOrFail();

    await createActionItemService({ userId: user.id, title, description});
}