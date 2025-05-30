/**
 * Todoエンティティのインターフェース
 */
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Todo作成時のデータ型
 */
export interface CreateTodoDTO {
  title: string;
}

/**
 * Todo更新時のデータ型
 */
export interface UpdateTodoDTO {
  title?: string;
  completed?: boolean;
}
