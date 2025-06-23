use crate::domain::models::todo::Todo;
use crate::domain::repositories::todo_repository::TodoRepository;
use crate::infrastructure::db::DbPool;
use async_trait::async_trait;
use uuid::Uuid;

#[derive(Clone)]
pub struct TodoRepositoryImpl {
    pub pool: DbPool,
}

impl TodoRepositoryImpl {
    pub fn new(pool: DbPool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl TodoRepository for TodoRepositoryImpl {
    async fn find_all(&self) -> Result<Vec<Todo>, sqlx::Error> {
        let todos = sqlx::query_as::<_, Todo>(
            "SELECT id, title, completed, created_at, updated_at FROM todos",
        )
        .fetch_all(&self.pool)
        .await?;
        Ok(todos)
    }

    async fn find_by_id(&self, id: Uuid) -> Result<Option<Todo>, sqlx::Error> {
        let todo = sqlx::query_as::<_, Todo>(
            "SELECT id, title, completed, created_at, updated_at FROM todos WHERE id = ?",
        )
        .bind(id)
        .fetch_optional(&self.pool)
        .await?;
        Ok(todo)
    }

    async fn create(&self, todo: Todo) -> Result<Todo, sqlx::Error> {
        sqlx::query(
            "INSERT INTO todos (id, title, completed, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?)",
        )
        .bind(todo.id)
        .bind(&todo.title)
        .bind(todo.completed)
        .bind(todo.created_at)
        .bind(todo.updated_at)
        .execute(&self.pool)
        .await?;
        // MySQLにはRETURNING句がないため、引数で受け取ったtodoをそのまま返す
        Ok(todo)
    }

    async fn update(&self, todo: Todo) -> Result<Todo, sqlx::Error> {
        // MySQLにはRETURNING句がないため、まず更新処理を行う
        sqlx::query(
            "UPDATE todos SET title = ?, completed = ?, updated_at = NOW()
             WHERE id = ?",
        )
        .bind(&todo.title)
        .bind(todo.completed)
        .bind(todo.id)
        .execute(&self.pool)
        .await?;

        // 更新後のデータを取得するために、find_by_idを呼び出す
        let updated_todo = self.find_by_id(todo.id).await?.ok_or_else(|| {
            sqlx::Error::RowNotFound
        })?;

        Ok(updated_todo)
    }

    async fn delete(&self, id: Uuid) -> Result<(), sqlx::Error> {
        sqlx::query("DELETE FROM todos WHERE id = ?")
            .bind(id)
            .execute(&self.pool)
            .await?;
        Ok(())
    }
}