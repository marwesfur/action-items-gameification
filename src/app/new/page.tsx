import {Input, Textarea} from "@nextui-org/input";
import {Button} from "@nextui-org/button";
import { redirect } from 'next/navigation';
import {createActionItem} from "@/lib/server-actions/create-action-item.action";

export default function NewActionItemPage() {

    async function createActionItemFromForm(formData: FormData) {
        "use server"

        const title = formData.get('title') as string;
        const description = formData.get('description')  as string;

        if (title?.trim() && description?.trim()) {
            await createActionItem(title, description);
            redirect('/');
        }
    }

    return (
        <form action={createActionItemFromForm} className="w-[50%] flex flex-col gap-4">
            <Input label="Title" name="title" />
            <Textarea label="Description" name="description" />

            <Button type="submit">Create</Button>
        </form>
    );
}