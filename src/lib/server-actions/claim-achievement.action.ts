"use server"

import {addAchievement as serviceClaimAchievement} from "@/lib/domain/action-items.service";
import {getLoggedInUserOrFail} from "@/lib/auth/client-auth.service";
import {ActionItemOverview, mapToActionItemOverview} from "@/lib/server-actions/common";

export async function claimAchievementAction(actionItemId: string, proof: string): Promise<ActionItemOverview> {
    const user = await getLoggedInUserOrFail();
    const updatedItem = await serviceClaimAchievement({userId: user.id, actionItemId, proof});

    return mapToActionItemOverview(updatedItem, user);
}