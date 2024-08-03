import ActiveList from "@/components/active-list/active-list.component";
import {getLoggedInUserOrFail} from "@/lib/auth/client-auth.service";
import {getActiveActionItems} from "@/lib/domain/action-items.service";

export default async function ActionItemsPage() {
    const user = await getLoggedInUserOrFail();
    const activeActionItems = await getActiveActionItems();

  return (
      <main>
        <ActiveList initialActiveActionItems={activeActionItems} user={user.userName} />
      </main>
  );
}
