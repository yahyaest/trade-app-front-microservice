import React from "react";
import { GetServerSideProps } from "next";
import { CustomLogger } from "@/utils/logger";
import { formatRelativeTime } from "@/utils/utils";
import NotificationClient from "@/services/notification";
import NotificationDataTable from "@/components/notificationsDataTable";
import { Notification } from "@/models/notification";
import { User } from "@/models/user";
import { BreadCrumb } from "primereact/breadcrumb";

const NotificationPage = (props: any) => {
  const notifications = props.notifications;

  const items = [{ label: `notifications` }];
  const home = { icon: "pi pi-home", label: "icons", url: "/" };

  return (
    <div className="surface-ground align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden text-center">
      <BreadCrumb model={items as any} home={home} className="my-3" />
      <h1 className="font-bold text-3xl sm:text-6xl text-yellow-500">
        Notifications
      </h1>

      <div className="card mx-5">
        <NotificationDataTable notifications={notifications} />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{}> = async (
  context: any
) => {
  const logger = new CustomLogger();
  try {
    const notificationClient = new NotificationClient("server");
    const token = context.req.cookies["token"];
    const user: User = JSON.parse(context.req.cookies["user"]);

    if (!token || !user) {
      logger.warn("No token or user was provided. Redirecting to login page");
      return {
        redirect: {
          destination: "/auth/login",
          permanent: false,
        },
      };
    }

    // Get user notifications

    const getNotifications = async () => {
      let userNotifications: Notification[] =
        await notificationClient.getUserNotifications(user.email, token);
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

    logger.info(`Fetching Notifications for user: ${user.email}`);
    const notifications = await getNotifications();
    logger.info(
      `Found ${notifications.length} Notifications for user: ${user.email}`
    );

    return {
      props: { notifications },
    };
  } catch (error: any) {
    logger.error(`Error fetching Notifications : ${error.message}`);
    return {
      props: { error: error.message },
    };
  }
};

export default NotificationPage;
