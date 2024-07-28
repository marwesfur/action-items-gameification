"use client"

import {usePathname} from "next/navigation";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/navbar";
import Link from "next/link";

export default function Header({user}: { user: string }) {
    const pathName = usePathname();

    return (
        <Navbar isBordered>
            <NavbarBrand>
                <p className="font-bold text-inherit">SM Champions</p>
            </NavbarBrand>
            <NavbarContent justify="start">
                <NavbarItem isActive={pathName === '/'}>
                    <Link color="foreground" href="/">
                        Active Items
                    </Link>
                </NavbarItem>
                <NavbarItem isActive={pathName === '/new'}>
                    <Link href="/new">
                        Create new Item
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    Welcome, {user}!
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}