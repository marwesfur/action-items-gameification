"use client"

import {useState} from "react";
import {ActionItem} from "@/lib/domain/action-items.model";
import {claimAchievement} from "@/lib/domain/action-items.service";
import {groupBy, toPairs} from 'lodash-es';

export default function (props: { user: string, initialActiveActionItems: ActionItem[] }) {
    const [actionItems, setActionItems] = useState(props.initialActiveActionItems);
    const [selectedItem, setSelectedItem] = useState<ActionItem | null>(null);

    function handleClickItem(item: ActionItem) {
        setSelectedItem(item);
    }

    async function handleClaimAchivementClick() {
        await claimAchievement(selectedItem!.id!);
    }

    function getOwnAchievements(item: ActionItem) {
        return item.achievements.filter(a => a.by === props.user).length;
    }

    function getAchievementsOfBestOther(item: ActionItem) {
        const othersAchievements = item.achievements.filter(a => a.by !== props.user);
        const othersCounts = toPairs(groupBy(othersAchievements, a => a.by)).map(([_user, achievementsOfUser]) => achievementsOfUser.length);

        return Math.max(...othersCounts, 0);
    }

    return (
        <div>
            <ul>
                {
                    actionItems.map(item => (
                        <li key={item.id} onClick={() => handleClickItem(item)}>{item.title} (own: {getOwnAchievements(item)}, best other: {getAchievementsOfBestOther(item)})</li>
                    ))
                }
            </ul>

            {
                selectedItem &&
                    (<button onClick={() => handleClaimAchivementClick()}>Yes, I did it (for {selectedItem.description})</button>)
            }
        </div>
    );
}