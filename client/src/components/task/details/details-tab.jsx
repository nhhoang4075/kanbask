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
      <TaskDetailsForm onSubmit={handleUpdateTaskDetailsSubmit} task={task} />
    </div>
  );
}
