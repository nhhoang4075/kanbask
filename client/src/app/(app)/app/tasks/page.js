"use client";
import TaskMain from "@/components/Tasks/tasks-main";
import { TaskProvider } from "@/hooks/use-tasks";
import React, { useEffect, useState } from "react";

const page = () => {
  return (
    <TaskProvider>
      <TaskMain />
    </TaskProvider>
  );
};

export default page;
