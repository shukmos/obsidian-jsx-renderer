// .jsxファイルをObsidianで開いた時にレンダリング結果を表示するビュー
import { TextFileView, WorkspaceLeaf } from "obsidian";
import { renderToContainer } from "./jsx-renderer";
import type { JsxRendererSettings } from "./settings";

export const JSX_VIEW_TYPE = "jsx-view";

export class JsxFileView extends TextFileView {
  private cleanup: (() => void) | null = null;
  private renderContainer: HTMLElement | null = null;
  private sourceContainer: HTMLElement | null = null;
  private showSource: boolean;
  private settings: JsxRendererSettings;

  constructor(leaf: WorkspaceLeaf, settings: JsxRendererSettings) {
    super(leaf);
    this.settings = settings;
    this.showSource = settings.defaultShowSource;
  }

  getViewType(): string {
    return JSX_VIEW_TYPE;
  }

  getDisplayText(): string {
    return this.file?.basename ?? "JSX";
  }

  getIcon(): string {
    return "code";
  }

  getViewData(): string {
    return this.data;
  }

  setViewData(data: string, clear: boolean): void {
    this.data = data;

    if (clear) {
      this.contentEl.empty();
      this.buildUI();
    }

    if (this.showSource) {
      this.updateView();
    } else if (this.settings.autoRender) {
      this.renderJsx();
    } else {
      this.showPlaceholder();
    }
  }

  clear(): void {
    this.data = "";
    this.cleanupRender();
  }

  private buildUI(): void {
    const toolbar = this.contentEl.createDiv({ cls: "jsx-view-toolbar" });

    // ソース/レンダリング切り替え
    const toggleBtn = toolbar.createEl("button", {
      cls: "jsx-view-toggle",
      text: this.showSource ? "レンダリングを表示" : "ソースを表示",
    });
    toggleBtn.addEventListener("click", () => {
      this.showSource = !this.showSource;
      this.updateView();
      toggleBtn.textContent = this.showSource
        ? "レンダリングを表示"
        : "ソースを表示";
    });

    // リロードボタン
    const reloadBtn = toolbar.createEl("button", {
      cls: "jsx-view-reload",
      text: "再レンダリング",
    });
    reloadBtn.addEventListener("click", () => {
      this.renderJsx();
    });

    this.renderContainer = this.contentEl.createDiv({
      cls: "jsx-renderer-container jsx-view-render",
    });
    this.sourceContainer = this.contentEl.createDiv({
      cls: "jsx-view-source",
    });

    // 初期表示状態を設定
    if (this.showSource) {
      this.renderContainer.addClass("jsx-renderer-hidden");
    } else {
      this.sourceContainer.addClass("jsx-renderer-hidden");
    }
  }

  private updateView(): void {
    if (!this.renderContainer || !this.sourceContainer) return;

    this.renderContainer.toggleClass("jsx-renderer-hidden", this.showSource);
    this.sourceContainer.toggleClass("jsx-renderer-hidden", !this.showSource);

    if (this.showSource) {
      this.sourceContainer.empty();
      this.sourceContainer.createEl("pre").createEl("code", {
        text: this.data,
      });
    }
  }

  private renderJsx(): void {
    if (!this.renderContainer) return;
    this.cleanupRender();
    this.renderContainer.empty();

    if (!this.data.trim()) return;

    this.cleanup = renderToContainer(this.renderContainer, this.data, {
      showErrorDetails: this.settings.showErrorDetails,
    });
  }

  private showPlaceholder(): void {
    if (!this.renderContainer) return;
    this.cleanupRender();
    this.renderContainer.empty();
    this.renderContainer.createDiv({
      cls: "jsx-renderer-placeholder",
      text: "「再レンダリング」ボタンを押してレンダリングを開始",
    });
  }

  private cleanupRender(): void {
    if (this.cleanup) {
      this.cleanup();
      this.cleanup = null;
    }
  }

  onunload(): void {
    this.cleanupRender();
  }
}
