import axios from 'axios';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../../domain/entities/Todo';

// API基本URL
const API_BASE_URL = '/api/todos';

/**
 * TodoのAPI通信を担当するクラス
 */
export class TodoApiClient {
  /**
   * すべてのTodoを取得
   */
  static async getAllTodos(): Promise<Todo[]> {
    try {
      const response = await axios.get<Todo[]>(API_BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Todoリスト取得エラー:', error);
      throw new Error('Todoリストの取得に失敗しました');
    }
  }

  /**
   * IDでTodoを取得
   */
  static async getTodoById(id: number): Promise<Todo> {
    try {
      const response = await axios.get<Todo>(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`ID: ${id} のTodo取得エラー:`, error);
      throw new Error(`ID: ${id} のTodoの取得に失敗しました`);
    }
  }

  /**
   * 新しいTodoを作成
   */
  static async createTodo(todoData: CreateTodoRequest): Promise<Todo> {
    try {
      const response = await axios.post<Todo>(API_BASE_URL, todoData);
      return response.data;
    } catch (error) {
      console.error('Todo作成エラー:', error);
      throw new Error('Todoの作成に失敗しました');
    }
  }

  /**
   * Todoを更新
   */
  static async updateTodo(id: number, todoData: UpdateTodoRequest): Promise<Todo> {
    try {
      const response = await axios.put<Todo>(`${API_BASE_URL}/${id}`, todoData);
      return response.data;
    } catch (error) {
      console.error(`ID: ${id} のTodo更新エラー:`, error);
      throw new Error(`ID: ${id} のTodoの更新に失敗しました`);
    }
  }

  /**
   * Todoを完了状態に変更
   */
  static async completeTodo(id: number): Promise<Todo> {
    try {
      const response = await axios.patch<Todo>(`${API_BASE_URL}/${id}/complete`, {});
      return response.data;
    } catch (error) {
      console.error(`ID: ${id} のTodo完了状態変更エラー:`, error);
      throw new Error(`ID: ${id} のTodoの完了状態変更に失敗しました`);
    }
  }

  /**
   * Todoを削除
   */
  static async deleteTodo(id: number): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
      console.error(`ID: ${id} のTodo削除エラー:`, error);
      throw new Error(`ID: ${id} のTodoの削除に失敗しました`);
    }
  }
}
