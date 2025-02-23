export interface User {
  id: string;
  avatar: string;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  comments: Comment[];
  createdAt: Date;
  updatedAt?: Date;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  tags?: Tag[];
  assignees?: User[];
  image?: string;
}

export interface Column {
  id: Task['status'];
  title: string;
  color: string;
  iconColor: string;
}