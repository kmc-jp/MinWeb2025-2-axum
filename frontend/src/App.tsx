import React from 'react';
import TodoPage from './presentation/pages/TodoPage';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>MinWeb2025 ToDoアプリ</h1>
      </header>
      <main className="app-main">
        <TodoPage />
      </main>
      <footer className="app-footer">
        <p>© 2025 MinWeb2025-2 ToDoアプリ</p>
      </footer>
    </div>
  );
};

export default App;
