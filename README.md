# MinWeb2025-2

## プロジェクト概要
MinWeb2025はシンプルなWebアプリケーションのサンプルプロジェクトです。フロントエンドはReact、バックエンドはNode.js (Express)、データベースはMySQLを使用しています。

## ディレクトリ構成

```
MinWeb2025-2/
├── backend/                 # バックエンドアプリケーション
│   ├── src/
│   │   ├── domain/          # ドメイン層
│   │   │   ├── entities/    # ビジネスエンティティ
│   │   │   └── repositories/ # リポジトリインターフェース
│   │   ├── application/     # アプリケーション層
│   │   │   └── usecases/    # ユースケース
│   │   ├── interfaces/      # インターフェース層
│   │   │   └── controllers/ # コントローラー
│   │   ├── infrastructure/  # インフラストラクチャ層
│   │   │   └── repositories/ # リポジトリ実装
│   │   ├── routes/          # APIルート定義
│   │   └── index.ts         # アプリケーションエントリーポイント
│   ├── tests/               # テスト
│   │   ├── unit/            # ユニットテスト
│   │   ├── integration/     # 統合テスト
│   │   └── api/             # APIテスト
│   └── package.json         # 依存関係定義
│
├── frontend/                 # フロントエンドアプリケーション
│   ├── src/
│   │   ├── domain/          # ドメイン層
│   │   │   └── entities/    # ビジネスエンティティ
│   │   ├── infrastructure/  # インフラストラクチャ層
│   │   │   └── api/         # API通信処理
│   │   ├── presentation/    # プレゼンテーション層
│   │   │   ├── components/  # 共通UIコンポーネント
│   │   │   └── pages/       # ページコンポーネント
│   │   ├── App.tsx          # メインアプリケーションコンポーネント
│   │   └── index.tsx        # エントリーポイント
│   ├── __tests__/           # テスト
│   │   ├── components/      # コンポーネントテスト
│   │   └── hooks/           # カスタムフックテスト
│   └── package.json         # 依存関係定義
│
├── nginx/                    # Nginx設定
│   ├── conf.d/              # Nginx構成ファイル
│   └── logs/                # Nginxログファイル
│
├── mysql/                    # MySQL設定
│   └── init/                # データベース初期化スクリプト
│
└── docker-compose.yml        # Dockerコンテナ定義
```

## アーキテクチャ
このプロジェクトはドメイン駆動設計（DDD）とクリーンアーキテクチャの原則に基づいて構築されています。

### バックエンド構成
バックエンドは以下のレイヤーで構成されています：

#### ドメイン層
- `domain/entities`: ビジネスオブジェクトとビジネスルールを定義します
- `domain/repositories`: リポジトリのインターフェースを定義します

#### アプリケーション層
- `application/usecases`: アプリケーションのユースケースを実装します
  - 各ユースケースは単一の責任を持ちます

#### インターフェース層
- `interfaces/controllers`: HTTPリクエストを処理し、適切なユースケースを呼び出します

#### インフラストラクチャ層
- `infrastructure/repositories`: リポジトリの具体的な実装（MySQLなど）を提供します

### フロントエンド構成
フロントエンドも類似のレイヤードアーキテクチャを採用しています：

#### ドメイン層
- `domain/entities`: ビジネスオブジェクトを定義します

#### インフラストラクチャ層
- `infrastructure/api`: APIとの通信を処理します

#### プレゼンテーション層
- `presentation/components`: UI部品を提供します
- `presentation/pages`: ページコンポーネントを提供します

## 技術スタック
- フロントエンド: React, TypeScript
- バックエンド: Node.js, Express, TypeScript
- データベース: MySQL
- 開発/デプロイ: Docker, docker-compose

## 実行方法
```bash
# プロジェクトのルートディレクトリで以下を実行
docker-compose up -d
```

アプリケーションは http://localhost にアクセスして利用できます。
APIは http://localhost/api でアクセス可能です。

## 開発ガイド

### コーディング規約

#### 全般
- インデントはスペース2文字を使用
- セミコロンは必須
- 命名規則：
  - クラス: PascalCase (例: `UserController`)
  - 変数/関数/メソッド: camelCase (例: `getAllUsers`)
  - 定数: UPPER_SNAKE_CASE (例: `API_URL`)
  - ファイル名: PascalCaseまたはcamelCase (コンテキストに応じて)

#### TypeScript
- `strict`モードを有効に
- タイプ推論よりも明示的な型定義を優先
- インターフェースを活用しプログラムの契約を明確に

#### React
- 状態管理は必要に応じてReactのhooksを使用
- コンポーネントはできるだけ純粋関数として実装
- Propsの型は明示的に定義

### Docker環境

#### 構成
- `nodejs`: バックエンドサービス (Node.js/Express)
- `frontend`: フロントエンドビルド環境 (React)
- `nginx`: Webサーバー (静的ファイル配信・リバースプロキシ)
- `mysql`: データベースサービス

#### 開発環境の操作
```bash
# 初回起動
docker-compose up -d

# コンテナ一覧の確認
docker-compose ps

# ログの確認
docker-compose logs -f [サービス名]

# 環境の停止
docker-compose down

# ボリュームも含めて完全に環境を削除
docker-compose down -v
```

### フロントエンド開発 (React)

#### 開発サーバーの起動（コンテナ外で開発する場合）
```bash
cd frontend
npm install
npm start
```

#### ビルド
```bash
cd frontend
npm run build
```

#### テスト実行
```bash
cd frontend
npm test
```

#### 主要ファイル
- `src/index.tsx`: エントリーポイント
- `src/App.tsx`: メインアプリケーションコンポーネント
- `src/domain/entities/`: ドメインオブジェクト
- `src/infrastructure/api/`: API通信処理
- `src/presentation/`: UI関連のコンポーネント

### バックエンド開発 (Node.js)

#### 開発サーバーの起動（コンテナ外で開発する場合）
```bash
cd backend
npm install
npm run dev
```

#### ビルド
```bash
cd backend
npm run build
```

#### テスト実行
```bash
cd backend
npm test
```

#### 主要ファイル
- `src/index.ts`: エントリーポイント
- `src/routes/`: APIルート定義
- `src/domain/`: ドメイン層（エンティティ、リポジトリインターフェース）
- `src/application/`: アプリケーション層（ユースケース）
- `src/interfaces/`: インターフェース層（コントローラー）
- `src/infrastructure/`: インフラストラクチャ層（リポジトリ実装など）

## テスト戦略

### バックエンドテスト
テストフレームワークとしてJestを採用しています。

#### テストの実行
```bash
cd backend
npm test                  # 全テストを実行
npm test -- --watch       # ウォッチモードで実行（ファイル変更時に自動実行）
npm test -- -t "テスト名" # 特定のテストのみ実行
```

#### テストの種類
1. **ユニットテスト**: 個々の関数やクラスの挙動をテスト
   - 場所: `backend/src/tests/unit/`
   - 命名規則: `*.test.ts`
   
2. **統合テスト**: 複数のコンポーネントの連携をテスト
   - 場所: `backend/src/tests/integration/`
   - 命名規則: `*.test.ts`
   
3. **APIテスト**: エンドポイントの挙動をテスト
   - 場所: `backend/src/tests/api/`
   - 命名規則: `*.test.ts`
   - `supertest`を使用してHTTPリクエストをシミュレート

#### テストの作成方法
```typescript
// APIテストの例
import request from 'supertest';
import app from '../app';

describe('API Tests', () => {
  test('GET /api/status should return status', async () => {
    const response = await request(app).get('/api/status');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'running');
  });
});
```

### フロントエンドテスト
React Testing Libraryを使用したコンポーネントテストを実施します。

#### テストの実行
```bash
cd frontend
npm test                  # インタラクティブモードで全テストを実行
npm test -- --watchAll=false # 一度だけ全テストを実行
npm test -- -t "テスト名" # 特定のテストのみ実行
```

#### テストの種類
1. **コンポーネントテスト**: UIコンポーネントの挙動をテスト
   - 場所: `frontend/src/__tests__/components/`
   - 命名規則: `*.test.tsx`
   
2. **カスタムフックテスト**: 独自フックの挙動をテスト
   - 場所: `frontend/src/__tests__/hooks/`
   - 命名規則: `*.test.ts`

3. **E2Eテスト**: ユーザーフローを自動化テスト (Cypress)
   - 場所: `frontend/cypress/integration/`
   - 命名規則: `*.spec.js`

#### テストの作成方法
```jsx
// コンポーネントテストの例
import { render, screen } from '@testing-library/react';
import HomePage from '../HomePage';

test('renders home page heading', () => {
  render(<HomePage />);
  expect(screen.getByText('Welcome to MinWeb2025')).toBeInTheDocument();
});
```

### モック
外部APIや依存関係のモックには、Jest のモック機能を活用します。

```typescript
// APIクライアントのモック例
jest.mock('../api/apiClient', () => ({
  getData: jest.fn().mockResolvedValue({
    name: 'Test Data'
  })
}));
```

## デプロイ

### 本番環境へのデプロイ
```bash
# 本番環境用のビルド・デプロイ
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### データベース

#### マイグレーション
データベースの初期化スクリプトは `mysql/init/` ディレクトリに配置されています。

#### 接続情報
- ホスト: `localhost` (開発PCの場合) または `mysql` (コンテナ内から)
- ユーザー: `user`
- パスワード: `password`
- データベース名: `minweb`
- ポート: `3306`

## CI/CD

継続的インテグレーションと継続的デリバリーは、GitHub Actionsを使って自動化されています。

### シークレットの設定

GitHub Actionsで使用するシークレットを設定する必要があります。以下のシークレットをリポジトリの設定から追加してください：

1. `SSH_PRIVATE_KEY`: 本番サーバーへ接続するためのSSH秘密鍵
2. `SSH_KNOWN_HOSTS`: 本番サーバーのSSHフィンガープリント
3. `SERVER_HOST`: 本番サーバーのホスト名またはIPアドレス
4. `SERVER_USER`: 本番サーバーのユーザー名

### シークレットの取得方法

#### SSH_PRIVATE_KEY
```bash
cat ~/.ssh/id_rsa
```

#### SSH_KNOWN_HOSTS
```bash
ssh-keyscan -H YOUR_SERVER_IP >> ~/.ssh/known_hosts
cat ~/.ssh/known_hosts
```

### 本番サーバーの準備

本番サーバーでは以下の準備が必要です：

1. Node.jsとnpmのインストール
2. PM2のインストール (`npm install -g pm2`)
3. デプロイ先ディレクトリの作成 (`mkdir -p ~/minweb`)
4. SSH公開鍵の設定

主な自動化ステップ:
1. コードの静的解析とバックエンドのテスト実行
2. アプリケーションのビルド
3. 本番環境へのデプロイ (mainブランチへのマージ時のみ)

### 注意事項

- デプロイスクリプトは基本的なものです。必要に応じてカスタマイズしてください。
- 本番環境の環境変数は別途設定する必要があります。