/**
 * AppHeader Component
 *
 * This component renders the header section of the application.
 * It includes the application title, a notification button, and a search input field.
 *
 * @component
 * @returns {JSX.Element} The rendered AppHeader component.
 *
 * @example
 * // Usage example:
 * import AppHeader from './AppHeader';
 *
 * function App() {
 *   return (
 *     <div>
 *       <AppHeader />
 *     </div>
 *   );
 * }
 *
 * @dependencies
 * - Button: A reusable button component imported from "./ui/button".
 * - Input: A reusable input component imported from "./ui/input".
 * - Bell: An icon component imported from "lucide-react" for the notification button.
 *
 * @styles
 * - The component uses Tailwind CSS classes for styling.
 * - Supports dark mode with `dark:bg-gray-800` and `dark:text-white` classes.
 */
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Bell, SidebarClose } from "lucide-react";

export default function AppHeader({ isCollapsed, setIsCollapsed }) {
	return (
		<header className="flex px-4 py-3 w-full items-center border-b-2 border-gray-300">
			<h1 className="flex-4/5 text-2xl font-bold">Kanbask</h1>
			<div className="flex-1/5 flex items-center justify-end gap-4">
				<Button className="flex-none hover:bg-gray-300" variant="ghost">
					<Bell className="size-6" />
				</Button>
				<Input
					type="text"
					placeholder="Search..."
					className="bg-gray-100 dark:bg-gray-700 dark:text-white"
				/>
			</div>
		</header>
	);
}
