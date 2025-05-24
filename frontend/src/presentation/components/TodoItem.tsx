import React from 'react';
import { Todo } from '../../domain/entities/Todo';

interface TodoItemProps {
  todo: Todo;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onComplete, onDelete, onEdit }) => {
  return (
    <div className="todo-item">
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onComplete(todo.id)}
          className="todo-checkbox"
        />
        <span className={todo.completed ? 'todo-text completed' : 'todo-text'}>
          {todo.title}
        </span>
      </div>
      <div className="todo-actions">
        <button 
          className="todo-edit-btn"
          onClick={() => onEdit(todo.id)}
          disabled={todo.completed}
        >
          編集
        </button>
        <button 
          className="todo-delete-btn"
          onClick={() => onDelete(todo.id)}
        >
          削除
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
