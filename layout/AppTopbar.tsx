/* eslint-disable @next/next/no-img-element */

import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
} from "react";
import Link from "next/link";
import { classNames } from "primereact/utils";
import { Menubar } from "primereact/menubar";
import { MenuItem } from "primereact/menuitem";
import { Avatar } from "primereact/avatar";
import { AppTopbarRef } from "../types/types";
import { LayoutContext } from "./context/layoutcontext";
import UserContext from "../store/user-context";

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
  const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } =
    useContext(LayoutContext);
  const menubuttonRef = useRef(null);
  const topbarmenuRef = useRef(null);
  const topbarmenubuttonRef = useRef(null);
  const userCtx = useContext(UserContext);

  const items: MenuItem[] = [
    userCtx.avatar
      ? {
          template: (item, options) => {
            return (
              <button
                onClick={(e) => options.onClick(e)}
                className={classNames(
                  options.className,
                  "w-full p-link flex align-items-center p-1"
                )}
              >
                <Avatar
                  image={userCtx.avatar}
                  className="mr-2"
                  shape="circle"
                />
                <div className="flex flex-column align">
                  <span className="font-bold">
                    {userCtx.user?.username
                      ? userCtx.user.username
                      : userCtx.user?.email}
                  </span>
                </div>
              </button>
            );
          },
          items: [
            {
              label: "Logout",
              icon: "pi pi-fw pi-sign-out",
              command: () => userCtx.logout(),
            },
          ],
        }
      : {
          label: userCtx.user?.username
            ? userCtx.user.username
            : userCtx.user?.email,
          icon: "pi pi-fw pi-user",
          items: [
            {
              label: "Logout",
              icon: "pi pi-fw pi-sign-out",
              command: () => userCtx.logout(),
            },
          ],
        },
  ];

  useImperativeHandle(ref, () => ({
    menubutton: menubuttonRef.current,
    topbarmenu: topbarmenuRef.current,
    topbarmenubutton: topbarmenubuttonRef.current,
  }));

  return (
    <div className="layout-topbar">
      <Link href="/" className="layout-topbar-logo">
        <img
          src={`/layout/images/logo-${
            layoutConfig.colorScheme !== "light" ? "white" : "dark"
          }.svg`}
          width="47.22px"
          height={"35px"}
          alt="logo"
        />
        <span>All-in-One Trader Sim</span>
      </Link>

      <button
        ref={menubuttonRef}
        type="button"
        className="p-link layout-menu-button layout-topbar-button"
        onClick={onMenuToggle}
      >
        <i className="pi pi-bars" />
      </button>

      <button
        ref={topbarmenubuttonRef}
        type="button"
        className="p-link layout-topbar-menu-button layout-topbar-button"
        onClick={showProfileSidebar}
      >
        <i className="pi pi-ellipsis-v" />
      </button>

      {userCtx?.user && (
        <div
          ref={topbarmenuRef}
          className={classNames(
            "layout-topbar-menu",
            {
              "layout-topbar-menu-mobile-active":
                layoutState.profileSidebarVisible,
            },
            "flex align-items-center"
          )}
        >
          <button type="button" className="p-link layout-topbar-button mx-2">
            <i className="pi pi-bell"></i>
            <span>Notification</span>
          </button>
          <Menubar model={items} />
          <Link href="/documentation">
            <button type="button" className="p-link layout-topbar-button">
              <i className="pi pi-cog"></i>
              <span>Settings</span>
            </button>
          </Link>
        </div>
      )}
      {!userCtx?.user && (
        <div
          ref={topbarmenuRef}
          className={classNames("layout-topbar-menu", {
            "layout-topbar-menu-mobile-active":
              layoutState.profileSidebarVisible,
          })}
        >
          <Link href="/auth/login">
            <button type="button" className="p-link layout-topbar-button mx-7">
              <i className="pi pi-sign-in mx-2"></i>
              Login
            </button>
          </Link>
        </div>
      )}
    </div>
  );
});

AppTopbar.displayName = "AppTopbar";

export default AppTopbar;
