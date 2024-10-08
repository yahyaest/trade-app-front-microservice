import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import UserContext from "@/store/user-context";
import socketClient from "@/tools/websocket";
import { formatRelativeTime } from "@/utils/utils";
import NotificationClient from "@/services/notification";
import { Notification } from "@/models/notification";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import styles from "./notifications.module.css";
import ClickOutside from "./clickOutside";

export default function NotificationComponent(props: any) {
  const notificationClient = new NotificationClient();
  const userCtx = useContext(UserContext);
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [notifications, setNofications] = useState<Notification[]>([]);
  const [notificationCount, setNotificatiosCount] = useState<number>(
    notifications ? notifications.length : 0
  );
  const [
    isIncommingWebSocketNotification,
    setIsIncommingWebSocketNotification,
  ] = useState<boolean>(false);
  const [displayNotifications, setDisplayNotifications] =
    useState<boolean>(false);

  const [hoveredNotification, setHoveredNotification] =
    useState<Notification | null>();
  const [hovering, setHovering] = useState<boolean>(false);
  const [timer, setTimer] = useState<any>(null);

  const messageHandler = (event: MessageEvent) => {
    try {
      const notificationFromWebsocket: Notification = JSON.parse(event.data);
      const user = Cookies.get("user") as string;
      const userEmail = JSON.parse(user).email;
      if (notificationFromWebsocket.userEmail === userEmail) {
        notificationFromWebsocket.isSourceWebsocket = true;
        notificationFromWebsocket.sentSince = "Just Now";
        let userNotifications = [notificationFromWebsocket, ...notifications];
        setNofications(userNotifications);
        setNotificatiosCount(notificationCount + 1);
        setIsIncommingWebSocketNotification(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const { socket, send } = socketClient(messageHandler);

  const getNotifications = async () => {
    let userNotifications: Notification[] = userCtx?.user
      ? await notificationClient.getUserNotifications(userCtx?.user.email)
      : null;
    if (userNotifications) {
      userNotifications = userNotifications.sort(
        (a: Notification, b: Notification) =>
          (new Date(b.createdAt) as any) - (new Date(a.createdAt) as any)
      );

      // Populate Notifications with sentSince attribute
      userNotifications.map((notification) => {
        notification.sentSince = formatRelativeTime(
          notification?.createdAt ?? ""
        );
      });
    }
    return userNotifications;
  };

  async function fetchData() {
    if (userCtx?.user) {
      const userNotifications = await getNotifications();
      if (userNotifications) {
        setNofications(userNotifications);
      }
    }
  }

  useEffect(() => {
    fetchData();
  }, [userCtx]);

  useEffect(() => {
    if (hovering) {
      const id = setTimeout(async () => {
        await notificationClient.updateNotification(
          hoveredNotification?.id as number,
          {
            seen: true,
          }
        );
      }, 3000);
      setTimer(id);
    } else {
      if (timer) {
        clearTimeout(timer);
      }
    }

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, [hovering]);

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <div
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
      >
        <div
          className="px-0 sm:px-3"
          style={{ marginRight: "-15px", position: "relative" }}
        >
          <Button
            icon="pi pi-bell"
            rounded
            severity="warning"
            aria-label="Notification"
            className={`sm:mx-1 `}
            onClick={() => {
              setDisplayNotifications(!displayNotifications);
              if (isIncommingWebSocketNotification) {
                setIsIncommingWebSocketNotification(false);
              }
              if (!displayNotifications) {
                //  Refetch notification
                fetchData();
              }
            }}
          />
          <Badge
            value={notifications.length < 100 ? notifications.length : "99+"}
            severity="success"
            className={`${
              isIncommingWebSocketNotification ? styles.ping : null
            }`}
            style={{ position: "relative", right: "20px", top: "5px" }}
          ></Badge>
          {dropdownOpen && (
            <div
              className="dropdown-menu w-24rem sm:w-28rem bg-gray-200 shadow-4"
              style={{
                zIndex: 1000,
                position: "absolute",
                right: "-5rem",
                top: "105%",
                borderRadius: "0.5rem",
              }}
            >
              <ul className="dropdown-menu-list">
                {notifications
                  .filter((notification) => !notification.seen)
                  .slice(0, 5)
                  .map((notification: Notification, index: number) => (
                    <li
                      key={notification.id}
                      className="flex flex-row justify-center items-center dropdown-menu-item hover:bg-gray-300 p-1 gap-1"
                      style={{
                        borderRadius:
                          index === 0 ? "0.5rem 0.5rem 0 0" : "0 0 0 0",
                      }}
                      onMouseOver={() => {
                        setHovering(true);
                        setHoveredNotification(notification);
                      }}
                      onMouseOut={() => {
                        setHovering(false);
                        setHoveredNotification(null);
                      }}
                    >
                      <div className="dropdown-menu-icon align-self-center  mt-1">
                        <Avatar
                          image={`${process.env.BASE_URL}/${notification?.userImage}`}
                          shape="circle"
                          size="normal"
                          className="mx-1"
                        />
                      </div>
                      <div className="dropdown-menu-details w-20rem">
                        <div className="dropdown-menu-title text-center text-sm">
                          {notification.title}
                        </div>
                        <div className="dropdown-menu-subtitle text-center text-xs my-1">
                          {notification.message}
                        </div>
                      </div>
                      <div
                        className="text-xs text-center align-self-center"
                        style={{ position: "relative", right: 0 }}
                      >
                        {notification.sentSince}
                      </div>
                      {!notification.seen && (
                        <div
                          className="align-self-center mx-1 bg-blue-500"
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "100%",
                          }}
                        ></div>
                      )}
                    </li>
                  ))}

                <li
                  className="text-center cursor-pointer hover:bg-gray-300 p-1 my-1"
                  style={{ borderRadius: "0 0 0.5rem 0.5rem" }}
                  onClick={() => {
                    router.push("/notifications");
                    setDisplayNotifications(false);
                  }}
                >
                  See All Notifications
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </ClickOutside>
  );
}
