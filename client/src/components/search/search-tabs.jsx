import { Tabs, TabsTrigger, TabsContent, TabsList } from "../ui/tabs";
import SearchTabsContent from "./search-tabs-content";
import ChooseConvId from "./choose-conv-id";

export default function SearchTabs({ convId, setConvId, setActiveTab }) {
    const handleTabChange = (value) => {
        setActiveTab(value);
    };

    return (
        <Tabs defaultValue="users" onValueChange={handleTabChange} className="w-full flex-1 h-full">
            <TabsList className="w-full space-x-2">
              <TabsTrigger value="users" className="font-roboto text-md rounded-none shadow-none transition-all data-[state=active]:border-b-prussian-blue data-[state=active]:shadow-none w-1/3">
                Users
              </TabsTrigger>
              <TabsTrigger value="messages" className="font-roboto text-md rounded-none shadow-none transition-all data-[state=active]:border-b-prussian-blue data-[state=active]:shadow-none w-1/3">
                Messages
              </TabsTrigger>
              <TabsTrigger value="tasks" className="font-roboto text-md rounded-none shadow-none transition-all data-[state=active]:border-b-prussian-blue data-[state=active]:shadow-none w-1/3">
                Tasks
              </TabsTrigger>
            </TabsList>
            <TabsContent value="users" className="flex flex-col gap-2 overflow-y-auto">
              <SearchTabsContent type="users" />
            </TabsContent>
            <TabsContent value="messages" className="flex flex-col gap-2 overflow-y-auto">
              <ChooseConvId convId={convId} setConvId={setConvId} />
              <SearchTabsContent type="messages" convId={convId}/>
            </TabsContent>
            <TabsContent value="tasks" className="flex flex-col gap-2 overflow-y-auto">
              <SearchTabsContent type="tasks" />
            </TabsContent>
        </Tabs>   
    );
}