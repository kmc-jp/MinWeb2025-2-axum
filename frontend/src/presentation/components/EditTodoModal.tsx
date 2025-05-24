import React from 'react';
import { Todo } from '../../domain/entities/Todo';
import TodoForm from './TodoForm';

interface EditTodoModalProps {
  todo: Todo;
  onClose: () => void;
  onSave: (id: number, title: string) => void;
}

const EditTodoModal: React.FC<EditTodoModalProps> = ({ todo, onClose, onSave }) => {
  if (!todo) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Todoの編集</h3>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <TodoForm
            initialValue={todo.title}
            buttonText="保存"
            onSubmit={(title) => {
              onSave(todo.id, title);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EditTodoModal;
