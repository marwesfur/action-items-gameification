"use client"

import {Button} from "@nextui-org/button";
import {Card, CardBody, CardHeader} from "@nextui-org/card";
import {Divider} from "@nextui-org/divider";
import {archiveActionItem} from "@/lib/domain/action-items.service";
import {useRouter} from 'next/navigation';
import Confetti from "react-confetti";
import {ActionItemResult, PlaceInfo} from "@/lib/server-actions/get-action-item-result.action";
import {Tooltip} from "@nextui-org/tooltip";
import {Avatar} from "@nextui-org/avatar";
import useDeviceSize from "@/utils/use-device-size";

type User = PlaceInfo['users'][0];

export function ItemResult({ result }: { result: ActionItemResult }) {
    const router = useRouter();
    const [width, height] = useDeviceSize();

    async function onArchive() {
        await archiveActionItem(result.id);
        router.replace('/');
    }

    return (
        <div>
            <Card>
                <CardHeader>
                    <b>{result.title}</b>
                </CardHeader>
                <Divider />
                <CardBody>
                    {result.description}
                </CardBody>
            </Card>

            <Confetti
                width={width}
                height={height}
                numberOfPieces={500}
            />

            <div className="flex justify-center">
                <div className="gap-8 grid grid-cols-12 m-20 items-end">
                    <Podium which="second" awarded={!!result.secondPlace} users={result.secondPlace?.users}
                            count={result.secondPlace?.count}/>
                    <Podium which="first" awarded={!!result.firstPlace} users={result.firstPlace?.users}
                            count={result.firstPlace?.count}/>
                    <Podium which="third" awarded={!!result.thirdPlace} users={result.thirdPlace?.users}
                            count={result.thirdPlace?.count}/>
                </div>
            </div>

            <Button onClick={onArchive}>Archive</Button>
        </div>
    );
}

function Podium({which, awarded, users, count}: {
    which: 'first' | 'second' | 'third',
    awarded: boolean,
    users?: User[],
    count?: number
}) {
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
    const heights = {
        'first': '300px',
        'second': '200px',
        'third': '100px'
    }

    return (
        <div className="col-span-4 flex flex-col items-center gap-2" style={ {maxWidth: '300px'} }>
            <div className="flex gap-4 flex-wrap-reverse justify-center mx-4">
                {
                    (users ?? []).map(user => (
                        <Tooltip content={user.name} key={user.id}>
                            <Avatar name={user.name} src={user.avatarUrl} size="lg" />
                        </Tooltip>
                    ))
                }
            </div>
            <Card className={'w-full bg-gradient-to-tl ' + bgs[which]  + (!awarded ? ' opacity-40' : '')} style={ {height: heights[which] } }>
                <CardBody className="text-center">
                    <b>{names[which]}: {awarded ? `${count} Points` : 'Not awarded'}</b>
                </CardBody>
                <Divider/>
            </Card>
        </div>
    );
}