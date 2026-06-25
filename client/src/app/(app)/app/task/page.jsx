"use client";
import TaskMain from "@/components/tasks/tasks-main";
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
