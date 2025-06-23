use axum::{Router, routing::get};
// use dotenvy::dotenv;
use sqlx::MySqlPool;
use std::env;
use std::net::SocketAddr;
use tokio::net::TcpListener;
use tracing::{info, Level};
use tracing_subscriber::FmtSubscriber;

use crate::infrastructure::todo_repository::TodoRepositoryImpl;
use crate::presentation::handlers::todo_handler::create_todo_router;
use crate::usecase::todo_usecase::TodoUsecase;

mod domain;
mod infrastructure;
mod presentation;
mod usecase;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // ✅ .env 読み込み
    // dotenv().ok();

    // ✅ ロギング設定
    let subscriber = FmtSubscriber::builder()
        .with_max_level(Level::INFO)
        .finish();
    tracing::subscriber::set_global_default(subscriber)?;

    // ✅ データベース接続
    let database_url = env::var("DATABASE_URL")?;
    println!("Connecting to database at: {}", database_url);
    let pool = MySqlPool::connect(&database_url).await?;

    // ✅ 依存関係のセットアップ
    let todo_repository = TodoRepositoryImpl::new(pool.clone());
    let todo_service = TodoUsecase::new(todo_repository);

    // ✅ ルーターの作成
    let app = Router::new()
        .route("/api/", get(|| async { "Hello, Axum!!!" }))
        .nest("/api/todos", create_todo_router(todo_service));

    // ✅ サーバーの起動
    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    info!("🚀　Backend Server running");
    let listener = TcpListener::bind(addr).await?;
    axum::serve(listener, app.into_make_service()).await?;

    Ok(())
}