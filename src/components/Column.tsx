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

const getBgColor = (id: string) => {
  switch (id) {
    case 'todo':
      return 'bg-blue-100/80';
    case 'in-progress':
      return 'bg-pink-100/80';
    case 'review':
      return 'bg-amber-100/80';
    case 'done':
      return 'bg-green-100/80';
    default:
      return 'bg-gray-100/80';
  }
};

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
  const taskIds = tasks.map(task => task.id);
  const bgColor = getBgColor(id);

  return (
    <div className={clsx(
      'rounded-xl shadow-sm bg-white',
      color,
      'border-l-4'
    )}>
      <div className="px-4 py-3 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className={`${iconColor} font-medium text-sm`}>{count}</span>
            <h2 className="font-medium text-gray-700">{title}</h2>
          </div>
          <div className="flex items-center gap-1">
            {onCreateTask && (
              <button 
                onClick={onCreateTask}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title={`Add new task to ${title}`}
              >
                <Plus size={18} className={iconColor} />
              </button>
            )}
            <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreHorizontal size={18} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>
      <div 
        ref={setNodeRef} 
        className={clsx(
          'p-3 min-h-[calc(100vh-12rem)]',
          bgColor,
          'transition-colors duration-200'
        )}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-2.5">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};