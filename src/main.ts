// Obsidian JSX Renderer プラグイン
// ClaudeのJSXアーティファクトをObsidian上でインタラクティブにレンダリングする
import { Plugin } from "obsidian";
import { jsxCodeBlockProcessor } from "./jsx-codeblock";
import { JsxFileView, JSX_VIEW_TYPE } from "./jsx-view";
import {
  JsxRendererSettings,
  DEFAULT_SETTINGS,
  JsxRendererSettingTab,
} from "./settings";

export default class JsxRendererPlugin extends Plugin {
  settings: JsxRendererSettings = DEFAULT_SETTINGS;

  async onload(): Promise<void> {
    await this.loadSettings();

    // .jsxファイル用のカスタムビューを登録
    this.registerView(
      JSX_VIEW_TYPE,
      (leaf) => new JsxFileView(leaf, this.settings)
    );

    // .jsxファイルの拡張子を登録
    this.registerExtensions(["jsx"], JSX_VIEW_TYPE);

    // マークダウン内の```jsxコードブロックプロセッサを登録
    this.registerMarkdownCodeBlockProcessor("jsx", (source, el, ctx) => {
      jsxCodeBlockProcessor(source, el, ctx, this.settings);
    });

    // 設定タブを追加
    this.addSettingTab(new JsxRendererSettingTab(this.app, this));
  }

  async loadSettings(): Promise<void> {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }
}
