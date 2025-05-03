"use client";

import React from "react";
import { Avatar, Button, ScrollShadow, Spacer, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@heroui/react";

import { AcmeIcon } from "./acme";
import { sectionItemsWithTeams } from "./sidebar-items";

import Sidebar from "./sidebar";

import { SignedIn, UserButton } from "@clerk/nextjs";

import { usePathname } from "next/navigation"; // Importa el hook usePathname

export default function Component({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const isCompact = isCollapsed || isMobile;

  const onToggle = React.useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const currentPath = usePathname();

  return (
    <div className="flex h-full min-h-[48rem] w-full">
      <div
        className={cn(
          "relative flex h-full w-72 flex-col !border-r-small border-divider p-6 transition-width",
          {
            "w-16 items-center px-2 py-6": isCompact,
          }
        )}>
        <div
          className={cn(
            "flex items-center gap-3 px-3",

            {
              "justify-center gap-0": isCompact,
            }
          )}>
          <span
            className={cn("text-small font-bold uppercase opacity-100", {
              "w-0 opacity-0": isCompact,
            })}>
            WA SOLUTIONS
          </span>
        </div>
        <Spacer y={8} />
        <div className="flex items-center gap-3 px-3">
          <div
            className={cn("flex max-w-full flex-col", { hidden: isCompact })}>
            <SignedIn>
              <UserButton showName={true} />
            </SignedIn>
          </div>
        </div>
        <ScrollShadow className="-mr-6 h-full max-h-full py-6 pr-6">
          <Sidebar
            defaultSelectedKey="dashboard"
            selectedKeys={[currentPath]} // Usa la clave extraída de la ruta
            isCompact={isCompact}
            items={sectionItemsWithTeams}
          />
        </ScrollShadow>
        <Spacer y={2} />
        <div
          className={cn("mt-auto flex flex-col", {
            "items-center": isCompact,
          })}></div>
      </div>
      <div className="w-[2] flex-1 flex-col p-4">
        <header className="flex items-center gap-3 rounded-medium border-small border-divider p-4">
          <Button isIconOnly size="sm" variant="light" onPress={onToggle}>
            <Icon
              className="text-default-500"
              height={24}
              icon="solar:sidebar-minimalistic-outline"
              width={24}
            />
          </Button>
        </header>
        <main className="mt-4 h-[90%] w-full overflow-visible">
          <ScrollShadow
            size={0}
            hideScrollBar
            className=" flex h-full w-full flex-col gap-4 rounded-medium border-small border-divider max-h-full">
            {children}
          </ScrollShadow>
        </main>
      </div>
    </div>
  );
}
