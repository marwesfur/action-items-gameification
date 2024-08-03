import {ItemResult} from "@/components/item-result/item-result.component";
import {getActionItemResult} from "@/lib/server-actions/get-action-item-result.action";

export default async function ActionItemDetailPage({ params }: { params: { id: string } }) {
    const result = await getActionItemResult(params.id);

    return (
        <ItemResult result={result} />
    );
}
