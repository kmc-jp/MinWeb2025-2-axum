import React, { useEffect, useState } from 'react';
import TodoItem from '../components/TodoItem';
import TodoForm from '../components/TodoForm';
import EditTodoModal from '../components/EditTodoModal';
import { Todo } from '../../domain/entities/Todo';
import { TodoApi } from '../../infrastructure/api/TodoApi';

const TodoPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editTodo, setEditTodo] = useState<Todo | null>(null);

  // 初期ロード時にTodoリストを取得
  useEffect(() => {
    (async () => {
      try {
        const data = await TodoApi.getAllTodos();
        setTodos(data);
        setError(null);
      } catch (error) {
        setError('Todoリストの取得に失敗しました');
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Todo完了状態の切り替え
  const handleComplete = async (id: number) => {
    try {
      // 完了・未完了を切り替え
      const todo = todos.find(todo => todo.id === id);
      if (!todo) return;
      
      const updatedTodo = await TodoApi.updateTodo(id, { completed: !todo.completed });
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
    } catch (error) {
      setError('Todoのステータス更新に失敗しました');
      console.error(error);
    }
  };

  // Todo編集用のモーダルを開く
  const handleEdit = (id: number) => {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
      setEditTodo(todo);
    }
  };

  // Todo削除
  const handleDelete = async (id: number) => {
    try {
      await TodoApi.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      setError('Todoの削除に失敗しました');
      console.error(error);
    }
  };

  return (
    <div className="todo-container">
      <h1>Todoリスト</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <TodoForm onSubmit={async (title: string) => {
        try {
          const newTodo = await TodoApi.createTodo({ title });
          setTodos([newTodo, ...todos]);
        } catch (error) {
          setError('Todoの作成に失敗しました');
          console.error(error);
        }
      }} />
      
      {loading ? (
        <div className="loading">読み込み中...</div>
      ) : (
        <div className="todo-list">
          {todos.length === 0 ? (
            <div className="empty-message">Todoがありません。新しいTodoを追加してください。</div>
          ) : (
            todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onComplete={handleComplete}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      )}
      
      {/* 編集モーダル */}
      {editTodo && (
        <EditTodoModal
          todo={editTodo}
          onClose={() => setEditTodo(null)}
          onSave={async (id: number, title: string) => {
            try {
              const updatedTodo = await TodoApi.updateTodo(id, { title });
              setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
            } catch (error) {
              setError('Todoの更新に失敗しました');
              console.error(error);
            }
          }}
        />
      )}
    </div>
  );
};

export default TodoPage;
