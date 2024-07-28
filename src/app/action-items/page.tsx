import Link from "next/link";
import {getActiveActionItems} from "@/lib/domain/action-items.service";
import ActionItemsListCompoment from "@/app/action-items/action-items-list.compoment";
import {getUser} from "@/lib/auth/auth.service";

export default async function ActionItemsPage() {
    const activeActionItems = await getActiveActionItems();

    return (
        <main>
            <Link href="/action-items/new">Create new</Link>

            <ActionItemsListCompoment initialActiveActionItems={activeActionItems} user={getUser()} />
        </main>
    );
}
