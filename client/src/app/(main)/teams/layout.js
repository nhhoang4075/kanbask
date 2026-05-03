import TeamsNavbar from "@/components/MemberDataTable/TeamsNavbar";
import React from "react";

const layout = ({ children }) => {
	return (
		<div className="grid grid-rows-[64px_auto] bg-white h-full rounded-t-2xl drop-shadow-md border-2 border-neutral-400 mr-2">
			<nav className="px-3 py-3 bg-neutral-200 rounded-t-2xl">
				<TeamsNavbar />
			</nav>
			<div className="h-full">{children}</div>
		</div>
	);
};

export default layout;
