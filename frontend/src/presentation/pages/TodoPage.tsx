import React, { useEffect, useState } from 'react';
import TodoItem from '../components/TodoItem';
import TodoForm from '../components/TodoForm';
import EditTodoModal from '../components/EditTodoModal';
import { Todo } from '../../domain/entities/Todo';
import { TodoApiClient } from '../../infrastructure/api/TodoApi';

const TodoPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  // Todoリストの取得
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const fetchedTodos = await TodoApiClient.getAllTodos();
      setTodos(fetchedTodos);
      setError(null);
    } catch (err) {
      setError('ToDoリストの読み込みに失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Todoの作成
  const handleCreateTodo = async (title: string) => {
    try {
      const newTodo = await TodoApiClient.createTodo({ title });
      setTodos([newTodo, ...todos]);
    } catch (err) {
      setError('ToDoの作成に失敗しました');
      console.error(err);
    }
  };

  // Todoの完了/未完了の切り替え
  const handleToggleTodo = async (id: number) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      const updatedTodo = await TodoApiClient.updateTodo(id, { 
        completed: !todo.completed 
      });
      
      setTodos(todos.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
    } catch (err) {
      setError('ToDoのステータス更新に失敗しました');
      console.error(err);
    }
  };

  // Todoの編集
  const handleEditTodo = (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      setEditingTodo(todo);
    }
  };

  // Todoの更新
  const handleUpdateTodo = async (id: number, title: string) => {
    try {
      const updatedTodo = await TodoApiClient.updateTodo(id, { title });
      setTodos(todos.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
    } catch (err) {
      setError('ToDoの更新に失敗しました');
      console.error(err);
    }
  };

  // Todoの削除
  const handleDeleteTodo = async (id: number) => {
    try {
      await TodoApiClient.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError('ToDoの削除に失敗しました');
      console.error(err);
    }
  };

  return (
    <div className="todo-container">
      <h1>ToDoリスト</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <TodoForm onSubmit={handleCreateTodo} />

      {loading ? (
        <div className="loading">読み込み中...</div>
      ) : (
        <div className="todo-list">
          {todos.length === 0 ? (
            <div className="empty-message">ToDoがありません。新しいToDoを追加してください。</div>
          ) : (
            todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onComplete={handleToggleTodo}
                onEdit={handleEditTodo}
                onDelete={handleDeleteTodo}
              />
            ))
          )}
        </div>
      )}

      {editingTodo && (
        <EditTodoModal
          todo={editingTodo}
          onClose={() => setEditingTodo(null)}
          onSave={handleUpdateTodo}
        />
      )}
    </div>
  );
};

export default TodoPage;
