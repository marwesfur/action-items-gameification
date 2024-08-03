"use client"

import {useState} from "react";
import {deleteActionItem} from "@/lib/domain/action-items.service";
import {Card, CardBody, CardFooter, CardHeader} from "@nextui-org/card";
import {Divider} from "@nextui-org/divider";
import {Button} from "@nextui-org/button";
import {useRouter} from 'next/navigation'
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import {Input, Textarea} from "@nextui-org/input";
import Flash from "@/components/flash/flash.component";
import {useRetroMode} from "@/lib/contexts/retro-mode.context";
import {claimAchievementAction} from "@/lib/server-actions/claim-achievement.action";
import {ActionItemOverview} from "@/lib/server-actions/common";
import {Popover, PopoverContent, PopoverTrigger} from "@nextui-org/popover";
import {formatData} from "@/utils/format-date";
import {Avatar} from "@nextui-org/avatar";
import {Tooltip} from "@nextui-org/tooltip";

export default function ActionItemsOverview(props: { initialActionItems: ActionItemOverview[] }) {
    const [actionItems, setActionItems] = useState(props.initialActionItems);
    const [claimingItem, setClaimingItem] = useState<ActionItemOverview | null>(null);
    const [justClaimedItem, setJustClaimedItem] = useState<ActionItemOverview | null>(null);
    const [filter, setFilter] = useState('');
    const [proof, setProof] = useState('');
    const router = useRouter()

    async function onDeleteItem(item: ActionItemOverview) {
        await deleteActionItem(item.id);
        setActionItems(old => old.filter(o => o.id !== item.id));
    }

    function onFinishItem(item: ActionItemOverview) {
        router.push(`/finish/${item.id}`);
    }

    function onStartClaimItem(item: ActionItemOverview) {
        setClaimingItem(item);
        setProof('');
    }

    async function onFinishClaimItem() {
        const updatedItem = await claimAchievementAction(claimingItem!.id, proof);

        setActionItems(old => old.map(o => o.id !== claimingItem!.id ? o : updatedItem));
        setClaimingItem(null);
        setJustClaimedItem(updatedItem);
        setTimeout(() => setJustClaimedItem(null), 500);
    }

    function onAbortClaimItem() {
        setClaimingItem(null);
    }

    function filteredItems() {
        return !filter
            ? actionItems
            : actionItems.filter(({title, description}) => title.toLowerCase().includes(filter.toLowerCase()) || description.toLowerCase().includes(filter.toLocaleLowerCase()));
    }

    return (
        <>
            <Input placeholder="Filter items" value={filter} onValueChange={setFilter} className="mb-5"></Input>

            <div className="gap-8 grid grid-cols-12">
                {
                    filteredItems().map(item => (
                        <div  className="col-span-4 sm:col-span-3" key={item.id}>
                            <ItemCard
                                item={item}
                                flash={item.id === justClaimedItem?.id}
                                onDelete={() => onDeleteItem(item)}
                                onClaim={() => onStartClaimItem(item)}
                                onFinish={() => onFinishItem(item)} />
                        </div>
                    ))
                }
            </div>

            <Modal isOpen={claimingItem !== null} hideCloseButton={true}>
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader>I was a good girl/boy</ModalHeader>
                            <ModalBody>
                                <p>
                                    {claimingItem?.title} <br />
                                    {claimingItem?.description}
                                </p>

                                <Textarea
                                    label="Here is my proof"
                                    placeholder="Paste a link to a story, name a PR, or let's just trust each other"
                                    className="w-full"
                                    value={proof}
                                    onValueChange={setProof}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onAbortClaimItem}>
                                    Never mind
                                </Button>
                                <Button color="primary" onPress={onFinishClaimItem}>
                                    So proud
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

function ItemCard({ item, onDelete, onFinish, onClaim, flash }: { item: ActionItemOverview, flash: boolean, onDelete: () => void, onClaim: () => void, onFinish: () => void }) {
    const isRetroModeActive = useRetroMode();
    const somebodyScored = item.ownScore + item.bestOtherColleagueScore > 0;

    return (
        <Card className="w-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-500 text-slate-950" >
            <CardHeader className="flex justify-between items-start">
                <div className="flex flex-col items-start">
                    <b>{item.title}</b>
                    <p>{item.description}</p>
                </div>
                <Popover placement="right" showArrow={true} color="primary">
                    <PopoverTrigger>
                        <Button isIconOnly size="sm" className="ml-1 mb-1">?</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <div className="px-1 py-2">
                            <div className="text-small font-bold">Created by {item.createdBy.name}</div>
                            <div className="text-small">{formatData(item.startedAt)}</div>
                        </div>
                    </PopoverContent>
                </Popover>
            </CardHeader>
            <Divider/>
            <CardBody>
                <div className="mb-2 flex flex-wrap gap-2">
                    {
                        item.allUsersWhoScored.map(user => (
                            <Tooltip content={user.name} key={user.id}>
                                <Avatar name={user.name} src={user.avatarUrl} />
                            </Tooltip>
                        ))
                    }
                </div>
                {
                    somebodyScored
                        ? <p>I did it <b><Flash content={item.ownScore + ''} flash={flash} flashClassName="text-white" /></b> times</p>
                        : <span>No accomplishments yet</span>
                }
                { item.bestOtherColleagueScore ? <p>The best colleague did it <b>{item.bestOtherColleagueScore}</b> times</p> : <></> }
            </CardBody>
            <Divider/>
            <CardFooter>
                <div className="grow flex items-center justify-between flex-wrap gap-2">
                    {
                        !isRetroModeActive
                            ? (<Button onClick={onClaim} className="bg-gradient-to-tl from-fuchsia-800 via-purple-800 to-cyan-700 text-white shadow-lg">I totally did it</Button>)
                            : somebodyScored
                                ? (<Button variant="faded" onClick={onFinish}>Issue awards</Button>)
                                : (<Button color="danger" onClick={onDelete}>Delete</Button>)
                    }
                </div>
            </CardFooter>
        </Card>
    );
}