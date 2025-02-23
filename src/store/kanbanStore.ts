import { create } from 'zustand';
import { Task } from '../types';

// Load tasks from localStorage or use default if not available
const loadTasks = (): Task[] => {
  const savedTasks = localStorage.getItem('kanban-tasks');
  if (savedTasks) {
    const tasks = JSON.parse(savedTasks);
    // Convert string dates back to Date objects
    return tasks.map((task: Task) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: task.updatedAt ? new Date(task.updatedAt) : undefined,
    }));
  }
  return dummyTasks;
};

// Save tasks to localStorage
const saveTasks = (tasks: Task[]) => {
  localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
};

const dummyTasks: Task[] = [
  {
    id: 'task1',
    title: 'Design System Updates',
    description: 'Update color palette and typography',
    status: 'todo',
    tags: [
      { id: '1', name: 'Design', color: 'bg-amber-100 text-amber-800' },
      { id: '4', name: 'QA', color: 'bg-blue-100 text-blue-800' },
    ],
    assignees: [
      { id: '1', avatar: 'https://i.pravatar.cc/150?img=1' },
      { id: '2', avatar: 'https://i.pravatar.cc/150?img=2' },
    ],
    comments: [],
    createdAt: new Date(),
  },
  {
    id: 'task2',
    title: 'API Integration',
    description: 'Implement REST endpoints',
    status: 'in-progress',
    tags: [
      { id: '3', name: 'Development', color: 'bg-green-100 text-green-800' },
    ],
    assignees: [
      { id: '3', avatar: 'https://i.pravatar.cc/150?img=3' },
    ],
    comments: [],
    createdAt: new Date(),
  },
  {
    id: 'task3',
    title: 'User Research',
    description: 'Conduct user interviews',
    status: 'review',
    tags: [
      { id: '2', name: 'Research', color: 'bg-pink-100 text-pink-800' },
    ],
    assignees: [
      { id: '4', avatar: 'https://i.pravatar.cc/150?img=4' },
    ],
    comments: [],
    createdAt: new Date(),
  },
  {
    id: 'task4',
    title: 'Performance Optimization',
    description: 'Improve loading times',
    status: 'done',
    tags: [
      { id: '3', name: 'Development', color: 'bg-green-100 text-green-800' },
      { id: '4', name: 'QA', color: 'bg-blue-100 text-blue-800' },
    ],
    assignees: [
      { id: '1', avatar: 'https://i.pravatar.cc/150?img=1' },
      { id: '3', avatar: 'https://i.pravatar.cc/150?img=3' },
    ],
    comments: [],
    createdAt: new Date(),
  },
  {
    id: 'task5',
    title: 'Bug Fixes',
    description: 'Fix reported issues',
    status: 'in-progress',
    tags: [
      { id: '3', name: 'Development', color: 'bg-green-100 text-green-800' },
    ],
    assignees: [
      { id: '2', avatar: 'https://i.pravatar.cc/150?img=2' },
    ],
    comments: [],
    createdAt: new Date(),
  },
  {
    id: 'task6',
    title: 'Documentation',
    description: 'Update API docs',
    status: 'review',
    tags: [
      { id: '3', name: 'Development', color: 'bg-green-100 text-green-800' },
    ],
    assignees: [
      { id: '4', avatar: 'https://i.pravatar.cc/150?img=4' },
    ],
    comments: [],
    createdAt: new Date(),
  }
];

interface KanbanStore {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (taskId: string) => void;
  copyTask: (taskId: string) => void;
  moveTask: (taskId: string, newStatus: Task['status']) => void;
  duplicateTask: (taskId: string) => void;
  clearCache: () => void;
}

export const useKanbanStore = create<KanbanStore>((set) => ({
  tasks: loadTasks(),

  addTask: (task) => {
    set((state) => {
      const newTask: Task = {
        ...task,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        comments: task.comments || [],
      };

      const newTasks = [...state.tasks, newTask];
      saveTasks(newTasks);
      return { tasks: newTasks };
    });
  },

  updateTask: (taskId, updates) => {
    set((state) => {
      const newTasks = state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      );
      saveTasks(newTasks);
      return { tasks: newTasks };
    });
  },

  deleteTask: (taskId) => {
    set((state) => {
      const newTasks = state.tasks.filter((task) => task.id !== taskId);
      saveTasks(newTasks);
      return { tasks: newTasks };
    });
  },

  copyTask: (taskId) => {
    set((state) => {
      const taskToCopy = state.tasks.find((task) => task.id === taskId);
      if (!taskToCopy) return state;

      const newTask: Task = {
        ...taskToCopy,
        id: crypto.randomUUID(),
        title: `${taskToCopy.title} (Copy)`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const newTasks = [...state.tasks, newTask];
      saveTasks(newTasks);
      return { tasks: newTasks };
    });
  },

  moveTask: (taskId, newStatus) => {
    set((state) => {
      const newTasks = state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus, updatedAt: new Date() }
          : task
      );
      saveTasks(newTasks);
      return { tasks: newTasks };
    });
  },

  duplicateTask: (taskId) => {
    set((state) => {
      const taskToDuplicate = state.tasks.find((task) => task.id === taskId);
      if (!taskToDuplicate) return state;

      const duplicatedTask: Task = {
        ...taskToDuplicate,
        id: crypto.randomUUID(),
        title: `${taskToDuplicate.title} (Copy)`,
        createdAt: new Date(),
        updatedAt: undefined,
      };

      const newTasks = [...state.tasks, duplicatedTask];
      saveTasks(newTasks);
      return { tasks: newTasks };
    });
  },

  clearCache: () => {
    localStorage.removeItem('kanban-tasks');
    set({ tasks: dummyTasks });
  },
}));