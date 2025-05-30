import React, { useState } from 'react';

interface TodoFormProps {
  onSubmit: (value: string) => void;
  initialValue?: string;
  buttonText?: string;
}

const TodoForm: React.FC<TodoFormProps> = ({ 
  onSubmit, 
  initialValue = "", 
  buttonText = "追加" 
}) => {
  const [value, setValue] = useState(initialValue);

  return (
    <form 
      className="todo-form" 
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) {
          onSubmit(value);
          if (buttonText === "追加") {
            setValue("");
          }
        }
      }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Todoを入力..."
        className="todo-input"
      />
      <button type="submit" className="todo-submit-btn">
        {buttonText}
      </button>
    </form>
  );
};

export default TodoForm;
