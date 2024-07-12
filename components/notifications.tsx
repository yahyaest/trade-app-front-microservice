import React, { useState, useEffect, useContext } from "react";
import UserContext from "@/store/user-context";
import { useRouter } from "next/router";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Notification } from "@/models/notification";
import { getUserNotifications } from "@/services/notification";
import { formatRelativeTime } from "@/utils/utils";

export default function NotificationComponent(props: any) {
  const userCtx = useContext(UserContext);
  const router = useRouter();
  const [notifications, setNofications] = useState<Notification[]>([]);
  const [displayNotifications, setDisplayNotifications] =
    useState<boolean>(false);

  const getNotifications = async () => {
    let userNotifications: Notification[] = userCtx?.user
      ? await getUserNotifications(userCtx?.user.email)
      : null;
    if (userNotifications) {
      userNotifications = userNotifications.sort(
        (a: Notification, b: Notification) =>
          new Date(b.createdAt) - new Date(a.createdAt)
      );

      // Populate Notifications with sentSince attribute
      userNotifications.map((notification) => {
        notification.sentSince = formatRelativeTime(
          notification?.createdAt ?? ""
        );
      });
    }
    console.log(userNotifications);
    return userNotifications;
  };

  useEffect(() => {
    async function fetchData() {
      if (userCtx?.user) {
        const userNotifications = await getNotifications();
        if (userNotifications) {
          setNofications(userNotifications);
        }
      }
    }
    fetchData();
  }, [userCtx]);

  return (
    <div
      className="px-0 sm:px-3"
      style={{ marginRight: "-15px", position: "relative" }}
    >
      <Button
        icon="pi pi-bell"
        rounded
        severity="warning"
        aria-label="Notification"
        className="sm:mx-1"
        onClick={() => setDisplayNotifications(!displayNotifications)}
      />
      <Badge
        value={notifications.length}
        severity="success"
        className=""
        style={{ position: "relative", right: "20px", top: "5px" }}
      ></Badge>
      {displayNotifications && (
        <div
          className="dropdown-menu w-28rem bg-gray-200 shadow-4"
          style={{
            zIndex: 1000,
            position: "absolute",
            right: "-5rem",
            top: "105%",
            borderRadius: "0.5rem",
          }}
        >
          <ul className="dropdown-menu-list">
            {notifications.map((notification: Notification, index: number) => (
              <li
                key={notification.id}
                className="flex flex-row justify-center items-center dropdown-menu-item hover:bg-gray-300 p-1 gap-1"
                style={{
                  borderRadius: index === 0 ? "0.5rem 0.5rem 0 0" : "0 0 0 0",
                }}
              >
                <div className="dropdown-menu-icon align-self-center  mt-1">
                  <Avatar
                    image={`${process.env.GATEWAY_BASE_URL}/${notification?.userImage}`}
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
              </li>
            ))}

            <li
              className="text-center hover:bg-gray-300 p-1 my-1"
              style={{ borderRadius: "0 0 0.5rem 0.5rem" }}
            >
              See All Notifications
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
