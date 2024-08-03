'use server';

import {Achievement, ActionItem} from "./action-items.model";
import {ActionItemModel, ensureConnected} from "@/lib/storage/mongo.service";
import {Types} from "mongoose";
import {User} from "@/lib/domain/user.model";

export interface CreateActionItemRequest {
    userId: string;
    title: string;
    description: string;
}

export async function createActionItem(request: CreateActionItemRequest): Promise<ActionItem<User>> {
    await ensureConnected();

    const actionItem: Omit<ActionItem<Types.ObjectId>, '_id'> = {
        title: request.title,
        description: request.description,
        achievements: [],
        createdBy: new Types.ObjectId(request.userId),
        startedAt: new Date().toISOString(),
        archived: false
    };
    const model = new ActionItemModel(actionItem);
    await model.save();
    await model.populate();

    return model;
}

export async function getActionItem(id: string): Promise<ActionItem<User>> {
    await ensureConnected();

    const actionItem = await ActionItemModel.findById(id).exec();
    await actionItem.populate(['createdBy', 'achievements.by']);

    return actionItem;
}

export async function getActiveActionItems(): Promise<ActionItem<User>[]> {
    await ensureConnected();

    return await ActionItemModel
        .find({ archived: false })
        .populate(['createdBy', 'achievements.by'])
        .exec();
}

export async function deleteActionItem(actionItemId: string): Promise<void> {
    await ensureConnected();
    await ActionItemModel.findByIdAndDelete(actionItemId).exec();
}

export interface AddAchievementRequest {
    userId: string;
    actionItemId: string;
    proof: string;
}

export async function addAchievement(request: AddAchievementRequest): Promise<ActionItem<User>> {
    await ensureConnected();
    const newAchievement: Achievement<Types.ObjectId> = {
        by: new Types.ObjectId(request.userId),
        at: new Date().toISOString(),
        proof: request.proof
    };

    return await ActionItemModel
        .findByIdAndUpdate(request.actionItemId,
            {$push: {achievements: newAchievement}},
            {new: true}
        )
        .populate(['createdBy', 'achievements.by'])
        .exec();
}

export async function archiveActionItem(actionItemId: string): Promise<void> {
    await ensureConnected();
    await ActionItemModel
        .findByIdAndUpdate(actionItemId,
            {$set: {archived: true}},
            {new: true}
        )
        .exec();
}
