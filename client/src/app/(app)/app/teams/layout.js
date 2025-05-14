import React from "react";

const layout = ({ children }) => {
  return (
    <div className="h-full grid grid-rows-[auto_1fr] bg-slate-100 border-l-2 border-gray-500">
      {/* <nav className="px-3 py-2 bg-neutral-200 border-b-2 border-gray-500">
				<TeamsNavbar />
			</nav> */}
      <div>{children}</div>
    </div>
  );
};

export default layout;
