import React, { useContext } from "react";
import { Menubar } from "primereact/menubar";
import { Badge } from "primereact/badge";
import { Avatar } from "primereact/avatar";
import UserContext from "../store/user-context";
import Image from "next/image";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import NotificationComponent from "@/components/notifications";

export default function AppNavbar() {
  const userCtx = useContext(UserContext);
  const router = useRouter();

  const itemRenderer = (item: any) => (
    <a className="flex align-items-center p-menuitem-link" href={item.link}>
      <span className={item.icon} />
      <span className="mx-2">{item.label}</span>
      {item.badge && <Badge className="ml-auto" value={item.badge} />}
      {item.shortcut && (
        <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">
          {item.shortcut}
        </span>
      )}
    </a>
  );
  const items = [
    {
      label: "Home",
      link: "/",
      icon: "pi pi-home",
      template: itemRenderer,
    },
    {
      label: "Wallets",
      link: "/wallets",
      icon: "pi pi-wallet",
      template: itemRenderer,
    },
    {
      label: "Trade",
      icon: "pi pi-sort-alt",
      items: [
        {
          label: "Crypto",
          link: "/coins",
          template: itemRenderer,
        },
        {
          label: "Stocks",
          link: "/stocks",
          template: itemRenderer,
        },
        {
          label: "Forex",
          link: "/forex",
          template: itemRenderer,
        },
      ],
    },
  ];

  const start = (
    <Image
      src="/images/nav_logo.jpg"
      alt="nav_logo"
      width={50}
      height={50}
      className="mx-2"
    />
  );
  const end = (
    <div className="flex align-items-center justify-content-end gap-2">
      {userCtx?.user && (
        <>
          <NotificationComponent/>
          <Button
            icon="pi pi-sign-out"
            rounded
            severity="danger"
            aria-label="Cancel"
            className="sm:mx-1"
            onClick={() => {
              userCtx.logout();
              router.push("/");
            }}
          />
          <Avatar
            image={
              userCtx.avatar ? userCtx.avatar : "/images/default_avatar.webp"
            }
            shape="circle"
            className="mx-1 w-3rem h-3rem sm:mx-5"
            onClick={() => router.push("/wallets")}
          />
        </>
      )}
      {!userCtx?.user && (
        <Button
          icon="pi pi-sign-in"
          rounded
          severity="info"
          aria-label="Cancel"
          className="mx-1"
          onClick={() => {
            router.push("/auth/login");
          }}
        />
      )}
    </div>
  );

  return (
    <div className="sticky top-0 h-rem5" style={{ zIndex: 999 }}>
      <Menubar model={items} start={start} end={end} style={{ zIndex: 999 }} />
    </div>
  );
}
