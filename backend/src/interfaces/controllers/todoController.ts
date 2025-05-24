import express, { Request, Response } from 'express';
import { TodoUseCase } from '../../application/usecases/TodoUseCase';
import { MySqlTodoRepository } from '../../infrastructure/repositories/MySqlTodoRepository';
import { CreateTodoDTO, UpdateTodoDTO } from '../../domain/entities/Todo';

// リポジトリとユースケースのインスタンスを作成
const todoRepository = new MySqlTodoRepository();
const todoUseCase = new TodoUseCase(todoRepository);

// ルーターを作成
const router = express.Router();

/**
 * 全てのTodoを取得
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const todos = await todoUseCase.getAllTodos();
    res.status(200).json(todos.map(todo => todo.toDTO()));
  } catch (error) {
    console.error('Todoリスト取得エラー:', error);
    res.status(500).json({ message: 'Todoリストの取得に失敗しました' });
  }
});

/**
 * 指定したIDのTodoを取得
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: '無効なIDです' });
    }
    
    try {
      const todo = await todoUseCase.getTodoById(id);
      res.status(200).json(todo.toDTO());
    } catch (error) {
      if ((error as Error).message.includes('存在しません')) {
        res.status(404).json({ message: (error as Error).message });
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Todo取得エラー:', error);
    res.status(500).json({ message: 'Todoの取得に失敗しました' });
  }
});

/**
 * 新しいTodoを作成
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const todoData: CreateTodoDTO = {
      title: req.body.title
    };
    
    // タイトルのバリデーション
    if (!todoData.title || todoData.title.trim() === '') {
      return res.status(400).json({ message: 'タイトルは必須です' });
    }
    
    const newTodo = await todoUseCase.createTodo(todoData);
    res.status(201).json(newTodo.toDTO());
  } catch (error) {
    console.error('Todo作成エラー:', error);
    res.status(500).json({ message: 'Todoの作成に失敗しました' });
  }
});

/**
 * 指定したTodoを更新
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: '無効なIDです' });
    }
    
    const todoData: UpdateTodoDTO = {};
    
    if (req.body.title !== undefined) {
      todoData.title = req.body.title;
    }
    
    if (req.body.completed !== undefined) {
      todoData.completed = Boolean(req.body.completed);
    }
    
    // 更新するデータがあるか確認
    if (Object.keys(todoData).length === 0) {
      return res.status(400).json({ message: '更新するデータがありません' });
    }
    
    try {
      const updatedTodo = await todoUseCase.updateTodo(id, todoData);
      res.status(200).json(updatedTodo.toDTO());
    } catch (error) {
      if ((error as Error).message.includes('存在しません')) {
        res.status(404).json({ message: (error as Error).message });
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Todo更新エラー:', error);
    res.status(500).json({ message: 'Todoの更新に失敗しました' });
  }
});

/**
 * Todoを完了状態に変更
 */
router.patch('/:id/complete', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: '無効なIDです' });
    }
    
    try {
      const completedTodo = await todoUseCase.completeTodo(id);
      res.status(200).json(completedTodo.toDTO());
    } catch (error) {
      if ((error as Error).message.includes('存在しません')) {
        res.status(404).json({ message: (error as Error).message });
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Todo完了状態変更エラー:', error);
    res.status(500).json({ message: 'Todoの完了状態変更に失敗しました' });
  }
});

/**
 * 指定したTodoを削除
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: '無効なIDです' });
    }
    
    try {
      await todoUseCase.deleteTodo(id);
      res.status(204).send();
    } catch (error) {
      if ((error as Error).message.includes('存在しません')) {
        res.status(404).json({ message: (error as Error).message });
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Todo削除エラー:', error);
    res.status(500).json({ message: 'Todoの削除に失敗しました' });
  }
});

export default router;
