import TeamsNavbar from "@/components/MemberDataTable/TeamsNavbar";
import React from "react";

const layout = ({ children }) => {
	return (
		<div className="bg-white rounded-t-2xl h-full drop-shadow-md border-2 border-neutral-400 mr-2">
			<div className="px-3 py-3 bg-neutral-200 min-h-50px rounded-t-2xl">
				<TeamsNavbar />
			</div>
			{children}
		</div>
	);
};

export default layout;
