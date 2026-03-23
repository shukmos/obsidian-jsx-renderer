// Obsidian JSX Renderer プラグイン
// ClaudeのJSXアーティファクトをObsidian上でインタラクティブにレンダリングする
import { Plugin } from "obsidian";
import { jsxCodeBlockProcessor } from "./jsx-codeblock";
import { JsxFileView, JSX_VIEW_TYPE } from "./jsx-view";

export default class JsxRendererPlugin extends Plugin {
  async onload(): Promise<void> {
    // .jsxファイル用のカスタムビューを登録
    this.registerView(JSX_VIEW_TYPE, (leaf) => new JsxFileView(leaf));

    // .jsxファイルの拡張子を登録
    this.registerExtensions(["jsx"], JSX_VIEW_TYPE);

    // マークダウン内の```jsxコードブロックプロセッサを登録
    this.registerMarkdownCodeBlockProcessor("jsx", jsxCodeBlockProcessor);
  }

  onunload(): void {
    // ビューのデタッチ
    this.app.workspace.detachLeavesOfType(JSX_VIEW_TYPE);
  }
}
