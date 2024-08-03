import ActionItemsOverview from "@/components/action-items-overview/action-items-overview.component";
import {getActionItemsOverviewAction} from "@/lib/server-actions/get-action-items-overview.action";

export default async function ActionItemsPage() {
    const actionItems = await getActionItemsOverviewAction();

    return (
        <main>
            <ActionItemsOverview initialActionItems={actionItems}/>
        </main>
    );
}
