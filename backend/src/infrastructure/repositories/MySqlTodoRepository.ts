import mysql from 'mysql2/promise';
import { TodoRepository } from '../../domain/repositories/TodoRepository';
import { Todo, CreateTodoDTO, UpdateTodoDTO } from '../../domain/entities/Todo';

/**
 * MySQLを使用したTodoリポジトリの実装
 */
export class MySqlTodoRepository implements TodoRepository {
  private pool: mysql.Pool;
  private connectionRetries = 5;
  private retryInterval = 5000; // 5秒

  constructor() {
    // MySQL接続プールを作成
    this.pool = mysql.createPool({
      host: process.env.DB_HOST || 'mysql',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER || 'user',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'minweb',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 30000 // 接続タイムアウトを30秒に設定
    });

    // 初期化処理を非同期で実行
    this.initializeWithRetry();
  }

  /**
   * リトライ機能付き初期化処理
   */
  private async initializeWithRetry(retries = this.connectionRetries): Promise<void> {
    try {
      console.log('MySQLデータベース接続を試みています...');
      // 接続テスト
      const connection = await this.pool.getConnection();
      console.log('MySQLデータベースに正常に接続しました');
      connection.release();
      
      // データベーススキーマの検証
      await this.validateSchema();
    } catch (error) {
      console.error('データベース接続エラー:', error);
      
      if (retries > 0) {
        console.log(`残り ${retries} 回リトライします... ${this.retryInterval/1000}秒後に再試行`);
        setTimeout(() => {
          this.initializeWithRetry(retries - 1);
        }, this.retryInterval);
      } else {
        console.error('最大リトライ回数を超えました。データベース接続に失敗しました。');
      }
    }
  }

  /**
   * データベーススキーマを検証
   */
  private async validateSchema(): Promise<void> {
    try {
      console.log('テーブル構造を検証中...');
      // テーブルの存在を確認
      const [tables] = await this.pool.execute(`SHOW TABLES LIKE 'todos'`);
      
      if ((tables as any[]).length === 0) {
        console.log('todosテーブルが見つかりません。テーブルを作成します。');
        // テーブルが存在しない場合は作成
        await this.pool.execute(`
          CREATE TABLE IF NOT EXISTS todos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(100) NOT NULL,
            completed BOOLEAN DEFAULT false,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `);
        console.log('todosテーブルを作成しました');
      } else {
        console.log('todosテーブルは既に存在します');
      }
    } catch (error) {
      console.error('テーブル構造の検証に失敗しました:', error);
      throw error;
    }
  }

  /**
   * データベース結果からTodoエンティティを作成するヘルパーメソッド
   */
  private createTodoFromRow(row: any): Todo {
    return new Todo(
      row.id,
      row.title,
      Boolean(row.completed),
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }

  /**
   * すべてのTodoを取得する
   */
  async findAll(): Promise<Todo[]> {
    try {
      console.log('すべてのTodoを取得しています...');
      const [rows] = await this.pool.execute('SELECT * FROM todos ORDER BY created_at DESC');
      console.log(`${(rows as any[]).length}件のTodoを取得しました`);
      return (rows as any[]).map(row => this.createTodoFromRow(row));
    } catch (error) {
      console.error('Todoリスト取得エラー:', error);
      throw new Error('Todoリストの取得に失敗しました');
    }
  }

  /**
   * 指定したIDのTodoを取得する
   */
  async findById(id: number): Promise<Todo | null> {
    try {
      const [rows] = await this.pool.execute('SELECT * FROM todos WHERE id = ?', [id]);
      const rowData = (rows as any[])[0];
      return rowData ? this.createTodoFromRow(rowData) : null;
    } catch (error) {
      console.error(`ID: ${id} のTodo取得エラー:`, error);
      throw new Error(`ID: ${id} のTodoの取得に失敗しました`);
    }
  }

  /**
   * 新しいTodoを作成する
   */
  async create(todoData: CreateTodoDTO): Promise<Todo> {
    try {
      const [result] = await this.pool.execute(
        'INSERT INTO todos (title) VALUES (?)',
        [todoData.title]
      );

      const id = (result as mysql.ResultSetHeader).insertId;
      const [rows] = await this.pool.execute('SELECT * FROM todos WHERE id = ?', [id]);
      const newTodo = (rows as any[])[0];
      
      return this.createTodoFromRow(newTodo);
    } catch (error) {
      console.error('Todo作成エラー:', error);
      throw new Error('Todoの作成に失敗しました');
    }
  }

  /**
   * 指定したTodoを更新する
   */
  async update(id: number, todoData: UpdateTodoDTO): Promise<Todo> {
    try {
      const updateFields: string[] = [];
      const values: any[] = [];

      if (todoData.title !== undefined) {
        updateFields.push('title = ?');
        values.push(todoData.title);
      }

      if (todoData.completed !== undefined) {
        updateFields.push('completed = ?');
        values.push(todoData.completed);
      }

      if (updateFields.length === 0) {
        throw new Error('更新するフィールドがありません');
      }

      // IDを値の配列に追加
      values.push(id);

      await this.pool.execute(
        `UPDATE todos SET ${updateFields.join(', ')} WHERE id = ?`,
        values
      );

      // 更新されたTodoを取得
      const todo = await this.findById(id);
      if (!todo) {
        throw new Error(`ID: ${id} のTodoが見つかりません`);
      }
      
      return todo;
    } catch (error) {
      console.error(`ID: ${id} のTodo更新エラー:`, error);
      throw new Error(`ID: ${id} のTodoの更新に失敗しました`);
    }
  }

  /**
   * 指定したTodoを削除する
   */
  async delete(id: number): Promise<boolean> {
    try {
      const [result] = await this.pool.execute('DELETE FROM todos WHERE id = ?', [id]);
      const affectedRows = (result as mysql.ResultSetHeader).affectedRows;
      
      return affectedRows > 0;
    } catch (error) {
      console.error(`ID: ${id} のTodo削除エラー:`, error);
      throw new Error(`ID: ${id} のTodoの削除に失敗しました`);
    }
  }
}
