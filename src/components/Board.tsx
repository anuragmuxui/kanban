import { Task } from '../types';
import { useKanbanStore } from '../store/kanbanStore';
import { TaskCard } from './TaskCard';

const STATUSES = ['todo', 'in-progress', 'review', 'done'] as const;

const STATUS_LABELS: Record<Task['status'], string> = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'review': 'Review',
  'done': 'Done'
};

export function Board() {
  const { tasks, moveTask } = useKanbanStore();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    moveTask(taskId, status);
  };

  return (
    <div className="flex gap-4 h-full p-4 overflow-x-auto">
      {STATUSES.map((status) => (
        <div
          key={status}
          className="flex-shrink-0 w-80 bg-gray-50 rounded-lg p-4"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, status)}
        >
          <h2 className="text-gray-700 font-semibold mb-4">{STATUS_LABELS[status]}</h2>
          <div className="space-y-3">
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
