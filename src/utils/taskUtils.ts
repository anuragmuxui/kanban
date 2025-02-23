import { Task, Tag, User } from '../types';

export const generateRandomColor = (): { bg: string; text: string } => {
  const colors = [
    { bg: 'bg-blue-100', text: 'text-blue-800' },
    { bg: 'bg-green-100', text: 'text-green-800' },
    { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    { bg: 'bg-purple-100', text: 'text-purple-800' },
    { bg: 'bg-pink-100', text: 'text-pink-800' },
    { bg: 'bg-amber-100', text: 'text-amber-800' },
    { bg: 'bg-indigo-100', text: 'text-indigo-800' },
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const createNewTag = (name: string, color?: string): Tag => {
  const randomColor = generateRandomColor();
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    color: color || `${randomColor.bg} ${randomColor.text}`,
  };
};

export const createNewAssignee = (): User => ({
  id: crypto.randomUUID(),
  avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
});

export const validateTaskData = (title: string, description: string): { title?: string; description?: string } => {
  const errors: { title?: string; description?: string } = {};
  
  if (!title.trim()) {
    errors.title = 'Title is required';
  }
  if (!description.trim()) {
    errors.description = 'Description is required';
  }
  
  return errors;
};

export const createTaskData = (
  data: Partial<Task> & { title: string; description: string }
): Omit<Task, 'id' | 'createdAt' | 'updatedAt'> => ({
  title: data.title.trim(),
  description: data.description.trim(),
  status: data.status || 'todo',
  tags: data.tags || [],
  image: data.image,
  assignees: data.assignees || [],
  comments: data.comments || [],
});
