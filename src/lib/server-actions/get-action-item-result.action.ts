import {groupBy, mapValues, orderBy, toPairs} from "lodash-es";
import {getActionItem} from "@/lib/domain/action-items.service";

export interface ActionItemResult {
    id: string;
    title: string;
    description: string;
    startedAt: string;

    firstPlace: PlaceInfo | undefined;
    secondPlace: PlaceInfo | undefined;
    thirdPlace: PlaceInfo | undefined;
    honorableMentions: PlaceInfo[];
}

export interface PlaceInfo {
    count: number;
    users: { id: string; name: string; avatarUrl: string }[];
}

export async function getActionItemResult(actionItemId: string): Promise<ActionItemResult> {
    const item = await getActionItem(actionItemId);
    const allUsersById = mapValues(groupBy(item.achievements.map(a => a.by), u => u._id.toString()), ([user]) => user);
    const achievementCountsByUserId = mapValues(groupBy(item.achievements, a => a.by._id.toString()), as => as.length);
    const countsWithUsers = toPairs(
        mapValues(
            groupBy(toPairs(achievementCountsByUserId), ([, count]) => count),
            userIdsWithCount => userIdsWithCount.map(([userId]) => ({
                id: userId,
                name: allUsersById[userId].name,
                avatarUrl: allUsersById[userId].avatarUrl
            }))))
        .map(([count, users]) => ({count: parseInt(count), users})); // parseInt since grouping by count made it a key and therefore a string

    const descCountsWithUsers = orderBy(countsWithUsers, 'count', 'desc');

    return {
        id: item._id.toString(),
        title: item.title,
        description: item.description,
        startedAt: item.startedAt,

        firstPlace: descCountsWithUsers[0],
        secondPlace: descCountsWithUsers[1],
        thirdPlace: descCountsWithUsers[2],
        honorableMentions: descCountsWithUsers.slice(3),
    };
}