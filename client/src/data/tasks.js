// Sample teams data
export const teams = [
  {
    id: "team-1",
    name: "Engineering",
    description: "Software development team",
    color: "#3b82f6" // blue
  },
  {
    id: "team-2",
    name: "Design",
    description: "UI/UX design team",
    color: "#ec4899" // pink
  },
  {
    id: "team-3",
    name: "Marketing",
    description: "Marketing and communications team",
    color: "#f59e0b" // amber
  },
  {
    id: "team-4",
    name: "Operations",
    description: "Infrastructure and operations team",
    color: "#10b981" // green
  }
];

// Sample projects data with team associations
export const projects = [
  {
    id: "1",
    teamId: "team-1",
    name: "Website Redesign",
    description: "Redesign the company website with new branding",
    color: "#3b82f6" // blue
  },
  {
    id: "2",
    teamId: "team-1",
    name: "Mobile App Development",
    description: "Develop a new mobile app for customers",
    color: "#10b981" // green
  },
  {
    id: "3",
    teamId: "team-3",
    name: "Marketing Campaign",
    description: "Q4 marketing campaign for product launch",
    color: "#f59e0b" // amber
  },
  {
    id: "4",
    teamId: "team-4",
    name: "Infrastructure Upgrade",
    description: "Upgrade server infrastructure and cloud services",
    color: "#8b5cf6" // violet
  },
  {
    id: "5",
    teamId: "team-2",
    name: "Design System",
    description: "Create a comprehensive design system",
    color: "#ec4899" // pink
  },
  {
    id: "6",
    teamId: "team-2",
    name: "Product Illustrations",
    description: "Create illustrations for product pages",
    color: "#6366f1" // indigo
  },
  {
    id: "7",
    teamId: "team-3",
    name: "Social Media Strategy",
    description: "Develop social media strategy for Q1",
    color: "#f97316" // orange
  },
  {
    id: "8",
    teamId: "team-4",
    name: "Security Audit",
    description: "Conduct security audit of all systems",
    color: "#ef4444" // red
  }
];

// Sample users data
export const users = [
  {
    id: "user-1",
    name: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    id: "user-2",
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    id: "user-3",
    name: "Emily Chen",
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    id: "user-4",
    name: "Sam Taylor",
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    id: "user-5",
    name: "Jamie Smith",
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    id: "user-6",
    name: "Taylor Wong",
    avatar: "/placeholder.svg?height=40&width=40"
  }
];

// Sample comments data
export const sampleComments = [
  {
    id: "comment-1",
    taskId: "task-1",
    text: "I've started researching our top competitors. Will share initial findings tomorrow.",
    author: {
      id: "user-2",
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    createdAt: "2023-10-16T14:30:00Z"
  },
  {
    id: "comment-2",
    taskId: "task-1",
    text: "Great! I've also found some interesting insights about their marketing strategies.",
    author: {
      id: "user-3",
      name: "Emily Chen",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    createdAt: "2023-10-16T15:45:00Z"
  },
  {
    id: "comment-3",
    taskId: "task-4",
    text: "I'm having some issues with the OAuth implementation. Could use some help.",
    author: {
      id: "user-5",
      name: "Jamie Smith",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    createdAt: "2023-10-21T09:15:00Z"
  },
  {
    id: "comment-4",
    taskId: "task-4",
    text: "What specific issues are you encountering? I can help troubleshoot.",
    author: {
      id: "user-1",
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    createdAt: "2023-10-21T10:30:00Z"
  },
  {
    id: "comment-5",
    taskId: "task-6",
    text: "I've completed the initial review. There are a few security concerns we need to address.",
    author: {
      id: "user-6",
      name: "Taylor Wong",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    createdAt: "2023-10-23T16:20:00Z"
  }
];

// Sample data as a flat array of task objects
export const initialData = [
  // Project 1 tasks
  {
    id: "task-1",
    projectId: "1",
    title: "Research competitors",
    description: "Analyze top 5 competitors in the market",
    status: "To Do",
    priority: "medium",
    createdBy: {
      id: "user-1",
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    assignedTo: [
      {
        id: "user-2",
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40"
      },
      {
        id: "user-3",
        name: "Emily Chen",
        avatar: "/placeholder.svg?height=40&width=40"
      }
    ],
    dueDate: "2023-11-15",
    completedAt: null,
    createdAt: "2023-10-15T10:30:00Z",
    updatedAt: "2023-10-15T10:30:00Z",
    comments: [
      {
        id: "comment-1",
        text: "I've started researching our top competitors. Will share initial findings tomorrow.",
        author: {
          id: "user-2",
          name: "Alex Johnson",
          avatar: "/placeholder.svg?height=40&width=40"
        },
        createdAt: "2023-10-16T14:30:00Z"
      },
      {
        id: "comment-2",
        text: "Great! I've also found some interesting insights about their marketing strategies.",
        author: {
          id: "user-3",
          name: "Emily Chen",
          avatar: "/placeholder.svg?height=40&width=40"
        },
        createdAt: "2023-10-16T15:45:00Z"
      }
    ],
    attachments: [
      {
        id: "file-1",
        name: "competitor-analysis.pdf",
        type: "pdf",
        size: 2457600, // 2.4 MB
        url: "/placeholder.svg?height=400&width=300",
        uploadedAt: "2023-10-16T11:30:00Z",
        uploadedBy: {
          id: "user-2",
          name: "Alex Johnson",
          avatar: "/placeholder.svg?height=40&width=40"
        }
      },
      {
        id: "file-2",
        name: "market-share-graph.png",
        type: "image",
        size: 1048576, // 1 MB
        url: "/placeholder.svg?height=400&width=300",
        uploadedAt: "2023-10-17T09:15:00Z",
        uploadedBy: {
          id: "user-3",
          name: "Emily Chen",
          avatar: "/placeholder.svg?height=40&width=40"
        }
      }
    ]
  },
  {
    id: "task-2",
    projectId: "1",
    title: "Update documentation",
    description: "Update API documentation with new endpoints",
    status: "To Do",
    priority: "low",
    createdBy: {
      id: "user-1",
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    assignedTo: [],
    dueDate: "2023-11-20",
    completedAt: null,
    createdAt: "2023-10-16T09:15:00Z",
    updatedAt: "2023-10-16T09:15:00Z",
    comments: []
  },
  {
    id: "task-3",
    projectId: "1",
    title: "Design new landing page",
    description: "Create wireframes for the new landing page",
    status: "To Do",
    priority: "high",
    createdBy: {
      id: "user-3",
      name: "Emily Chen",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    assignedTo: [
      {
        id: "user-4",
        name: "Sam Taylor",
        avatar: "/placeholder.svg?height=40&width=40"
      }
    ],
    dueDate: "2023-11-10",
    completedAt: null,
    createdAt: "2023-10-17T14:20:00Z",
    updatedAt: "2023-10-17T14:20:00Z",
    comments: []
  },
  {
    id: "task-4",
    projectId: "1",
    title: "Implement authentication",
    description: "Add OAuth2 authentication to the API",
    status: "In Progress",
    priority: "high",
    createdBy: {
      id: "user-1",
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    assignedTo: [
      {
        id: "user-5",
        name: "Jamie Smith",
        avatar: "/placeholder.svg?height=40&width=40"
      }
    ],
    dueDate: "2023-11-12",
    completedAt: null,
    createdAt: "2023-10-18T11:45:00Z",
    updatedAt: "2023-10-20T09:30:00Z",
    comments: [
      {
        id: "comment-3",
        text: "I'm having some issues with the OAuth implementation. Could use some help.",
        author: {
          id: "user-5",
          name: "Jamie Smith",
          avatar: "/placeholder.svg?height=40&width=40"
        },
        createdAt: "2023-10-21T09:15:00Z"
      },
      {
        id: "comment-4",
        text: "What specific issues are you encountering? I can help troubleshoot.",
        author: {
          id: "user-1",
          name: "John Doe",
          avatar: "/placeholder.svg?height=40&width=40"
        },
        createdAt: "2023-10-21T10:30:00Z"
      }
    ]
  },
  {
    id: "task-5",
    projectId: "1",
    title: "Fix navigation bug",
    description: "Fix the navigation bug on mobile devices",
    status: "In Progress",
    priority: "medium",
    createdBy: {
      id: "user-3",
      name: "Emily Chen",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    assignedTo: [
      {
        id: "user-2",
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40"
      },
      {
        id: "user-5",
        name: "Jamie Smith",
        avatar: "/placeholder.svg?height=40&width=40"
      }
    ],
    dueDate: null,
    completedAt: null,
    createdAt: "2023-10-19T16:10:00Z",
    updatedAt: "2023-10-21T10:15:00Z",
    comments: []
  },
  {
    id: "task-6",
    projectId: "1",
    title: "Code review: Payment API",
    description: "Review the new payment processing API",
    status: "Review",
    priority: "high",
    createdBy: {
      id: "user-1",
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    assignedTo: [
      {
        id: "user-6",
        name: "Taylor Wong",
        avatar: "/placeholder.svg?height=40&width=40"
      }
    ],
    dueDate: "2023-11-08",
    completedAt: null,
    createdAt: "2023-10-22T13:25:00Z",
    updatedAt: "2023-10-25T15:40:00Z",
    comments: [
      {
        id: "comment-5",
        text: "I've completed the initial review. There are a few security concerns we need to address.",
        author: {
          id: "user-6",
          name: "Taylor Wong",
          avatar: "/placeholder.svg?height=40&width=40"
        },
        createdAt: "2023-10-23T16:20:00Z"
      }
    ]
  },
  {
    id: "task-7",
    projectId: "1",
    title: "Setup CI/CD pipeline",
    description: "Configure GitHub Actions for automated testing",
    status: "Done",
    priority: "medium",
    createdBy: {
      id: "user-3",
      name: "Emily Chen",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    assignedTo: [
      {
        id: "user-5",
        name: "Jamie Smith",
        avatar: "/placeholder.svg?height=40&width=40"
      }
    ],
    dueDate: "2023-10-30",
    completedAt: "2023-10-28T11:20:00Z",
    createdAt: "2023-10-20T09:30:00Z",
    updatedAt: "2023-10-28T11:20:00Z",
    comments: []
  },
  {
    id: "task-8",
    projectId: "1",
    title: "Create component library",
    description: "Build reusable UI components",
    status: "Done",
    priority: "low",
    createdBy: {
      id: "user-1",
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    assignedTo: [
      {
        id: "user-4",
        name: "Sam Taylor",
        avatar: "/placeholder.svg?height=40&width=40"
      }
    ],
    dueDate: "2023-10-25",
    completedAt: "2023-10-23T16:45:00Z",
    createdAt: "2023-10-15T14:20:00Z",
    updatedAt: "2023-10-23T16:45:00Z",
    comments: []
  },

  // Project 2 tasks
  {
    id: "task-9",
    projectId: "2",
    title: "Design app wireframes",
    description: "Create wireframes for all app screens",
    status: "To Do",
    priority: "high",
    createdBy: {
      id: "user-3",
      name: "Emily Chen",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    assignedTo: [
      {
        id: "user-4",
        name: "Sam Taylor",
        avatar: "/placeholder.svg?height=40&width=40"
      }
    ],
    dueDate: "2023-11-18",
    completedAt: null,
    createdAt: "2023-10-20T09:30:00Z",
    updatedAt: "2023-10-20T09:30:00Z",
    comments: []
  },
  {
    id: "task-10",
    projectId: "2",
    title: "Implement user authentication",
    description: "Add login and registration functionality",
    status: "In Progress",
    priority: "high",
    createdBy: {
      id: "user-1",
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    assignedTo: [
      {
        id: "user-5",
        name: "Jamie Smith",
        avatar: "/placeholder.svg?height=40&width=40"
      },
      {
        id: "user-6",
        name: "Taylor Wong",
        avatar: "/placeholder.svg?height=40&width=40"
      }
    ],
    dueDate: "2023-11-25",
    completedAt: null,
    createdAt: "2023-10-22T11:45:00Z",
    updatedAt: "2023-10-22T11:45:00Z",
    comments: []
  },
  {
    id: "task-11",
    projectId: "2",
    title: "Create app icon",
    description: "Design app icon for various platforms",
    status: "Done",
    priority: "medium",
    createdBy: {
      id: "user-3",
      name: "Emily Chen",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    assignedTo: [
      {
        id: "user-4",
        name: "Sam Taylor",
        avatar: "/placeholder.svg?height=40&width=40"
      }
    ],
    dueDate: "2023-10-30",
    completedAt: "2023-10-29T15:20:00Z",
    createdAt: "2023-10-15T14:20:00Z",
    updatedAt: "2023-10-29T15:20:00Z",
    comments: []
  },

  // Project 3 tasks
  {
    id: "task-12",
    projectId: "3",
    title: "Create social media content",
    description: "Prepare content for social media campaign",
    status: "To Do",
    priority: "medium",
    createdBy: {
      id: "user-1",
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    assignedTo: [
      {
        id: "user-6",
        name: "Taylor Wong",
        avatar: "/placeholder.svg?height=40&width=40"
      }
    ],
    dueDate: "2023-11-20",
    completedAt: null,
    createdAt: "2023-10-25T09:30:00Z",
    updatedAt: "2023-10-25T09:30:00Z",
    comments: []
  },
  {
    id: "task-13",
    projectId: "3",
    title: "Design email templates",
    description: "Create email templates for campaign",
    status: "In Progress",
    priority: "high",
    createdBy: {
      id: "user-3",
      name: "Emily Chen",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    assignedTo: [
      {
        id: "user-4",
        name: "Sam Taylor",
        avatar: "/placeholder.svg?height=40&width=40"
      },
      {
        id: "user-2",
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40"
      }
    ],
    dueDate: "2023-11-15",
    completedAt: null,
    createdAt: "2023-10-20T14:20:00Z",
    updatedAt: "2023-10-20T14:20:00Z",
    comments: []
  },

  // Project 4 tasks
  {
    id: "task-14",
    projectId: "4",
    title: "Evaluate cloud providers",
    description: "Compare AWS, Azure, and GCP options",
    status: "To Do",
    priority: "high",
    createdBy: {
      id: "user-1",
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    assignedTo: [
      {
        id: "user-5",
        name: "Jamie Smith",
        avatar: "/placeholder.svg?height=40&width=40"
      }
    ],
    dueDate: "2023-11-30",
    completedAt: null,
    createdAt: "2023-10-28T11:45:00Z",
    updatedAt: "2023-10-28T11:45:00Z",
    comments: []
  },
  {
    id: "task-15",
    projectId: "4",
    title: "Update security protocols",
    description: "Review and update security measures",
    status: "In Progress",
    priority: "high",
    createdBy: {
      id: "user-1",
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    assignedTo: [
      {
        id: "user-2",
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40"
      },
      {
        id: "user-6",
        name: "Taylor Wong",
        avatar: "/placeholder.svg?height=40&width=40"
      }
    ],
    dueDate: "2023-12-05",
    completedAt: null,
    createdAt: "2023-10-30T09:15:00Z",
    updatedAt: "2023-10-30T09:15:00Z",
    comments: []
  },

  // Project 5 tasks (Design System)
  {
    id: "task-16",
    projectId: "5",
    title: "Create color palette",
    description: "Define primary and secondary color palettes",
    status: "Done",
    priority: "high",
    createdBy: {
      id: "user-4",
      name: "Sam Taylor",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    assignedTo: [
      {
        id: "user-4",
        name: "Sam Taylor",
        avatar: "/placeholder.svg?height=40&width=40"
      }
    ],
    dueDate: "2023-10-15",
    completedAt: "2023-10-14T16:30:00Z",
    createdAt: "2023-10-01T09:00:00Z",
    updatedAt: "2023-10-14T16:30:00Z",
    comments: []
  },
  {
    id: "task-17",
    projectId: "5",
    title: "Design button components",
    description: "Create button styles for all states",
    status: "In Progress",
    priority: "medium",
    createdBy: {
      id: "user-4",
      name: "Sam Taylor",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    assignedTo: [
      {
        id: "user-4",
        name: "Sam Taylor",
        avatar: "/placeholder.svg?height=40&width=40"
      }
    ],
    dueDate: "2023-11-05",
    completedAt: null,
    createdAt: "2023-10-16T11:00:00Z",
    updatedAt: "2023-10-16T11:00:00Z",
    comments: []
  },

  // Project 6 tasks (Product Illustrations)
  {
    id: "task-18",
    projectId: "6",
    title: "Sketch homepage illustrations",
    description: "Create initial sketches for homepage illustrations",
    status: "To Do",
    priority: "medium",
    createdBy: {
      id: "user-4",
      name: "Sam Taylor",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    assignedTo: [
      {
        id: "user-4",
        name: "Sam Taylor",
        avatar: "/placeholder.svg?height=40&width=40"
      }
    ],
    dueDate: "2023-11-10",
    completedAt: null,
    createdAt: "2023-10-25T13:45:00Z",
    updatedAt: "2023-10-25T13:45:00Z",
    comments: []
  },

  // Project 7 tasks (Social Media Strategy)
  {
    id: "task-19",
    projectId: "7",
    title: "Analyze platform demographics",
    description: "Research user demographics across social platforms",
    status: "In Progress",
    priority: "high",
    createdBy: {
      id: "user-6",
      name: "Taylor Wong",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    assignedTo: [
      {
        id: "user-6",
        name: "Taylor Wong",
        avatar: "/placeholder.svg?height=40&width=40"
      }
    ],
    dueDate: "2023-11-08",
    completedAt: null,
    createdAt: "2023-10-20T10:30:00Z",
    updatedAt: "2023-10-20T10:30:00Z",
    comments: []
  },

  // Project 8 tasks (Security Audit)
  {
    id: "task-20",
    projectId: "8",
    title: "Review access controls",
    description: "Audit user access permissions across systems",
    status: "To Do",
    priority: "high",
    createdBy: {
      id: "user-2",
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    assignedTo: [
      {
        id: "user-2",
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40"
      },
      {
        id: "user-5",
        name: "Jamie Smith",
        avatar: "/placeholder.svg?height=40&width=40"
      }
    ],
    dueDate: "2023-11-20",
    completedAt: null,
    createdAt: "2023-10-28T09:15:00Z",
    updatedAt: "2023-10-28T09:15:00Z",
    comments: []
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

// Helper function to get projects by team
export function getProjectsByTeam(teamId) {
  return projects.filter((project) => project.teamId === teamId);
}
