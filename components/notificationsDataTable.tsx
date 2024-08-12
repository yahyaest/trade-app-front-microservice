import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NotificationClient from "@/services/notification";
import { Notification } from "@/models/notification";
import { DataTable } from "primereact/datatable";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";

export default function NotificationDataTable(props: any) {
  const notificationClient = new NotificationClient();
  const notifications: Notification[] = props.notifications;
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (notifications) setLoading(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const userBodyTemplate = (rowData: Notification) => {
    return (
      <React.Fragment>
        <img
          alt={rowData.sender}
          src={`${process.env.GATEWAY_BASE_URL}/${rowData.userImage}`}
          onError={(e) =>
            (e.currentTarget.src =
              "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
          }
          width={32}
          style={{ verticalAlign: "middle" }}
        />
        <span style={{ marginLeft: ".5em", verticalAlign: "middle" }}>
          {rowData.sender}
        </span>
      </React.Fragment>
    );
  };

  const userFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    const uniqueNotifications = [];
    const emailSet = new Set();

    for (const notification of notifications) {
      if (!emailSet.has(notification.userEmail)) {
        emailSet.add(notification.userEmail);
        uniqueNotifications.push(notification);
      }
    }
    return (
      <>
        <div className="mb-3 text-bold">User Picker</div>
        <MultiSelect
          value={options.value}
          options={uniqueNotifications}
          itemTemplate={userItemTemplate}
          onChange={(e) => options.filterCallback(e.value)}
          optionLabel="name"
          placeholder="Any"
          className="p-column-filter"
        />
      </>
    );
  };

  const userItemTemplate = (option: Notification) => {
    return (
      <div className="p-multiselect-representative-option">
        <img
          alt={option.sender}
          src={`${process.env.GATEWAY_BASE_URL}/${option.userImage}`}
          width={32}
          style={{ verticalAlign: "middle" }}
        />
        <span style={{ marginLeft: ".5em", verticalAlign: "middle" }}>
          {option.sender}
        </span>
      </div>
    );
  };

  const dateBodyTemplate = (rowData: Notification) => {
    return rowData.sentSince;
  };

  const actionBodyTemplate = (rowData: Notification) => {
    if (!rowData.seen) {
      return (
        <Button
          label="Mark As Read"
          severity="warning"
          size="small"
          rounded
          onClick={async () => {
            await notificationClient.updateNotification(rowData?.id as number, {
              seen: true,
            });
            router.push("/notifications");
          }}
        />
      );
    }
    return null;
  };

  const deleteNotificationBodyTemplate = (rowData: Notification) => {
    return (
      <Button
        label="Delete"
        severity="danger"
        size="small"
        rounded
        onClick={async () => {
          await notificationClient.deleteNotification(rowData?.id as number);
          router.push("/notifications");
        }}
      />
    );
  };

  return (
    <React.Fragment>
      <DataTable
        value={notifications}
        paginator
        className="p-datatable-gridlines"
        showGridlines
        rows={10}
        dataKey="id"
        loading={loading}
        filterDisplay={undefined}
        responsiveLayout="scroll"
        emptyMessage="No Notifications found."
      >
        <Column
          header="User"
          filterField="user"
          showFilterMatchModes={false}
          filterMenuStyle={{ width: "14rem" }}
          style={{ minWidth: "14rem" }}
          body={userBodyTemplate}
          filter
          filterElement={userFilterTemplate}
        />

        <Column
          field="title"
          header="Title"
          filter
          filterPlaceholder="Search by title"
          style={{ minWidth: "12rem" }}
        />

        <Column
          field="message"
          header="Message"
          filter
          filterPlaceholder="Search by message"
          style={{ minWidth: "12rem" }}
        />

        <Column
          header="Date"
          filterField="date"
          dataType="date"
          style={{ minWidth: "10rem" }}
          body={dateBodyTemplate}
          filter
        />

        <Column
          field="action"
          header="Action"
          filterMenuStyle={{ width: "14rem" }}
          style={{ minWidth: "12rem" }}
          body={actionBodyTemplate}
          filter
        />

        <Column
          field="delete"
          header="Delete"
          filterMenuStyle={{ width: "14rem" }}
          style={{ minWidth: "12rem" }}
          body={deleteNotificationBodyTemplate}
          filter
        />
      </DataTable>
    </React.Fragment>
  );
}
