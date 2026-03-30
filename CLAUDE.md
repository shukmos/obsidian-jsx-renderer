# obsidian-jsx-renderer

Obsidian上でJSXアーティファクトをReactコンポーネントとしてレンダリングするプラグイン。

## 技術スタック

- TypeScript + React 18 + ReactDOM
- Sucrase（ランタイムJSXトランスパイル）
- esbuild（バンドル）
- Obsidian Plugin API

## フォルダ構成

```
src/
  main.ts           # プラグインエントリポイント
  jsx-renderer.ts   # JSX→React変換・レンダリングコア
  jsx-codeblock.ts  # マークダウンコードブロック処理
  jsx-view.ts       # .jsxファイルビュー
docs/               # プロジェクトドキュメント
main.js             # ビルド成果物（コミット対象）
styles.css          # プラグインスタイル
manifest.json       # Obsidianプラグインマニフェスト
```

## ビルド

```bash
npm run dev      # 開発ビルド（watch）
npm run build    # 本番ビルド（型チェック + バンドル）
```

ビルド成果物は `main.js`。Obsidianプラグインの慣習でリポジトリにコミットする。

## レンダリングの仕組み

1. Sucraseで JSX → JS に変換
2. `require("react")` をモックして内蔵Reactを返す
3. `new Function()` で評価、`export default` コンポーネントを取得
4. `createRoot()` でレンダリング

## 対象JSXの前提

- `export default function Component()` 形式
- React Hooks使用可
- インラインスタイル
- 外部依存なし（React本体のみ）
