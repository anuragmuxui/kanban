export interface User {
  id: string;
  avatar: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Comment {
  id: string;
  text: string;
  createdAt: Date;
  author?: User;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  tags?: Tag[];
  createdAt: Date;
  updatedAt?: Date;
  assignees?: User[];
  image?: string;
  comments: Comment[];
}
