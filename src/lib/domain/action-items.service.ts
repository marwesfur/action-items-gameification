'use server';

import {Achievement, ActionItem, ActionItemResult} from "./action-items.model";
import {ActionItemModel, ensureConnected} from "@/lib/storage/mongo.service";
import {getUser} from "@/lib/auth/auth.service";
import {HydratedDocument} from "mongoose";
import {groupBy, mapValues, orderBy, toPairs} from "lodash-es";

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

    return toActionItem(model);
}

export async function getActiveActionItems(): Promise<ActionItem[]> {
    await ensureConnected();
    const items = await ActionItemModel.find({'archived': false}).exec();

    return items.map(toActionItem);
}

export async function deleteActionItem(actionItemId: string): Promise<void> {
    await ensureConnected();
    await ActionItemModel.findByIdAndDelete(actionItemId).exec();
}

export interface ClaimAchievementRequest {
    actionItemId: string;
    proof: string;
}

export async function claimAchievement(request: ClaimAchievementRequest): Promise<ActionItem> {
    await ensureConnected();
    const user = getUser();
    const newAchievement: Achievement = {
        by: user,
        at: new Date().toISOString(),
        proof: request.proof
    };
    const updatedModel = await ActionItemModel.findByIdAndUpdate(request.actionItemId,
        { $push: { achievements: newAchievement } },
        { new: true }
        ).exec();

    return toActionItem(updatedModel);
}

export async function getActionItemResult(actionItemId: string): Promise<ActionItemResult> {
    await ensureConnected();
    const model = await ActionItemModel.findById(actionItemId) as HydratedDocument<ActionItem>;
    const achievementCountsByUser = mapValues(groupBy(model.achievements, a => a.by), as => as.length);
    const countsWithUsers = toPairs(
            mapValues(
                groupBy(toPairs(achievementCountsByUser), ([, count]) => count),
                usersWithCount => usersWithCount.map(([user]) => user)))
            .map(([count, users]) => ({ count: parseInt(count), users })); // parseInt since grouping by count made it a key and therefore a string
    const descCountsWithUsers = orderBy(countsWithUsers, 'count', 'desc');

    return {
        id: model._id.toString(),
        title: model.title,
        description: model.description,
        startedAt: model.startedAt,

        firstPlace: descCountsWithUsers[0],
        secondPlace: descCountsWithUsers[1],
        thirdPlace: descCountsWithUsers[2],
        honorableMentions: descCountsWithUsers.slice(3),
    };
}

export async function archiveActionItem(actionItemId: string): Promise<void> {
    await ensureConnected();
    const updatedModel = await ActionItemModel.findByIdAndUpdate(actionItemId,
        { $set: { archived: true } },
        { new: true }
    ).exec();
}

function toActionItem(model: HydratedDocument<ActionItem>): ActionItem {
    return {
        id: model._id.toString(),
        title: model.title,
        description: model.description,
        startedAt: model.startedAt,
        archived: model.archived,
        achievements: model.achievements.map(achievement => ({
            by: achievement.by,
            at: achievement.at,
            proof: achievement.proof
        }))
    };
}