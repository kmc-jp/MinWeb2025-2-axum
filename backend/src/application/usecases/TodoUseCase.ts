import { TodoRepository } from '../../domain/repositories/TodoRepository';
import { Todo, CreateTodoDTO, UpdateTodoDTO } from '../../domain/entities/Todo';

/**
 * Todoのユースケース実装
 * ビジネスロジックを実装します
 */
export class TodoUseCase {
  // 依存性注入
  constructor(private todoRepository: TodoRepository) {}

  /**
   * すべてのTodoを取得する
   * @returns Todoの配列
   */
  async getAllTodos(): Promise<Todo[]> {
    return this.todoRepository.findAll();
  }

  /**
   * 指定したIDのTodoを取得する
   * @param id Todo ID
   * @returns Todo オブジェクトまたはnull
   * @throws Error IDが存在しない場合
   */
  async getTodoById(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error(`ID: ${id} のTodoは存在しません`);
    }
    return todo;
  }

  /**
   * 新しいTodoを作成する
   * @param todoData 作成するTodoのデータ
   * @returns 作成されたTodo
   */
  async createTodo(todoData: CreateTodoDTO): Promise<Todo> {
    return this.todoRepository.create(todoData);
  }

  /**
   * Todoを更新する
   * @param id 更新するTodoのID
   * @param todoData 更新データ
   * @returns 更新後のTodo
   * @throws Error IDが存在しない場合
   */
  async updateTodo(id: number, todoData: UpdateTodoDTO): Promise<Todo> {
    const exists = await this.todoRepository.findById(id);
    if (!exists) {
      throw new Error(`ID: ${id} のTodoは存在しません`);
    }
    return this.todoRepository.update(id, todoData);
  }

  /**
   * Todoを完了状態に変更する
   * @param id 対象のTodoのID
   * @returns 更新後のTodo
   * @throws Error IDが存在しない場合
   */
  async completeTodo(id: number): Promise<Todo> {
    const exists = await this.todoRepository.findById(id);
    if (!exists) {
      throw new Error(`ID: ${id} のTodoは存在しません`);
    }
    return this.todoRepository.update(id, { completed: true });
  }

  /**
   * Todoを削除する
   * @param id 削除するTodoのID
   * @returns 削除が成功したかどうか
   * @throws Error IDが存在しない場合
   */
  async deleteTodo(id: number): Promise<boolean> {
    const exists = await this.todoRepository.findById(id);
    if (!exists) {
      throw new Error(`ID: ${id} のTodoは存在しません`);
    }
    return this.todoRepository.delete(id);
  }
}
