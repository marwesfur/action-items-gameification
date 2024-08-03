import {getLoggedInUserOrFail} from "@/lib/auth/client-auth.service";
import ProfileEditor from "@/components/profile/profile-editor.component";

export default async function Profile() {
    const user = await getLoggedInUserOrFail();

    return (
       <ProfileEditor user={user} />
    );
}