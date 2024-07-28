import {getActiveActionItems} from "@/lib/domain/action-items.service";
import {getUser} from "@/lib/auth/auth.service";
import ActiveList from "@/components/active-list/active-list.component";

export default async function ActionItemsPage() {
  const activeActionItems = await getActiveActionItems();

  return (
      <main>
        <ActiveList initialActiveActionItems={activeActionItems} user={getUser()} />
      </main>
  );
}
