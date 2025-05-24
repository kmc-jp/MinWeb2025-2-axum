-- todosテーブルを作成するスクリプト
CREATE TABLE IF NOT EXISTS todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- サンプルデータの挿入
INSERT INTO todos (title, completed) VALUES
  ('買い物をする', false),
  ('メールをチェックする', true),
  ('レポートを作成する', false),
  ('会議の準備をする', false),
  ('プロジェクト計画を立てる', true);
