"use server"

import {getLoggedInUserOrFail} from "@/lib/auth/client-auth.service";
import {getActiveActionItems} from "@/lib/domain/action-items.service";
import {ActionItemOverview, mapToActionItemOverview} from "@/lib/server-actions/common";

export async function getActionItemsOverviewAction(): Promise<ActionItemOverview[]> {
    const currentUser = await getLoggedInUserOrFail();
    const activeItems = await getActiveActionItems();

    return activeItems.map(item => mapToActionItemOverview(item, currentUser));
}
