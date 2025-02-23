import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Copy, Edit, Trash2, AlertCircle } from 'lucide-react';
import { Task } from '../types';
import { useKanbanStore } from '../store/kanbanStore';
import { EditTaskModal } from './EditTaskModal';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const deleteConfirmRef = useRef<HTMLDivElement>(null);
  const { updateTask, deleteTask, copyTask } = useKanbanStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: task
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
      if (deleteConfirmRef.current && !deleteConfirmRef.current.contains(event.target as Node)) {
        setShowDeleteConfirm(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEdit = () => {
    setShowMenu(false);
    setShowEditModal(true);
  };

  const handleCopy = () => {
    copyTask(task.id);
    setShowMenu(false);
  };

  const handleDelete = () => {
    setShowMenu(false);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    deleteTask(task.id);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200/75 cursor-move select-none backdrop-blur-sm"
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="space-y-2 flex-grow">
            <h3 className="text-gray-800 font-medium text-sm line-clamp-2">{task.title}</h3>
          </div>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-100">
                <button
                  onClick={handleEdit}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={handleCopy}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        {task.image && (
          <div className="relative w-full h-40 bg-gray-50 rounded-lg overflow-hidden border border-gray-200 mb-3">
            <img
              src={task.image}
              alt={task.title}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ backgroundColor: 'rgb(249, 250, 251)' }}
            />
          </div>
        )}
        <p className="text-gray-600 text-sm px-1 line-clamp-3">{task.description}</p>
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {task.tags.map((tag) => (
              <span
                key={tag.id}
                className={`${tag.color} px-2 py-0.5 rounded-full text-xs font-medium`}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 space-y-4"
            ref={deleteConfirmRef}
          >
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-semibold">Delete Task</h3>
            </div>
            <p className="text-gray-600">
              Are you sure you want to delete "{task.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <EditTaskModal
          task={task}
          onClose={() => setShowEditModal(false)}
          onSave={(updatedTask) => {
            updateTask(updatedTask.id, updatedTask);
            setShowEditModal(false);
          }}
        />
      )}
    </>
  );
}