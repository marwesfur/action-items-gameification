"use client"

import {usePathname} from "next/navigation";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/navbar";
import Link from "next/link";
import {useState} from "react";
import {Switch} from "@nextui-org/switch";
import {RetroModeProvider} from "@/lib/contexts/retro-mode.context";

export default function Frame({ user, children }: { user: string, children: React.ReactNode }) {
    const [isRetroModeActive, setRetroModeActive] = useState(false);
    const pathName = usePathname();
    const isInListView = pathName === '/';
    const isInCreateView = pathName === '/new';

    const retroModeContent = (
        <NavbarContent justify="start">
            <NavbarItem isActive={isInListView}>
                <Link color="foreground" href="/">
                    Active Items
                </Link>
            </NavbarItem>
            <NavbarItem isActive={isInCreateView}>
                <Link href="/new">
                    Create new Item
                </Link>
            </NavbarItem>
        </NavbarContent>
    );
    const emptyContent = (<NavbarContent />);

    return (
        <>
            <Navbar isBordered>
                <NavbarBrand>
                    <p className="font-bold text-inherit">SM Champions</p>
                </NavbarBrand>
                <NavbarContent justify="start">
                    <Switch isSelected={isRetroModeActive} onValueChange={setRetroModeActive} isDisabled={!isInListView}>
                        Retro-Mode
                    </Switch>
                </NavbarContent>
                {
                    isRetroModeActive ? retroModeContent : emptyContent
                }
                <NavbarContent justify="end">
                    <NavbarItem>
                        Welcome, {user}!
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
            <RetroModeProvider value={isRetroModeActive}>
                {children}
            </RetroModeProvider>
        </>
    );
}