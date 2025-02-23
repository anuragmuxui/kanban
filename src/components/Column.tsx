import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard';
import { Task } from '../types';
import { MoreHorizontal, Plus } from 'lucide-react';
import clsx from 'clsx';

interface ColumnProps {
  id: string;
  title: string;
  count: number;
  color: string;
  iconColor: string;
  tasks: Task[];
  onCreateTask?: () => void;
}

export const Column: React.FC<ColumnProps> = ({
  id,
  title,
  count,
  color,
  iconColor,
  tasks,
  onCreateTask,
}) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className={clsx(
      'rounded-xl shadow-sm',
      color,
      'border-l-4'
    )}>
      <div className="p-4 border-b bg-white rounded-tr-xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className={`${iconColor} font-semibold`}>{count}</span>
            <h2 className="font-semibold">{title}</h2>
          </div>
          <div className="flex items-center gap-1">
            {id === 'todo' && onCreateTask && (
              <button 
                onClick={onCreateTask}
                className="p-1 hover:bg-gray-100 rounded"
                title="Add new task"
              >
                <Plus size={20} className={iconColor} />
              </button>
            )}
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreHorizontal size={20} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>
      <div ref={setNodeRef} className="p-4 min-h-[200px]">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};