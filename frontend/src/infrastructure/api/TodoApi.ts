import axios from 'axios';
import { Todo, CreateTodoDTO, UpdateTodoDTO } from '../../domain/entities/Todo';

// API URLの設定 (環境変数または固定値)
const API_URL = '/api/todos';

export class TodoApi {
  /**
   * すべてのTodoを取得する
   */
  static async getAllTodos(): Promise<Todo[]> {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Todoリスト取得エラー:', error);
      throw new Error('Todoリストの取得に失敗しました');
    }
  }

  /**
   * 指定したIDのTodoを取得する
   */
  static async getTodoById(id: number): Promise<Todo> {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`ID: ${id} のTodo取得エラー:`, error);
      throw new Error(`ID: ${id} のTodoの取得に失敗しました`);
    }
  }

  /**
   * 新しいTodoを作成する
   */
  static async createTodo(todoData: CreateTodoDTO): Promise<Todo> {
    try {
      const response = await axios.post(API_URL, todoData);
      return response.data;
    } catch (error) {
      console.error('Todo作成エラー:', error);
      throw new Error('Todoの作成に失敗しました');
    }
  }

  /**
   * 指定したTodoを更新する
   */
  static async updateTodo(id: number, todoData: UpdateTodoDTO): Promise<Todo> {
    try {
      const response = await axios.put(`${API_URL}/${id}`, todoData);
      return response.data;
    } catch (error) {
      console.error(`ID: ${id} のTodo更新エラー:`, error);
      throw new Error(`ID: ${id} のTodoの更新に失敗しました`);
    }
  }

  /**
   * Todoを完了状態に変更する
   */
  static async completeTodo(id: number): Promise<Todo> {
    try {
      const response = await axios.patch(`${API_URL}/${id}/complete`, {});
      return response.data;
    } catch (error) {
      console.error(`ID: ${id} のTodo完了状態変更エラー:`, error);
      throw new Error(`ID: ${id} のTodoの完了状態変更に失敗しました`);
    }
  }

  /**
   * 指定したTodoを削除する
   */
  static async deleteTodo(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error(`ID: ${id} のTodo削除エラー:`, error);
      throw new Error(`ID: ${id} のTodoの削除に失敗しました`);
    }
  }
}
