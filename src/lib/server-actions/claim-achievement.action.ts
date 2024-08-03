"use server"

import {claimAchievement as serviceClaimAchievement} from "@/lib/domain/action-items.service";
import {getLoggedInUserOrFail} from "@/lib/auth/client-auth.service";
import {ActionItem} from "@/lib/domain/action-items.model";

export async function claimAchievement(actionItemId: string, proof: string): Promise<ActionItem> {
    const user = await getLoggedInUserOrFail();
    return await serviceClaimAchievement({user, actionItemId, proof});
}