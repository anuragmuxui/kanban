import { useState } from 'react';
import { Task, Tag, User } from '../types';
import { createNewTag, createNewAssignee, validateTaskData, createTaskData } from '../utils/taskUtils';

interface UseTaskFormProps {
  initialTask?: Partial<Task>;
  onSubmit: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const useTaskForm = ({ initialTask = {}, onSubmit }: UseTaskFormProps) => {
  // Form state
  const [title, setTitle] = useState(initialTask.title || '');
  const [description, setDescription] = useState(initialTask.description || '');
  const [tags, setTags] = useState<Tag[]>(initialTask.tags || []);
  const [image, setImage] = useState<string | undefined>(initialTask.image);
  const [assignees, setAssignees] = useState<User[]>(initialTask.assignees || []);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateTaskData(title, description);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const taskData = createTaskData({
        title,
        description,
        status: initialTask.status,
        tags,
        image,
        assignees,
        comments: initialTask.comments,
      });
      await onSubmit(taskData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTag = (name: string, color?: string) => {
    if (!name.trim()) return;
    
    const newTag = createNewTag(name, color);
    if (!tags.some(tag => tag.name.toLowerCase() === newTag.name.toLowerCase())) {
      setTags([...tags, newTag]);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setTags(tags.filter(tag => tag.id !== tagId));
  };

  const handleImageUpload = (file: File | undefined) => {
    if (!file) {
      setImage(undefined);
      return;
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('Please upload an image file');
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddAssignee = () => {
    setAssignees([...assignees, createNewAssignee()]);
  };

  const handleRemoveAssignee = (assigneeId: string) => {
    setAssignees(assignees.filter(a => a.id !== assigneeId));
  };

  return {
    formState: {
      title,
      description,
      tags,
      image,
      assignees,
      errors,
      isSubmitting,
    },
    handlers: {
      setTitle,
      setDescription,
      handleAddTag,
      handleRemoveTag,
      handleImageUpload,
      handleAddAssignee,
      handleRemoveAssignee,
      handleSubmit,
    },
  };
};
