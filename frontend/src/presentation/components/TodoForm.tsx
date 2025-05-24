import React, { useState } from 'react';

interface TodoFormProps {
  onSubmit: (title: string) => void;
  initialValue?: string;
  buttonText?: string;
}

const TodoForm: React.FC<TodoFormProps> = ({ 
  onSubmit, 
  initialValue = '', 
  buttonText = '追加' 
}) => {
  const [title, setTitle] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title);
      if (buttonText === '追加') {
        setTitle('');
      }
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="ToDoを入力..."
        className="todo-input"
      />
      <button type="submit" className="todo-submit-btn">
        {buttonText}
      </button>
    </form>
  );
};

export default TodoForm;
