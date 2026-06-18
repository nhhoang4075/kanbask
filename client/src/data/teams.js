export const users = [
  {
    id: "1",
    username: "test",
    email: "john.doe@example.com",
    password: "123456",
    avatar_url: "https://ui-avatars.com/api/?name=John+Doe&background=random",
    role: "member",
    name: "Mohn Wick"
  },
  {
    id: "2",
    username: "janedoe",
    email: "jane.doe@example.com",
    password: "password456",
    avatar_url: "https://ui-avatars.com/api/?name=Jane+Doe&background=random",
    role: "member",
    name: "Jane Doe"
  },
  {
    id: "3",
    username: "bobsmith",
    email: "bob.smith@example.com",
    password: "password789",
    avatar_url: "https://ui-avatars.com/api/?name=Bob+Smith&background=random",
    role: "member",
    name: "Bob Smith"
  },
  {
    id: "4",
    username: "alicejohnson",
    email: "123@gmail.com",
    password: "password123",
    avatar_url: "https://ui-avatars.com/api/?name=Alice+Johnson&background=random",
    role: "member",
    name: "Alice Johnson"
  },
  {
    id: "5",
    username: "charliebrown",
    email: "123@gmail.com",
    password: "password123",
    avatar_url: "https://ui-avatars.com/api/?name=Charlie+Brown&background=random",
    role: "member",
    name: "Charlie Brown"
  },
  {
    id: "6",
    username: "davidwilson",
    email: "123@gmail.com",
    password: "password123",
    avatar_url: "https://ui-avatars.com/api/?name=David+Wilson&background=random",
    role: "member",
    name: "David Wilson"
  },
  {
    id: "7",
    username: "emilydavis",
    email: "1234@gmail.com",
    password: "password123",
    avatar_url: "https://ui-avatars.com/api/?name=Emily+Davis&background=random",
    role: "member",
    name: "Emily Davis"
  },
  {
    id: "8",
    username: "frankmiller",
    email: "1234@gmail.com",
    password: "password123",
    avatar_url: "https://ui-avatars.com/api/?name=Frank+Miller&background=random",
    role: "member",
    name: "Frank Miller"
  },
  {
    id: "9",
    username: "georgeclark",
    email: "1234@gmail.com",
    password: "password123",
    avatar_url: "https://ui-avatars.com/api/?name=George+Clark&background=random",
    role: "member",
    name: "George Clark"
  },
  {
    id: "10",
    username: "hannahlewis",
    email: "1234@gmail.com",
    password: "password123",
    avatar_url: "https://ui-avatars.com/api/?name=Hannah+Lewis&background=random",
    role: "member",
    name: "Hannah Lewis"
  },
  {
    id: "11",
    username: "isabellaallen",
    email: "1234@gmail.com",
    password: "password123",
    avatar_url: "https://ui-avatars.com/api/?name=Isabella+Allen&background=random",
    role: "member",
    name: "Isabella Allen"
  },
  {
    id: "queue3",
    username: "thomaswright",
    email: "1234@gmail.com",
    password: "password123",
    avatar_url: "https://ui-avatars.com/api/?name=Isabella+Allen&background=random",
    role: "member",
    name: "Thomas Wright"
  }
];

export const teams = [
  {
    id: "1",
    name: "team1",
    description: `Team1 is a dedicated group of professionals with a mission to revolutionize project management through innovative technology. Their goal is to build a user-friendly and efficient project management website that empowers teams to collaborate seamlessly, track progress effectively, and achieve their objectives with ease. By combining intuitive design with powerful features, Team1 aims to create a platform that simplifies task management, enhances communication, and fosters productivity for teams of all sizes.`,
    code: "team1",
    createdBy: "test",
    createdAt: "2024-10-01",
    updatedAt: "2025-10-01",
    queue: [
      {
        id: "queue1",
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        requestDate: "2025-10-05"
      },
      {
        id: "queue2",
        name: "Maria Garcia",
        email: "maria.garcia@example.com",
        requestDate: "2025-10-06"
      },
      {
        id: "queue3",
        name: "Thomas Wright",
        email: "thomas.wright@example.com",
        requestDate: "2025-10-03"
      }
    ]
  },
  {
    id: "2",
    name: "team2",
    code: "team2",
    description: "team2",
    createdAt: "2024-10-01",
    updatedAt: "2025-10-01",
    queue: []
  },
  {
    id: "3",
    name: "team3",
    code: "team3",
    description: "team3",
    createdAt: "2024-10-01",
    updatedAt: "2025-10-01",
    queue: [
      {
        id: "queue3",
        name: "Thomas Wright",
        email: "thomas.wright@example.com",
        requestDate: "2025-10-03"
      }
    ]
  },
  {
    id: "4",
    name: "team4",
    code: "team4",
    description: "team4",
    createdAt: "2024-10-01",
    updatedAt: "2025-10-01",
    queue: [
      {
        id: "queue3",
        name: "Thomas Wright",
        email: "thomas.wright@example.com",
        requestDate: "2025-10-03"
      }
    ]
  },
  {
    id: "5",
    name: "team5",
    code: "team5",
    description: "team5",
    createdAt: "2024-10-01",
    updatedAt: "2025-10-01",
    queue: []
  },
  {
    id: "6",
    name: "team6",
    code: "team6",
    description: "team6",
    createdAt: "2024-10-01",
    updatedAt: "2025-10-01",
    queue: [
      {
        id: "queue5",
        name: "Sophia Martinez",
        email: "abc@gmail.com",
        requestDate: "2025-10-03"
      }
    ]
  },
  {
    id: "7",
    name: "team7",
    code: "team7",
    description: "team7",
    createdAt: "2024-10-01",
    updatedAt: "2025-10-01",
    queue: []
  },
  {
    id: "8",
    name: "team8",
    code: "team8",
    description: "team8",
    createdAt: "2024-10-01",
    updatedAt: "2025-10-01",
    queue: []
  },
  {
    id: "9",
    name: "team9",
    code: "team9",
    description: "team9",
    createdAt: "2024-10-01",
    updatedAt: "2025-10-01",
    queue: []
  },
  {
    id: "10",
    name: "team10",
    code: "team10",
    description: "team10",
    createdAt: "2024-10-01",
    updatedAt: "2025-10-01",
    queue: []
  }
];

export const teamsMember = [
  { teamId: "1", userId: "1", role: "admin" },
  { teamId: "1", userId: "2", role: "member" },
  { teamId: "1", userId: "3", role: "member" },
  { teamId: "1", userId: "4", role: "member" },
  { teamId: "1", userId: "5", role: "member" },
  { teamId: "1", userId: "6", role: "member" },
  { teamId: "1", userId: "7", role: "member" },
  { teamId: "1", userId: "8", role: "member" },
  { teamId: "1", userId: "9", role: "member" },
  { teamId: "1", userId: "10", role: "member" },
  { teamId: "1", userId: "11", role: "member" },

  { teamId: "2", userId: "2", role: "admin" },
  { teamId: "2", userId: "3", role: "member" },
  { teamId: "3", userId: "1", role: "admin" }
];

export const projects = [
  {
    id: "1",
    teamId: "1",
    name: "projecttttttttttttttttttttttttttttttttttttttt tttttttttttttttttttttttttttttttttttttttttttt1",
    description:
      "Project1 is focused on creating a cutting-edge project management platform that simplifies task tracking, enhances team collaboration, and boosts productivity. The project aims to deliver an intuitive and feature-rich solution for teams of all sizes.",
    createdBy: "test",
    createdAt: "2024-10-01",
    updatedAt: "2025-10-01"
  },
  {
    id: "2",
    teamId: "1",
    name: "project2",
    description:
      "Project2 is dedicated to developing tools that streamline communication and task delegation within teams, ensuring seamless workflows and efficient project execution.",
    createdAt: "2024-10-01",
    updatedAt: "2025-10-01"
  },
  {
    id: "3",
    teamId: "2",
    name: "project3",
    description:
      "Project3 focuses on building a robust analytics dashboard that provides teams with actionable insights into project performance and progress tracking.",
    createdAt: "2024-10-01",
    updatedAt: "2025-10-01"
  },
  {
    id: "4",
    teamId: "2",
    name: "project4",
    description:
      "Project4 aims to create a secure and scalable file-sharing system that allows teams to collaborate on documents and resources effortlessly.",
    createdAt: "2024-10-01",
    updatedAt: "2025-10-01"
  },
  {
    id: "5",
    teamId: "3",
    name: "project5",
    description:
      "Project5 is focused on designing a mobile-friendly project management app that enables teams to stay connected and productive on the go.",
    createdAt: "2024-10-01",
    updatedAt: "2025-10-01"
  },
  {
    id: "6",
    teamId: "3",
    name: "project6",
    description:
      "Project6 is dedicated to integrating AI-powered features into project management, such as automated task prioritization and intelligent deadline predictions.",
    createdAt: "2024-10-01",
    updatedAt: "2025-10-01"
  },
  {
    id: "7",
    teamId: "4",
    name: "project7",
    description:
      "Project7 focuses on creating a customizable project management platform that adapts to the unique needs of different industries and teams.",
    createdAt: "2024-10-01",
    updatedAt: "2025-10-01"
  },
  {
    id: "8",
    teamId: "4",
    name: "project8",
    description:
      "Project8 is aimed at enhancing team communication through real-time chat and video conferencing features integrated into the project management platform.",
    createdAt: "2024-10-01",
    updatedAt: "2025-10-01"
  },
  {
    id: "9",
    teamId: "5",
    name: "project9",
    description:
      "Project9 is focused on building a time-tracking tool that helps teams monitor productivity and optimize resource allocation.",
    createdAt: "2024-10-01",
    updatedAt: "2025-10-01"
  },
  {
    id: "10",
    teamId: "5",
    name: "project10",
    description:
      "Project10 is dedicated to creating a knowledge base system that allows teams to store and access important project-related information efficiently.",
    createdAt: "2024-10-01",
    updatedAt: "2025-10-01"
  },
  {
    id: "11",
    teamId: "6",
    name: "project11",
    description:
      "Project11 aims to develop a gamified project management platform that motivates teams through rewards and achievements for completing tasks and milestones.",
    createdAt: "2024-10-01",
    updatedAt: "2025-10-01"
  }
];

export const projectMember = [
  { projectId: "1", userId: "1", role: "admin" },
  { projectId: "1", userId: "2", role: "member" },
  { projectId: "2", userId: "2", role: "admin" }
];
