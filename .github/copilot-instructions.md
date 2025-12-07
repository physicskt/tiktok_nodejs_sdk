# TikTok Shop Node.js SDK - GitHub Copilot Instructions

## プロジェクト概要

このプロジェクトは、TikTok Shop APIのNode.js SDKです。TypeScriptで記述されており、TikTok Shop APIの各種エンドポイントへのアクセスを簡素化するクライアントライブラリを提供します。

## 技術スタック

- **言語**: TypeScript 4.9.5+
- **ランタイム**: Node.js 16+
- **主要依存関係**:
  - `request`: HTTPリクエスト処理
  - `crypto`: HMAC-SHA256署名生成
  - `dotenv`: 環境変数管理

## プロジェクト構造

```
├── api/                    # API操作の実装（バージョン別）
├── client/                 # クライアント設定とインスタンス作成
├── model/                  # データモデル（APIバージョン別に整理）
├── utils/                  # ユーティリティ関数（署名生成など）
├── index.ts               # エントリーポイント
├── api.ts                 # API操作タイプマップ
└── initialize.ts          # 初期化処理
```

## コーディング規約

### 全般
- **インデント**: 2スペース
- **命名規則**:
  - クラス: PascalCase（例: `TikTokShopNodeApiClient`）
  - 関数/変数: camelCase（例: `generateSign`, `app_key`）
  - 定数: UPPER_SNAKE_CASE（例: `API_OPERATION_TYPE_MAP`）
  - ファイル名: kebab-case（例: `generate-sign.ts`）
- **インポート順序**: 標準ライブラリ → 外部パッケージ → 内部モジュール
- **エクスポート**: 明示的にエクスポート（`export *` より個別エクスポートを優先）

### TypeScript特有
- 型安全性を重視し、`any`の使用は最小限に
- インターフェースとクラスを適切に使い分け
- Genericsを活用してAPIレスポンスの型安全性を確保
- `@ts-ignore`は必要最小限の使用（コメントで理由を明記）

### API実装パターン
- APIバージョンごとに独立したファイルを作成（例: `productV202502Api.ts`）
- 各APIメソッドはHMAC-SHA256署名付きリクエストを生成
- アクセストークンとcontent-typeは各APIメソッドのパラメータとして受け取る
- オプショナルパラメータは`undefined`をデフォルト値として使用

### モデル定義
- APIバージョンとドメインごとにディレクトリを分割（例: `model/product/V202502/`）
- レスポンス/リクエストモデルは個別ファイルで定義
- ネストされたオブジェクトも独立した型として定義

## 重要な実装詳細

### 署名生成（`utils/generate-sign.ts`）
TikTok Shop APIの認証には、以下の手順でHMAC-SHA256署名を生成する必要があります：

1. `sign`と`access_token`を除く全クエリパラメータを抽出し、アルファベット順にソート
2. `{key}{value}`形式で連結
3. APIリクエストパスを先頭に追加
4. content-typeが`multipart/form-data`でない場合、リクエストボディを追加
5. 生成された文字列を`app_secret`でラップ
6. HMAC-SHA256でエンコード

### クライアント設定（`client/config.ts`）
- グローバル設定とインスタンス設定の両方をサポート
- ビルダーパターンで設定を構築可能
- `app_key`, `app_secret`, `basePath`を管理

### APIクライアント（`client/client.ts`）
- 全APIバージョンの操作にアクセス可能な統一インターフェース
- サンドボックス/本番環境の切り替えをサポート

## 新機能追加時のガイドライン

### 新しいAPIバージョン追加時
1. `api/`に新しいAPIファイルを作成（例: `productV202512Api.ts`）
2. `model/`に対応するモデルディレクトリとファイルを作成
3. `api/apis.ts`に新しいAPIクラスをエクスポート
4. `api.ts`の`API_OPERATION_TYPE_MAP`に追加
5. 既存のAPIバージョンとの一貫性を保つ

### 新しいエンドポイント追加時
1. APIメソッドを対応するバージョンのAPIファイルに追加
2. リクエスト/レスポンスモデルを定義
3. 署名生成とトークン処理を統一パターンで実装
4. README.mdに使用例を追加

## テストとデバッグ

- テストアカウントとトークンを使用して開発・テスト
- 環境変数（`.env`）を活用してapp_keyとapp_secretを管理
- サンドボックス環境で十分にテストしてから本番環境へ

## セキュリティ考慮事項

- `app_secret`は決してバージョン管理にコミットしない
- アクセストークンは安全に保管
- 署名生成アルゴリズムはTikTok Shop公式仕様に準拠
- HTTPSを使用してAPIと通信

## ドキュメント

- 公式ドキュメント: https://partner.tiktokshop.com/docv2
- 各APIメソッドにはJSDocコメントを追加
- README.mdは最新の使用例とセットアップ手順を維持

## パッケージ管理

- `package.json`の依存関係は最小限に保つ
- メジャーバージョンアップデートは慎重に検証
- TypeScriptのバージョンは4.9.5以上を維持

## コミットメッセージルール

プロジェクトでは、明確で一貫性のあるコミットメッセージを使用します。以下のプレフィックスを使用してください：

### プレフィックス

- **feat**: 新機能の追加
  - 例: `feat: Add ProductV202512Api support`
  - 例: `feat: Implement new product search endpoint`

- **fix**: バグ修正
  - 例: `fix: Correct signature generation for multipart requests`
  - 例: `fix: Handle undefined response in error cases`

- **docs**: ドキュメントのみの変更
  - 例: `docs: Update README with new API examples`
  - 例: `docs: Add JSDoc comments to ProductV202502Api`

- **refactor**: リファクタリング（機能追加やバグ修正を含まない）
  - 例: `refactor: Simplify generateSign function`
  - 例: `refactor: Extract common request logic`

- **test**: テストの追加や修正
  - 例: `test: Add unit tests for generateSign`
  - 例: `test: Update integration tests for OrderV202407Api`

- **chore**: ビルドプロセスやツールの変更
  - 例: `chore: Update dependencies to latest versions`
  - 例: `chore: Add build script to package.json`

- **ci**: CI/CD設定の変更
  - 例: `ci: Add GitHub Actions workflow`

### フォーマット

```
<type>: <subject>

[optional body]

[optional footer]
```

### 例

```
feat: Add order cancellation endpoint to OrderV202507Api

Implement the new order cancellation API endpoint
with proper signature generation and error handling.

Closes #123
```

### ルール

- subjectは小文字で始め、末尾にピリオドを付けない
- subjectは命令形で書く（"Added" ではなく "Add"）
- 1行目は50文字以内を推奨
- bodyは必要に応じて詳細を記述（72文字で改行）
- 関連するissue番号があれば、footerに記載
