import React from "react";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

const TeamsNavbar = () => {
	const navItems = [
		{ name: "Members", href: "/teams/members" },
		{ name: "Projects", href: "/teams/projects" },
	];

	return (
		<NavigationMenu>
			<NavigationMenuList className="flex gap-2">
				{navItems.map((item, index) => (
					<NavigationMenuItem key={index}>
						<Link href={item.href} legacyBehavior passHref>
							<NavigationMenuLink
								className={
									navigationMenuTriggerStyle() +
									"min-w-[100px] text-base"
								}
							>
								{item.name}
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
				))}
			</NavigationMenuList>
		</NavigationMenu>
	);
};

export default TeamsNavbar;
