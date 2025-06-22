# MinWeb2025-2

## プロジェクト概要
MinWeb2025のサンプルプロジェクトです。フロントエンドはReact、バックエンドはNode.js (Express)、データベースはMySQLを使用しています。

### バックエンド構成
バックエンドは以下のレイヤーで構成されています：

#### ドメイン層
- `domain/entities`: ビジネスオブジェクトとビジネスルールを定義します
- `domain/repositories`: リポジトリのインターフェースを定義します

#### アプリケーション層
- `application/usecases`: アプリケーションのユースケースを実装します
  - 各ユースケースは単一の責任を持ちます

#### インターフェース層
- `interfaces/controllers`: HTTPリクエストを処理し、適切なユースケースを呼び出します

#### インフラストラクチャ層
- `infrastructure/repositories`: リポジトリの具体的な実装（MySQLなど）を提供します

### フロントエンド構成
フロントエンドも類似のアーキテクチャを採用しています：

#### ドメイン層
- `domain/entities`: ビジネスオブジェクトを定義します

#### インフラストラクチャ層
- `infrastructure/api`: APIとの通信を処理します

#### プレゼンテーション層
- `presentation/components`: UI部品を提供します
- `presentation/pages`: ページコンポーネントを提供します

## 技術スタック
- フロントエンド: React, TypeScript
- バックエンド: Node.js, Express, TypeScript
- データベース: MySQL
- 開発/デプロイ: Docker, docker-compose

## 開発ガイド

### Docker環境

#### 構成
- `backend`: バックエンドサービス (Node.js/Express)
- `frontend`: フロントエンドビルド環境 (React)
- `nginx`: Webサーバー (静的ファイル配信・リバースプロキシ)
- `mysql`: データベースサービス

#### 開発環境の操作
```bash
# 起動
docker-compose up -d

# 停止
docker-compose down

# ボリュームも含めて完全に環境を削除
docker-compose down -v
```

### フロントエンド開発 (React)

#### 開発サーバーの起動（コンテナ外で開発する場合）
```bash
cd frontend
npm install
npm start
```

#### ビルド
```bash
cd frontend
npm run build
```

#### 主要ファイル
- `src/index.tsx`: エントリーポイント
  ```tsx
  import React from 'react';
  import ReactDOM from 'react-dom/client';
  import App from './App';

  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  ```

- `src/App.tsx`: メインアプリケーションコンポーネント
  ```tsx
  import React from 'react';
  import { BrowserRouter, Routes, Route } from 'react-router-dom';
  import { HomePage, TaskListPage, TaskDetailPage } from './presentation/pages';
  import { Header, Footer } from './presentation/components/common';

  const App: React.FC = () => {
    return (
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tasks" element={<TaskListPage />} />
            <Route path="/tasks/:id" element={<TaskDetailPage />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    );
  };

  export default App;
  ```

- `src/domain/entities/`: ドメインオブジェクト
  ```tsx
  // src/domain/entities/Task.ts
  export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    createdAt: Date;
  }
  ```

- `src/infrastructure/api/`: API通信処理
  ```tsx
  // src/infrastructure/api/taskApi.ts
  import { Task } from '../../domain/entities/Task';

  const API_BASE_URL = '/api';

  export const fetchTasks = async (): Promise<Task[]> => {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  };

  export const fetchTaskById = async (id: number): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
    if (!response.ok) throw new Error('Failed to fetch task');
    return response.json();
  };
  ```

- `src/presentation/`: UI関連のコンポーネント
  ```tsx
  // src/presentation/components/task/TaskItem.tsx
  import React from 'react';
  import { Task } from '../../../domain/entities/Task';

  interface TaskItemProps {
    task: Task;
    onComplete: (id: number) => void;
  }

  export const TaskItem: React.FC<TaskItemProps> = ({ task, onComplete }) => {
    return (
      <div className="task-item">
        <h3>{task.title}</h3>
        <p>{task.description}</p>
        <span>{task.completed ? '完了' : '未完了'}</span>
        <button onClick={() => onComplete(task.id)}>完了にする</button>
      </div>
    );
  };
  ```

### バックエンド開発 (Node.js)

#### 開発サーバーの起動（コンテナ外で開発する場合）
```bash
cd backend
npm install
npm run dev
```

#### ビルド
```bash
cd backend
npm run build
```

#### 主要ファイル
- `src/index.ts`: エントリーポイント
  ```ts
  import express from 'express';
  import cors from 'cors';
  import taskRoutes from './routes/taskRoutes';

  const app = express();
  const PORT = process.env.PORT || 3001;

  app.use(cors());
  app.use(express.json());

  // ルートの設定
  app.use('/api/tasks', taskRoutes);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  ```

- `src/routes/`: APIルート定義
  ```ts
  // src/routes/taskRoutes.ts
  import { Router } from 'express';
  import { TaskController } from '../interfaces/controllers/TaskController';

  const router = Router();
  const taskController = new TaskController();

  router.get('/', taskController.getAllTasks);
  router.get('/:id', taskController.getTaskById);
  router.post('/', taskController.createTask);
  router.put('/:id', taskController.updateTask);
  router.delete('/:id', taskController.deleteTask);

  export default router;
  ```

- `src/domain/`: ドメイン層（エンティティ、リポジトリインターフェース）
  ```ts
  // src/domain/entities/Task.ts
  export interface Task {
    id?: number;
    title: string;
    description: string;
    completed: boolean;
    createdAt?: Date;
  }

  // src/domain/repositories/TaskRepository.ts
  import { Task } from '../entities/Task';

  export interface TaskRepository {
    findAll(): Promise<Task[]>;
    findById(id: number): Promise<Task | null>;
    create(task: Task): Promise<Task>;
    update(id: number, task: Partial<Task>): Promise<Task | null>;
    delete(id: number): Promise<boolean>;
  }
  ```

- `src/application/`: アプリケーション層（ユースケース）
  ```ts
  // src/application/usecases/task/GetAllTasksUseCase.ts
  import { Task } from '../../../domain/entities/Task';
  import { TaskRepository } from '../../../domain/repositories/TaskRepository';

  export class GetAllTasksUseCase {
    constructor(private taskRepository: TaskRepository) {}

    async execute(): Promise<Task[]> {
      return this.taskRepository.findAll();
    }
  }
  ```

- `src/interfaces/`: インターフェース層（コントローラー）
  ```ts
  // src/interfaces/controllers/TaskController.ts
  import { Request, Response } from 'express';
  import { GetAllTasksUseCase } from '../../application/usecases/task/GetAllTasksUseCase';
  import { GetTaskByIdUseCase } from '../../application/usecases/task/GetTaskByIdUseCase';
  import { MySQLTaskRepository } from '../../infrastructure/repositories/MySQLTaskRepository';

  const taskRepository = new MySQLTaskRepository();

  export class TaskController {
    async getAllTasks(req: Request, res: Response): Promise<void> {
      try {
        const useCase = new GetAllTasksUseCase(taskRepository);
        const tasks = await useCase.execute();
        res.json(tasks);
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }

    // 他のコントローラーメソッド...
  }
  ```

- `src/infrastructure/`: インフラストラクチャ層（リポジトリ実装など）
  ```ts
  // src/infrastructure/repositories/MySQLTaskRepository.ts
  import { Task } from '../../domain/entities/Task';
  import { TaskRepository } from '../../domain/repositories/TaskRepository';
  import { pool } from '../database/mysql';

  export class MySQLTaskRepository implements TaskRepository {
    async findAll(): Promise<Task[]> {
      const [rows] = await pool.query('SELECT * FROM tasks');
      return rows as Task[];
    }

    async findById(id: number): Promise<Task | null> {
      const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
      const tasks = rows as Task[];
      return tasks.length > 0 ? tasks[0] : null;
    }

    // 他のリポジトリメソッド...
  }
  ```

### データベース

#### マイグレーション
データベースの初期化スクリプトは `mysql/init/` ディレクトリに配置されています。

#### 接続情報
- ホスト:  `mysql` (コンテナ内から)
- ユーザー: `user`
- パスワード: `password`
- データベース名: `minweb`
- ポート: `3306`
