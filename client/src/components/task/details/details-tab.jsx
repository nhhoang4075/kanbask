import TaskDetailsForm from "@/components/task/details/task-details-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useTask } from "@/hooks/use-task";

export default function DetailsTab({ task, onOpenChange }) {
  const { handleUpdateTask } = useTask();

  const handleUpdateTaskDetailsSubmit = async (formData) => {
    onOpenChange(false);

    await handleUpdateTask(task.id, {
      ...formData,
      status: formData.status || null,
      priority: formData.priority || null,
      due_date: formData.due_date || null,
      completed_at: formData.completed_at || null
    });
  };
  return (
    <div>
      <ScrollArea className="max-h-[calc(100vh-210px)] px-6 overflow-y-auto">
        <TaskDetailsForm onSubmit={handleUpdateTaskDetailsSubmit} task={task} />
      </ScrollArea>
      <div className="absolute bottom-6 right-6 flex justify-end gap-4">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
        <Button
          type="submit"
          form="task-details-form"
          className="bg-prussian-blue hover:bg-prussian-blue/90"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
