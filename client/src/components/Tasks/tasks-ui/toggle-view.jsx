import React from "react";
import { ToggleGroup, ToggleGroupItem } from "../../ui/toggle-group";
import { LayoutGrid, List } from "lucide-react";

const ToggleView = ({ viewMode, setViewMode }) => {
  return (
    <ToggleGroup
      type="single"
      value={viewMode}
      onValueChange={(value) => value && setViewMode(value)}
      className="w-full flex gap-3 justify-end flex-1"
    >
      <ToggleGroupItem
        value="kanban"
        className="flex items-center text-black px-2 py-1.5 rounded-md hover:bg-gray-200 hover:cursor-pointer"
      >
        <LayoutGrid className="h-4 w-4 mr-2" />
        Kanban
      </ToggleGroupItem>
      <ToggleGroupItem
        value="list"
        className="flex items-center text-black px-2 py-1.5 rounded-md hover:bg-gray-200 hover:cursor-pointer"
      >
        <List className="h-4 w-4 mr-2" />
        List
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default ToggleView;
