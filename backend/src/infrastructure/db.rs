// データベース関連の機能を提供するモジュール
// 必要に応じて実装を追加していく

use sqlx::MySqlPool;

// PostgreSQLプールの型エイリアス
pub type DbPool = MySqlPool; 