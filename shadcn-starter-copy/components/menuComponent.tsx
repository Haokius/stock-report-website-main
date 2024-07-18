import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
  } from "@/components/ui/menubar";
import Link from "next/link";
  
  export function MenubarDemo() {
    return (
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger className="outline">Actions</MenubarTrigger>
          <MenubarContent>
            <Link href="/" legacyBehavior passHref>
              <MenubarItem>Home</MenubarItem>
            </Link>
            <Link href="/report" legacyBehavior passHref>
              <MenubarItem>New Report</MenubarItem>
            </Link>
            <MenubarSeparator />
            <Link href="/history" legacyBehavior passHref>
              <MenubarItem>Report History</MenubarItem>
            </Link>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    )
  }
  