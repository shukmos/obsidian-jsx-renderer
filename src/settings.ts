// JSX Renderer プラグインの設定定義と設定画面
import { App, PluginSettingTab, Setting } from "obsidian";
import type JsxRendererPlugin from "./main";

export interface JsxRendererSettings {
  // 初期表示をソースコードにするか（false=レンダリング結果）
  defaultShowSource: boolean;
  // エラー時に詳細メッセージを表示するか
  showErrorDetails: boolean;
  // .jsxファイルビューで自動レンダリングするか
  autoRender: boolean;
}

export const DEFAULT_SETTINGS: JsxRendererSettings = {
  defaultShowSource: false,
  showErrorDetails: true,
  autoRender: true,
};

export class JsxRendererSettingTab extends PluginSettingTab {
  plugin: JsxRendererPlugin;

  constructor(app: App, plugin: JsxRendererPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName("Default to source view")
      .setDesc(
        "Show source code instead of rendered output when opening JSX content."
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.defaultShowSource)
          .onChange(async (value) => {
            this.plugin.settings.defaultShowSource = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Show error details")
      .setDesc(
        "Display detailed error messages including stack traces when rendering fails."
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.showErrorDetails)
          .onChange(async (value) => {
            this.plugin.settings.showErrorDetails = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Auto render JSX files")
      .setDesc(
        "Automatically render when opening .jsx files. When disabled, click the render button manually."
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.autoRender)
          .onChange(async (value) => {
            this.plugin.settings.autoRender = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
