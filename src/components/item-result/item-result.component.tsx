"use client"

import {ActionItemResult} from "@/lib/domain/action-items.model";
import {Button} from "@nextui-org/button";
import {useState} from "react";
import {Card, CardBody, CardHeader} from "@nextui-org/card";
import {Divider} from "@nextui-org/divider";
import {archiveActionItem} from "@/lib/domain/action-items.service";
import {useRouter} from 'next/navigation';
import Confetti from "react-confetti";

export function ItemResult({ result, allUsers }: { result: ActionItemResult, allUsers: string[] }) {
    const [isRevealed, setIsRevealed] = useState(false);
    const router = useRouter();

    function onReveal() {
        setIsRevealed(true);
    }

    async function onArchive() {
        await archiveActionItem(result.id);
        router.replace('/');
    }

    return (
        <div>
            {result.title} <br />
            {result.description} <br />

            The following colleagues contributed to this item: {allUsers.join(', ')}

            {
                isRevealed
                    ? (<AwardCeremony result={result} onArchive={onArchive} />)
                    : (<div><Button className="mt-2" onPress={onReveal}>Reveal</Button></div>)
            }
        </div>
    );
}

function AwardCeremony({ result, onArchive }: { result: ActionItemResult, onArchive: () => void }) {
    return (
        <div className="gap-8 grid grid-cols-12 m-10">
            <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                numberOfPieces={500}
                recycle={false}
            />

            <Podium which="first" awarded={!!result.firstPlace} users={result.firstPlace?.users} count={result.firstPlace?.count} />
            <Podium which="second" awarded={!!result.secondPlace} users={result.secondPlace?.users} count={result.secondPlace?.count} />
            <Podium which="third" awarded={!!result.thirdPlace} users={result.thirdPlace?.users} count={result.thirdPlace?.count} />

            <Button onClick={onArchive}>Archive</Button>
        </div>
    );
}

function Podium( { which, awarded, users, count } : { which: 'first' | 'second' | 'third', awarded: boolean, users?: string[], count?: number }) {
    const bgs = {
        'first': 'from-amber-400 via-amber-500 to-amber-500',
        'second': 'from-gray-400 via-gray-400 to-gray-500',
        'third': 'from-orange-800 via-orange-800 to-orange-700'
    }
    const names = {
        'first': 'First place',
        'second': 'Second place',
        'third': 'Third place'
    }

    return (
        <Card className={'col-span-4 w-full bg-gradient-to-tl ' + bgs[which]  + (!awarded ? ' opacity-40' : '')}>
            <CardHeader>
                <b>{names[which]}: {awarded ? `${count} Points` : 'Not awarded'}</b>
            </CardHeader>
            <Divider/>
            <CardBody>
                {
                    (users ?? []).map(user => (<p>{user}</p>))
                }
            </CardBody>
            <Divider/>
        </Card>
    );
}