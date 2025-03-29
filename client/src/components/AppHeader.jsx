import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Bell } from "lucide-react";

export default function AppHeader() {
    return (
        <header className="flex p-4 w-full items-center shadow-md dark:bg-gray-800 dark:text-white">
            <h1 className="flex-4/5 text-xl font-bold">Kanbask</h1>
            <div className="flex-1/5 flex items-center justify-end gap-4">
                <Button className="flex-none" variant="ghost">
                    <Bell />
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