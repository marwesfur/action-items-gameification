'use server';

import {Achievement, ActionItem} from "./action-items.model";
import {ActionItemModel, ensureConnected} from "@/lib/storage/mongo.service";
import {getUser} from "@/lib/auth/auth.service";

export async function getActiveActionItems(): Promise<ActionItem[]> {
    await ensureConnected();
    const items = await ActionItemModel.find({'archived': false}).exec();

    return items.map(item => ({
        id: item._id.toString(),
        title: item.title,
        description: item.description,
        startedAt: item.startedAt,
        archived: item.archived,
        achievements: item.achievements.map(achievement => ({
            by: achievement.by,
            at: achievement.at,
            proof: achievement.proof
        }))
    }));
}

export async function claimAchievement(actionItemId: string) {
    const user = getUser();

    const newAchievement: Achievement = {
        by: user,
        at: new Date().toUTCString(),
        proof: ''
    };

    const updatedModel = await ActionItemModel.findByIdAndUpdate(actionItemId,
        { $push: { achievements: newAchievement } },
        { new: true }
        ).exec();

    console.log(updatedModel);
}

export interface CreateActionItemRequest {
    title: string;
    description: string;
}

export async function createActionItem(request: CreateActionItemRequest): Promise<ActionItem> {
    await ensureConnected();

    const actionItem: Omit<ActionItem, 'id'> = {
        ...request,
        archived: false,
        startedAt: new Date().toISOString(),
        achievements: []
    };
    const model = new ActionItemModel(actionItem);
    await model.save();

    return model;
}