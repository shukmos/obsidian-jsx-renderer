// .jsxファイルをObsidianで開いた時にレンダリング結果を表示するビュー
import { TextFileView, WorkspaceLeaf } from "obsidian";
import { renderToContainer } from "./jsx-renderer";

export const JSX_VIEW_TYPE = "jsx-view";

export class JsxFileView extends TextFileView {
  private cleanup: (() => void) | null = null;
  private renderContainer: HTMLElement | null = null;
  private sourceContainer: HTMLElement | null = null;
  private showSource = false;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
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

    this.renderJsx();
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
      text: "ソースを表示",
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
    this.sourceContainer.style.display = "none";
  }

  private updateView(): void {
    if (!this.renderContainer || !this.sourceContainer) return;

    if (this.showSource) {
      this.renderContainer.style.display = "none";
      this.sourceContainer.style.display = "block";
      this.sourceContainer.empty();
      this.sourceContainer.createEl("pre").createEl("code", {
        text: this.data,
      });
    } else {
      this.renderContainer.style.display = "block";
      this.sourceContainer.style.display = "none";
    }
  }

  private renderJsx(): void {
    if (!this.renderContainer) return;
    this.cleanupRender();
    this.renderContainer.empty();

    if (!this.data.trim()) return;

    this.cleanup = renderToContainer(this.renderContainer, this.data);
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
