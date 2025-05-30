import { Todo, CreateTodoDTO, UpdateTodoDTO } from '../entities/Todo';

/**
 * Todoリポジトリインターフェース
 * データアクセス操作の抽象化を定義します
 */
export interface TodoRepository {
  /**
   * すべてのTodoを取得する
   * @returns Todoの配列
   */
  findAll(): Promise<Todo[]>;

  /**
   * 指定したIDのTodoを取得する
   * @param id Todo ID
   * @returns Todo オブジェクトまたはnull
   */
  findById(id: number): Promise<Todo | null>;

  /**
   * 新しいTodoを作成する
   * @param todoData 新規Todo作成用データ
   * @returns 作成されたTodoオブジェクト
   */
  create(todoData: CreateTodoDTO): Promise<Todo>;

  /**
   * 指定したTodoを更新する
   * @param id 更新対象のTodo ID
   * @param todoData 更新データ
   * @returns 更新後のTodoオブジェクト
   */
  update(id: number, todoData: UpdateTodoDTO): Promise<Todo>;

  /**
   * 指定したTodoを削除する
   * @param id 削除対象のTodo ID
   * @returns 削除が成功したかどうか
   */
  delete(id: number): Promise<boolean>;
}
