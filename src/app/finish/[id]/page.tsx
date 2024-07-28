import {getActionItemResult} from "@/lib/domain/action-items.service";
import {ItemResult} from "@/components/item-result/item-result.component";
import {flatten, shuffle} from "lodash-es";

export default async function ActionItemDetailPage({ params }: { params: { id: string } }) {
    const result = await getActionItemResult(params.id);

    // this needs to be computed in the Server component, as there is some randomness which wouldn't be matched by the Client component
    const allUsersWithAchievements = shuffle([
        ...result.firstPlace?.users ?? [],
        ...result.secondPlace?.users ?? [],
        ...result.thirdPlace?.users ?? [],
        ...flatten(result.honorableMentions.map(m => m.users))
    ]);

    return (
        <ItemResult result={result} allUsers={allUsersWithAchievements} />
    );
}
