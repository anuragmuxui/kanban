import { Column } from '../types';

export const COLUMNS: Column[] = [
  {
    id: 'todo',
    title: 'To-do',
    color: 'bg-blue-100 border-blue-600',
    iconColor: 'text-blue-600'
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    color: 'bg-pink-100 border-pink-600',
    iconColor: 'text-pink-600'
  },
  {
    id: 'review',
    title: 'Review',
    color: 'bg-amber-100 border-amber-600',
    iconColor: 'text-amber-600'
  },
  {
    id: 'done',
    title: 'Done',
    color: 'bg-green-100 border-green-600',
    iconColor: 'text-green-600'
  }
];