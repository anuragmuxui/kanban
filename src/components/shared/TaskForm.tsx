import React from 'react';
import { X, Upload, Trash2, Plus } from 'lucide-react';
import { Task } from '../../types';
import { useTaskForm } from '../../hooks/useTaskForm';

interface TaskFormProps {
  task?: Partial<Task>;
  onSubmit: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
}

const TAG_COLORS = [
  { bg: 'bg-blue-100', text: 'text-blue-800' },
  { bg: 'bg-green-100', text: 'text-green-800' },
  { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  { bg: 'bg-purple-100', text: 'text-purple-800' },
  { bg: 'bg-pink-100', text: 'text-pink-800' },
  { bg: 'bg-amber-100', text: 'text-amber-800' },
  { bg: 'bg-indigo-100', text: 'text-indigo-800' },
] as const;

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  isSubmitting = false,
}) => {
  const { formState, handlers } = useTaskForm({
    initialTask: task,
    onSubmit,
  });

  const {
    title,
    description,
    tags,
    image,
    assignees,
    errors,
  } = formState;

  const {
    setTitle,
    setDescription,
    handleAddTag,
    handleRemoveTag,
    handleImageUpload,
    handleAddAssignee,
    handleRemoveAssignee,
    handleSubmit,
  } = handlers;

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Enter task title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Enter task description"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className={`${tag.color} px-2 py-1 rounded-md text-sm flex items-center gap-1`}
            >
              {tag.name}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag.id)}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag(e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a tag (press Enter)"
          />
          <div className="flex gap-1">
            {TAG_COLORS.map((color, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleAddTag(`Tag ${index + 1}`, `${color.bg} ${color.text}`)}
                className={`w-6 h-6 rounded-full ${color.bg}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image
        </label>
        {image ? (
          <div className="relative">
            <img
              src={image}
              alt="Task"
              className="w-full h-40 object-cover rounded-md"
            />
            <button
              type="button"
              onClick={() => handleImageUpload(undefined)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500"
            >
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <span className="mt-2 block text-sm font-medium text-gray-600">
                  Upload an image
                </span>
              </div>
            </label>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Assignees
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {assignees.map((assignee) => (
            <div
              key={assignee.id}
              className="relative group"
            >
              <img
                src={assignee.avatar}
                alt="Assignee"
                className="w-8 h-8 rounded-full"
              />
              <button
                type="button"
                onClick={() => handleRemoveAssignee(assignee.id)}
                className="absolute -top-1 -right-1 hidden group-hover:flex bg-red-500 text-white rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddAssignee}
            className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-blue-500"
          >
            <Plus className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
};
