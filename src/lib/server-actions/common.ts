import {ActionItem} from "@/lib/domain/action-items.model";
import {User} from "@/lib/domain/user.model";
import {LoggedInUser} from "@/lib/auth/auth.model";
import {groupBy, toPairs, uniqBy} from "lodash-es";

export interface ActionItemOverview {
    id: string;
    title: string;
    description: string;

    createdBy: {
        id: string;
        name: string;
        avatarUrl: string;
    };
    startedAt: string;

    ownScore: number;
    bestOtherColleagueScore: number;
    allUsersWhoScored: {
        id: string;
        name: string;
        avatarUrl: string;
    }[];
}

export function mapToActionItemOverview(item: ActionItem<User>, currentUser: LoggedInUser): ActionItemOverview {
    return {
        id: item._id.toString(),
        title: item.title,
        description: item.description,
        createdBy: {
            id: item.createdBy._id.toString(),
            name: item.createdBy.name,
            avatarUrl: item.createdBy.avatarUrl
        },
        startedAt: item.startedAt,
        ownScore: getOwnScore(item),
        bestOtherColleagueScore: getBestOtherColleagueScore(item),
        allUsersWhoScored: getAllColleaguesWhoScored(item)
    };

    function getOwnScore(item: ActionItem<User>) {
        return item.achievements.filter(a => a.by._id.toString() === currentUser.id).length;
    }

    function getBestOtherColleagueScore(item: ActionItem<User>) {
        const othersAchievements = item.achievements.filter(a => a.by._id.toString() !== currentUser.id);
        const othersScores = toPairs(groupBy(othersAchievements, a => a.by._id.toString())).map(([_user, achievementsOfUser]) => achievementsOfUser.length);

        return Math.max(...othersScores, 0);
    }

    function getAllColleaguesWhoScored(item: ActionItem<User>) {
        return uniqBy(item.achievements, a => a.by._id.toString())
            .map(a => ({
                id: a.by._id.toString(),
                name: a.by.name,
                avatarUrl: a.by.avatarUrl
            }));
    }
}