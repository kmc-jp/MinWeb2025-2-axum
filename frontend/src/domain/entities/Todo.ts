/**
 * Todoエンティティインターフェース
 */
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 新規Todo作成用インターフェース
 */
export interface CreateTodoRequest {
  title: string;
}

/**
 * Todo更新用インターフェース
 */
export interface UpdateTodoRequest {
  title?: string;
  completed?: boolean;
}
