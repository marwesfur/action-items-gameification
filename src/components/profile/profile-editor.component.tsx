"use client";

import {Input} from "@nextui-org/input";
import {Avatar} from "@nextui-org/avatar";
import {useState} from "react";
import {useThrottling} from "@/utils/use-throttling";
import {Button} from "@nextui-org/button";
import {useRouter} from "next/navigation";
import {updateProfileAction} from "@/lib/server-actions/update-profile.action";
import {LoggedInUser} from "@/lib/auth/auth.model";

export default function ProfileEditor({user}: { user: LoggedInUser }) {

    const [name, setName] = useState(user.name);
    const [nameInvalid, setNameInvalid] = useState(false);
    const [avatarUrlInput, setAvatarUrlInput] = useState(user.avatarUrl);
    const [avatarUrlInvalid, setAvatarUrlInvalid] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
    const throttle = useThrottling(500);
    const router = useRouter()

    function onNameChange(newName: string) {
        setName(newName);
        setNameInvalid(!newName);
    }

    function onAvatarUrlChange(newUrl: string) {
        setAvatarUrlInvalid(false);
        setAvatarUrlInput(newUrl);
        throttle(() => setAvatarUrl(newUrl));
    }

    function onAvatarUrlLoadError() {
        setAvatarUrlInvalid(true);
    }

    function onCancel() {
        router.push('/');
    }

    async function onSave() {
        if (nameInvalid || avatarUrlInvalid) {
            return;
        }

        await updateProfileAction(name, avatarUrl);
        router.push('/');
    }

    return (
        <>
            <div className="max-w-screen-lg mx-auto">

                <h1 className="text-4xl mb-6">Edit your profile</h1>

                <div className="flex gap-4">

                    <div className="flex w-full flex-col gap-4">
                        <Input label="Your name"
                               value={name}
                               onValueChange={onNameChange}
                               isInvalid={nameInvalid}
                               errorMessage="Provide a name" />
                        <Input type="email"
                               label="Profile photo"
                               value={avatarUrlInput}
                               onValueChange={onAvatarUrlChange}
                               isInvalid={avatarUrlInvalid}
                               errorMessage="Could not load profile photo from given url"
                               description="Use, for example, your Slack profile photo"/>
                        <div className="flex gap-4 justify-end">
                            <Button color="secondary" onClick={onCancel}>Cancel</Button>
                            <Button color="primary" onClick={onSave}>Save</Button>
                        </div>
                    </div>

                    <Avatar name={name} src={avatarUrl} className="w-40 h-40 text-large shrink-0 ml-8" onError={onAvatarUrlLoadError}/>
                </div>

            </div>
        </>
    );
}