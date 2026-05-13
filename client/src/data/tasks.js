// Sample data as a flat array of task objects
export const initialData = [
  {
    id: "task-1",
    projectId: "project-1",
    title: "Research competitors",
    description: "Analyze top 5 competitors in the market",
    status: "To Do",
    priority: "medium",
    createdBy: {
      id: "user-1",
      name: "John Doe",
      avatar: " "
    },
    assignedTo: {
      id: "user-2",
      name: "Alex Johnson",
      avatar: " "
    },
    dueDate: "2023-11-15",
    completedAt: null,
    createdAt: "2023-10-15T10:30:00Z",
    updatedAt: "2023-10-15T10:30:00Z"
  },
  {
    id: "task-2",
    projectId: "project-1",
    title: "Update documentation",
    description: "Update API documentation with new endpoints",
    status: "To Do",
    priority: "low",
    createdBy: {
      id: "user-1",
      name: "John Doe",
      avatar: " "
    },
    assignedTo: null,
    dueDate: "2023-11-20",
    completedAt: null,
    createdAt: "2023-10-16T09:15:00Z",
    updatedAt: "2023-10-16T09:15:00Z"
  },
  {
    id: "task-3",
    projectId: "project-1",
    title: "Design new landing page",
    description: "Create wireframes for the new landing page",
    status: "To Do",
    priority: "high",
    createdBy: {
      id: "user-3",
      name: "Emily Chen",
      avatar: " "
    },
    assignedTo: {
      id: "user-4",
      name: "Sam Taylor",
      avatar: " "
    },
    dueDate: "2023-11-10",
    completedAt: null,
    createdAt: "2023-10-17T14:20:00Z",
    updatedAt: "2023-10-17T14:20:00Z"
  },
  {
    id: "task-4",
    projectId: "project-1",
    title: "Implement authentication",
    description: "Add OAuth2 authentication to the API",
    status: "In Progress",
    priority: "high",
    createdBy: {
      id: "user-1",
      name: "John Doe",
      avatar: " "
    },
    assignedTo: {
      id: "user-5",
      name: "Jamie Smith",
      avatar: " "
    },
    dueDate: "2023-11-12",
    completedAt: null,
    createdAt: "2023-10-18T11:45:00Z",
    updatedAt: "2023-10-20T09:30:00Z"
  },
  {
    id: "task-5",
    projectId: "project-1",
    title: "Fix navigation bug",
    description: "Fix the navigation bug on mobile devices",
    status: "In Progress",
    priority: "medium",
    createdBy: {
      id: "user-3",
      name: "Emily Chen",
      avatar: " "
    },
    assignedTo: {
      id: "user-2",
      name: "Alex Johnson",
      avatar: " "
    },
    dueDate: null,
    completedAt: null,
    createdAt: "2023-10-19T16:10:00Z",
    updatedAt: "2023-10-21T10:15:00Z"
  },
  {
    id: "task-6",
    projectId: "project-1",
    title: "Code review: Payment API",
    description: "Review the new payment processing API",
    status: "Review",
    priority: "high",
    createdBy: {
      id: "user-1",
      name: "John Doe",
      avatar: " "
    },
    assignedTo: {
      id: "user-6",
      name: "Taylor Wong",
      avatar: " "
    },
    dueDate: "2023-11-08",
    completedAt: null,
    createdAt: "2023-10-22T13:25:00Z",
    updatedAt: "2023-10-25T15:40:00Z"
  },
  {
    id: "task-7",
    projectId: "project-1",
    title: "Setup CI/CD pipeline",
    description: "Configure GitHub Actions for automated testing",
    status: "Done",
    priority: "medium",
    createdBy: {
      id: "user-3",
      name: "Emily Chen",
      avatar: " "
    },
    assignedTo: {
      id: "user-5",
      name: "Jamie Smith",
      avatar: " "
    },
    dueDate: "2023-10-30",
    completedAt: "2023-10-28T11:20:00Z",
    createdAt: "2023-10-20T09:30:00Z",
    updatedAt: "2023-10-28T11:20:00Z"
  },
  {
    id: "task-8",
    projectId: "project-1",
    title: "Create component library",
    description: "Build reusable UI components",
    status: "Done",
    priority: "low",
    createdBy: {
      id: "user-1",
      name: "John Doe",
      avatar: " "
    },
    assignedTo: {
      id: "user-4",
      name: "Sam Taylor",
      avatar: " "
    },
    dueDate: "2023-10-25",
    completedAt: "2023-10-23T16:45:00Z",
    createdAt: "2023-10-15T14:20:00Z",
    updatedAt: "2023-10-23T16:45:00Z"
  },
  {
    id: "task-9",
    projectId: "project-2",
    title: "Design app wireframes",
    description: "Create wireframes for all app screens",
    status: "To Do",
    priority: "high",
    createdBy: {
      id: "user-3",
      name: "Emily Chen",
      avatar: " "
    },
    assignedTo: {
      id: "user-4",
      name: "Sam Taylor",
      avatar: " "
    },
    dueDate: "2023-11-18",
    completedAt: null,
    createdAt: "2023-10-20T09:30:00Z",
    updatedAt: "2023-10-20T09:30:00Z"
  },
  {
    id: "task-10",
    projectId: "project-2",
    title: "Implement user authentication",
    description: "Add login and registration functionality",
    status: "In Progress",
    priority: "high",
    createdBy: {
      id: "user-1",
      name: "John Doe",
      avatar: " "
    },
    assignedTo: {
      id: "user-5",
      name: "Jamie Smith",
      avatar: " "
    },
    dueDate: "2023-11-25",
    completedAt: null,
    createdAt: "2023-10-22T11:45:00Z",
    updatedAt: "2023-10-22T11:45:00Z"
  },
  {
    id: "task-11",
    projectId: "project-2",
    title: "Create app icon",
    description: "Design app icon for various platforms",
    status: "Done",
    priority: "medium",
    createdBy: {
      id: "user-3",
      name: "Emily Chen",
      avatar: " "
    },
    assignedTo: {
      id: "user-4",
      name: "Sam Taylor",
      avatar: " "
    },
    dueDate: "2023-10-30",
    completedAt: "2023-10-29T15:20:00Z",
    createdAt: "2023-10-15T14:20:00Z",
    updatedAt: "2023-10-29T15:20:00Z"
  },

  // Project 3 tasks
  {
    id: "task-12",
    projectId: "project-3",
    title: "Create social media content",
    description: "Prepare content for social media campaign",
    status: "To Do",
    priority: "medium",
    createdBy: {
      id: "user-1",
      name: "John Doe",
      avatar: " "
    },
    assignedTo: {
      id: "user-6",
      name: "Taylor Wong",
      avatar: " "
    },
    dueDate: "2023-11-20",
    completedAt: null,
    createdAt: "2023-10-25T09:30:00Z",
    updatedAt: "2023-10-25T09:30:00Z"
  },
  {
    id: "task-13",
    projectId: "project-3",
    title: "Design email templates",
    description: "Create email templates for campaign",
    status: "In Progress",
    priority: "high",
    createdBy: {
      id: "user-3",
      name: "Emily Chen",
      avatar: " "
    },
    assignedTo: {
      id: "user-4",
      name: "Sam Taylor",
      avatar: " "
    },
    dueDate: "2023-11-15",
    completedAt: null,
    createdAt: "2023-10-20T14:20:00Z",
    updatedAt: "2023-10-20T14:20:00Z"
  },

  // Project 4 tasks
  {
    id: "task-14",
    projectId: "project-4",
    title: "Evaluate cloud providers",
    description: "Compare AWS, Azure, and GCP options",
    status: "To Do",
    priority: "high",
    createdBy: {
      id: "user-1",
      name: "John Doe",
      avatar: " "
    },
    assignedTo: {
      id: "user-5",
      name: "Jamie Smith",
      avatar: " "
    },
    dueDate: "2023-11-30",
    completedAt: null,
    createdAt: "2023-10-28T11:45:00Z",
    updatedAt: "2023-10-28T11:45:00Z"
  },
  {
    id: "task-15",
    projectId: "project-4",
    title: "Update security protocols",
    description: "Review and update security measures",
    status: "In Progress",
    priority: "high",
    createdBy: {
      id: "user-1",
      name: "John Doe",
      avatar: " "
    },
    assignedTo: {
      id: "user-2",
      name: "Alex Johnson",
      avatar: " "
    },
    dueDate: "2023-12-05",
    completedAt: null,
    createdAt: "2023-10-30T09:15:00Z",
    updatedAt: "2023-10-30T09:15:00Z"
  }
];

// Define the column structure for the Kanban board
export const columnDefinitions = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "review", title: "Review" },
  { id: "done", title: "Done" }
];

// Helper function to group tasks by status for the Kanban view
export function getGroupedTasks(tasks) {
  const columns = columnDefinitions.map((column) => ({
    ...column,
    tasks: []
  }));

  // Map status names to column IDs
  const statusToColumnId = {
    "To Do": "todo",
    "In Progress": "in-progress",
    Review: "review",
    Done: "done"
  };

  // Group tasks by status
  tasks.forEach((task) => {
    const columnId = statusToColumnId[task.status];
    const column = columns.find((col) => col.id === columnId);
    if (column) {
      column.tasks.push(task);
    }
  });

  return columns;
}

export const projects = [
  {
    id: "project-1",
    name: "Website Redesign",
    description: "Redesign the company website with new branding"
  },
  {
    id: "project-2",
    name: "Mobile App Development",
    description: "Develop a new mobile app for customers"
  },
  {
    id: "project-3",
    name: "Marketing Campaign",
    description: "Q4 marketing campaign for product launch"
  },
  {
    id: "project-4",
    name: "Infrastructure Upgrade",
    description: "Upgrade server infrastructure and cloud services"
  }
];
