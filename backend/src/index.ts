import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import todoRoutes from './interfaces/controllers/todoController';

// 環境変数の読み込み
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ミドルウェアの設定
app.use(cors());
app.use(express.json());

// ルートの設定
app.use('/api/todos', todoRoutes);

// ヘルスチェック用のエンドポイント
app.get('/api/status', (req, res) => {
  res.status(200).json({ status: 'running' });
});

// サーバーの起動
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`サーバーが起動しました: http://localhost:${PORT}`);
  });
}

export default app;
