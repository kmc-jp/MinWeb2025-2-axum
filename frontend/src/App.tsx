import React from 'react';
import './App.css';
import TodoPage from './presentation/pages/TodoPage';

const App: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>MinWeb2025 Todoアプリ</h1>
      </header>
      <main className="app-main">
        <TodoPage />
      </main>
      <footer className="app-footer">
        <p>© 2025 MinWeb2025-2 Todoアプリ</p>
      </footer>
    </div>
  );
};

export default App;
