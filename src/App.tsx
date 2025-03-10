import {
  useState
} from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  DragOverEvent,
  rectIntersection,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Column } from './components/Column';
import { TaskCard } from './components/TaskCard';
import { useKanbanStore } from './store/kanbanStore';
import { Plus } from 'lucide-react';
import { CreateTaskModal } from './components/CreateTaskModal';
import { Task } from './types';
import { COLUMNS } from './constants/columns';

function App() {
  const tasks = useKanbanStore((state) => state.tasks);
  const updateTask = useKanbanStore((state) => state.updateTask);
  const reorderTasks = useKanbanStore((state) => state.reorderTasks);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentContainer, setCurrentContainer] = useState<Task['status']>('todo');
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task);
    if (task) {
      setCurrentContainer(task.status);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeTask = tasks.find(t => t.id === active.id);
    const overId = over.id;

    if (!activeTask || active.id === overId) return;

    const isOverColumn = COLUMNS.find(col => col.id === overId);
    if (isOverColumn) {
      setCurrentContainer(overId as Task['status']);
    } else {
      const overTask = tasks.find(t => t.id === overId);
      if (overTask) {
        setCurrentContainer(overTask.status);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) {
      setActiveTask(null);
      return;
    }

    const isOverColumn = COLUMNS.find(col => col.id === over.id);
    const newStatus = isOverColumn ? over.id as Task['status'] : currentContainer;

    const overTask = tasks.find(t => t.id === over.id);
    
    if (overTask && activeTask.id !== overTask.id) {
      const activeIndex = tasks.findIndex(t => t.id === activeTask.id);
      const overIndex = tasks.findIndex(t => t.id === overTask.id);
      
      const newTasks = arrayMove(tasks, activeIndex, overIndex);
      reorderTasks(newTasks);
      
      if (activeTask.status !== overTask.status) {
        updateTask(activeTask.id, { status: overTask.status });
      }
    } else if (activeTask.status !== newStatus) {
      updateTask(activeTask.id, { status: newStatus });
    }

    setActiveTask(null);
    setCurrentContainer('todo');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add Task
          </button>
        </div>

        <DndContext
          collisionDetection={rectIntersection}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {COLUMNS.map((column) => (
                <Column
                  key={column.id}
                  {...column}
                  tasks={tasks.filter((task) => task.status === column.id)}
                  count={tasks.filter((task) => task.status === column.id).length}
                  onCreateTask={column.id === 'todo' ? () => {
                    setIsCreateModalOpen(true);
                    setCurrentContainer('todo');
                  } : undefined}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} overlay /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      {isCreateModalOpen && (
        <CreateTaskModal
          onClose={() => setIsCreateModalOpen(false)}
          initialStatus={currentContainer}
        />
      )}
    </div>
  );
}

export default App;