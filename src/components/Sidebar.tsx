import UserPanel from "./saves/UserPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./shadcn/ui/tabs";
import { TaskSidebar } from "./tasks/TaskSidebar";

export default function Sidebar() {
  return (
    <>
      <Tabs className="h-full" defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="saves">Saves</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks" className="h-3/5">
          <TaskSidebar />
        </TabsContent>
        <TabsContent value="saves" className="h-[calc(100vh-46px)]">
          <UserPanel />
        </TabsContent>
      </Tabs>
    </>
  );
}
