import {createActionItem} from "@/lib/domain/action-items.service";

export default function NewActionItemPage() {

    async function createActionItemFromForm(formData: FormData) {
        'use server';

        await createActionItem({ title: formData.get('title') as string, description: formData.get('description')  as string });
    }

    return (
        <form action={createActionItemFromForm}>
            Title: <input name="title"/> <br/>
            Description: <textarea name="description"/> <br/>

            <button type="submit">Create</button>

        </form>

    )

}