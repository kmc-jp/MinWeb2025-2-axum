/**
 * Todoエンティティ
 * ビジネスロジックとドメインのルールを実装します
 */
export class Todo {
  constructor(
    private _id: number,
    private _title: string,
    private _completed: boolean = false,
    private _createdAt: Date = new Date(),
    private _updatedAt: Date = new Date()
  ) {
    this.validateTitle(_title);
  }

  // IDのゲッター
  get id(): number {
    return this._id;
  }

  // タイトルのゲッターとセッター
  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this.validateTitle(value);
    this._title = value;
    this._updatedAt = new Date();
  }

  // 完了状態のゲッターとセッター
  get completed(): boolean {
    return this._completed;
  }

  set completed(value: boolean) {
    this._completed = value;
    this._updatedAt = new Date();
  }

  // 作成日時のゲッター
  get createdAt(): Date {
    return this._createdAt;
  }

  // 更新日時のゲッター
  get updatedAt(): Date {
    return this._updatedAt;
  }

  // タスクを完了としてマークするメソッド
  complete(): void {
    this._completed = true;
    this._updatedAt = new Date();
  }

  // タスクを未完了として戻すメソッド
  uncomplete(): void {
    this._completed = false;
    this._updatedAt = new Date();
  }

  // データ転送用のオブジェクトに変換するメソッド
  toDTO(): TodoDTO {
    return {
      id: this._id,
      title: this._title,
      completed: this._completed,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString()
    };
  }

  // バリデーションロジック
  private validateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new Error('タイトルは必須項目です');
    }
    
    if (title.length > 100) {
      throw new Error('タイトルは100文字以内で入力してください');
    }
  }
}

// データ転送用のインターフェース
export interface TodoDTO {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

// 新規作成用のインターフェース
export interface CreateTodoDTO {
  title: string;
}

// 更新用のインターフェース
export interface UpdateTodoDTO {
  title?: string;
  completed?: boolean;
}
