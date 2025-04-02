export const users = [
	{
		id: "1",
		username: "test",
		email: "john.doe@example.com",
		password: "123456",
		avatar_url:
			"https://ui-avatars.com/api/?name=John+Doe&background=random",
		role: "admin",
		name: "John Doe",
	},
	{
		id: "2",
		username: "janedoe",
		email: "jane.doe@example.com",
		password: "password456",
		avatar_url:
			"https://ui-avatars.com/api/?name=Jane+Doe&background=random",
		role: "user",
		name: "Jane Doe",
	},
	{
		id: "3",
		username: "bobsmith",
		email: "bob.smith@example.com",
		password: "password789",
		avatar_url:
			"https://ui-avatars.com/api/?name=Bob+Smith&background=random",
		role: "user",
		name: "Bob Smith",
	},
];

export const teams = [
	{
		id: "1",
		name: "team1",
		code: "team1",
		description: "team1",
		createAt: "2024-10-01",
		updateAt: "2025-10-01",
	},
	{
		id: "2",
		name: "team2",
		code: "team2",
		description: "team2",
		createAt: "2024-10-01",
		updateAt: "2025-10-01",
	},
	{
		id: "3",
		name: "team3",
		code: "team3",
		description: "team3",
		createAt: "2024-10-01",
		updateAt: "2025-10-01",
	},
];

export const teamsMember = [
	{ teamId: "1", userId: "1", role: "admin" },
	{ teamId: "1", userId: "2", role: "member" },
	{ teamId: "2", userId: "2", role: "admin" },
	{ teamId: "2", userId: "3", role: "member" },
	{ teamId: "3", userId: "1", role: "admin" },
];

export const projects = [
	{
		id: "1",
		teamId: "1",
		name: "project1",
		createdAt: "2024-10-01",
		updateAt: "2025-10-01",
	},
	{
		id: "2",
		teamId: "1",
		name: "project2",
		createdAt: "2024-10-01",
		updateAt: "2025-10-01",
	},
	{
		id: "3",
		teamId: "2",
		name: "project3",
		createAt: "2024-10-01",
		updateAt: "2025-10-01",
	},
];

export const projectMember = [
	{ projectId: "1", userId: "1", role: "admin" },
	{ projectId: "1", userId: "2", role: "member" },
	{ projectId: "2", userId: "2", role: "admin" },
];
