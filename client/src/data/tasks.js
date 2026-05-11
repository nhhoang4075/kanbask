export const initialData = [
	{
		id: "todo",
		title: "To Do",
		tasks: [
			{
				id: "task-1",
				title: "Research competitors",
				description: "Analyze top 5 competitors in the market",
				priority: "medium",
				assignee: {
					name: "Alex Johnson",
					avatar: "/placeholder.svg?height=40&width=40",
				},
				dueDate: "2023-11-15",
			},
			{
				id: "task-2",
				title: "Update documentation",
				description: "Update API documentation with new endpoints",
				priority: "low",
				dueDate: "2023-11-20",
			},
			{
				id: "task-3",
				title: "Design new landing page",
				description: "Create wireframes for the new landing page",
				priority: "high",
				assignee: {
					name: "Sam Taylor",
					avatar: "/placeholder.svg?height=40&width=40",
				},
				dueDate: "2023-11-10",
			},
		],
	},
	{
		id: "in-progress",
		title: "In Progress",
		tasks: [
			{
				id: "task-4",
				title: "Implement authentication",
				description: "Add OAuth2 authentication to the API",
				priority: "high",
				assignee: {
					name: "Jamie Smith",
					avatar: "/placeholder.svg?height=40&width=40",
				},
				dueDate: "2023-11-12",
			},
			{
				id: "task-5",
				title: "Fix navigation bug",
				description: "Fix the navigation bug on mobile devices",
				priority: "medium",
				assignee: {
					name: "Alex Johnson",
					avatar: "/placeholder.svg?height=40&width=40",
				},
			},
		],
	},
	{
		id: "review",
		title: "Review",
		tasks: [
			{
				id: "task-6",
				title: "Code review: Payment API",
				description: "Review the new payment processing API",
				priority: "high",
				assignee: {
					name: "Taylor Wong",
					avatar: "/placeholder.svg?height=40&width=40",
				},
				dueDate: "2023-11-08",
			},
		],
	},
	{
		id: "done",
		title: "Done",
		tasks: [
			{
				id: "task-7",
				title: "Setup CI/CD pipeline",
				description: "Configure GitHub Actions for automated testing",
				priority: "medium",
				assignee: {
					name: "Jamie Smith",
					avatar: "/placeholder.svg?height=40&width=40",
				},
			},
			{
				id: "task-8",
				title: "Create component library",
				description: "Build reusable UI components",
				priority: "low",
				assignee: {
					name: "Sam Taylor",
					avatar: "/placeholder.svg?height=40&width=40",
				},
			},
		],
	},
];
