"use client";

import { useEffect, useState } from "react";

import { format, isToday, isYesterday, isSameYear } from "date-fns";

import NotificationList from "@/components/notification/notification-list";
import NotificationItemSkeleton from "@/components/notification/notification-item-skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotification } from "@/hooks/use-notification";

function groupNotificationsByDate(notifications) {
  const groups = {};

  notifications.forEach((notification) => {
    const date = new Date(notification.created_at);
    let dateKey;

    if (isToday(date)) {
      dateKey = "Today";
    } else if (isYesterday(date)) {
      dateKey = "Yesterday";
    } else if (isSameYear(date, new Date())) {
      dateKey = format(date, "MMM d");
    } else {
      dateKey = format(date, "MMM d, yyyy");
    }

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(notification);
  });

  return Object.entries(groups).map(([date, items]) => ({
    date,
    notifications: items
  }));
}

export default function NotificationContent() {
  const { notifications, unreadCount, filter, loadingInitial, hasMore, loadMore } =
    useNotification();

  const filteredNotifications = notifications.filter(
    (notification) => notification.reference_type === filter || filter === "all"
  );

  const unreadNotifications = filteredNotifications.filter((notification) => !notification.is_read);

  if (loadingInitial) {
    return (
      <div className="flex flex-col h-[50vh]">
        {Array.from({ length: 6 }).map((_, index) => (
          <NotificationItemSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <Tabs defaultValue="all">
      <TabsList className="justify-start w-full px-4 gap-x-6 rounded-none border-b bg-white">
        <TabsTrigger
          value="all"
          className="flex-none p-0 text-sm text-gray-500 rounded-none shadow-none data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-none"
        >
          All
        </TabsTrigger>
        <TabsTrigger
          value="unread"
          className="flex-none p-0 text-sm text-gray-500 rounded-none shadow-none data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-none"
        >
          {unreadCount > 0 ? `Unread (${unreadCount})` : "Unread"}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="m-0">
        <ScrollArea className="flex flex-col m-0 py-2 h-[50vh] bg-ghost-white rounded-md">
          {groupNotificationsByDate(filteredNotifications).map((group) => (
            <NotificationList key={group.date} group={group} />
          ))}
          {hasMore ? (
            <div className="flex justify-center px-4">
              <Button
                variant="outline"
                size="sm"
                onClick={loadMore}
                className="w-full text-xs rounded-sm"
              >
                Load more
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4">
              <div className="flex-1 h-px bg-border" />
              <p className="text-xs text-muted-foreground">No more notifications</p>
              <div className="flex-1 h-px bg-border" />
            </div>
          )}
        </ScrollArea>
      </TabsContent>
      <TabsContent value="unread" className="m-0">
        <ScrollArea className="flex flex-col m-0 py-2 h-[50vh] bg-ghost-white rounded-md">
          {groupNotificationsByDate(unreadNotifications).map((group) => (
            <NotificationList key={group.date} group={group} />
          ))}
          {hasMore ? (
            <div className="flex justify-center px-4">
              <Button
                variant="outline"
                size="sm"
                onClick={loadMore}
                className="w-full text-xs rounded-sm"
              >
                Load more
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4">
              <div className="flex-1 h-px bg-border" />
              <p className="text-xs text-muted-foreground">No more notifications</p>
              <div className="flex-1 h-px bg-border" />
            </div>
          )}
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}
