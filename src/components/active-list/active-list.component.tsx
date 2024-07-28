"use client"

import {useState} from "react";
import {ActionItem} from "@/lib/domain/action-items.model";
import {claimAchievement, deleteActionItem} from "@/lib/domain/action-items.service";
import {groupBy, toPairs} from 'lodash-es';
import {Card, CardBody, CardFooter, CardHeader} from "@nextui-org/card";
import {Divider} from "@nextui-org/divider";
import {Button} from "@nextui-org/button";
import {useRouter} from 'next/navigation'
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import {Input, Textarea} from "@nextui-org/input";
import Flash from "@/components/flash/flash.component";

export default function ActiveList(props: { user: string, initialActiveActionItems: ActionItem[] }) {
    const [actionItems, setActionItems] = useState(props.initialActiveActionItems);
    const [claimingItem, setClaimingItem] = useState<ActionItem | null>(null);
    const [justClaimedItem, setJustClaimedItem] = useState<ActionItem | null>(null);
    const [filter, setFilter] = useState('');
    const [proof, setProof] = useState('');
    const router = useRouter()

    async function onDeleteItem(item: ActionItem) {
        await deleteActionItem(item.id);
        setActionItems(old => old.filter(o => o.id !== item.id));
    }

    function onFinishItem(item: ActionItem) {
        router.push(`/finish/${item.id}`);
    }

    function onStartClaimItem(item: ActionItem) {
        setClaimingItem(item);
        setProof('');
    }

    async function onFinishClaimItem() {
        const updatedItem = await claimAchievement({ actionItemId: claimingItem!.id, proof });
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
            <Input placeholder="Filter items" value={filter} onValueChange={setFilter} className="mb-2"></Input>

            <div className="gap-8 grid grid-cols-12">
                {
                    filteredItems().map(item => (
                        <div  className="col-span-4 sm:col-span-3" key={item.id}>
                            <ItemCard
                                item={item}
                                user={props.user}
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

function ItemCard({ item, user, onDelete, onFinish, onClaim, flash }: { item: ActionItem, user: string, flash: boolean, onDelete: () => void, onClaim: () => void, onFinish: () => void }) {
    const ownCount = getOwnAchievementsCount();
    const bestOtherCount = getAchievementsOfBestOtherCount();
    const hasAchievements = item.achievements.length > 0;

    return (
        <Card className="w-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-500" >
            <CardHeader className="flex flex-col items-start">
                <b>{item.title}</b>
                <p>{item.description}</p>
            </CardHeader>
            <Divider/>
            <CardBody>
                {
                    ownCount + bestOtherCount > 0
                        ? (<p>I did it <b><Flash content={ownCount + ''} flash={flash} /></b> times</p>)
                        : (<span>No accomplishments yet</span>)
                }
                {bestOtherCount > 0 && (<p>The best colleague did it <b>{bestOtherCount}</b> times</p>) }
            </CardBody>
            <Divider/>
            <CardFooter>
                <div className="grow flex items-center justify-between flex-wrap gap-2">
                    <Button onClick={onClaim} className="bg-gradient-to-tl from-fuchsia-800 via-purple-800 to-cyan-700 text-white shadow-lg">I totally did it</Button>
                    {
                        hasAchievements
                            ? (<Button variant="faded" onClick={onFinish}>Finish</Button>)
                            : (<Button color="danger" onClick={onDelete}>Delete</Button>)
                    }
                </div>
            </CardFooter>
        </Card>
    );

    function getOwnAchievementsCount() {
        return item.achievements.filter(a => a.by === user).length;
    }

    function getAchievementsOfBestOtherCount() {
        const othersAchievements = item.achievements.filter(a => a.by !== user);
        const othersCounts = toPairs(groupBy(othersAchievements, a => a.by)).map(([_user, achievementsOfUser]) => achievementsOfUser.length);

        return Math.max(...othersCounts, 0);
    }
}