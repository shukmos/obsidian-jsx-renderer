// マークダウン内の ```jsx コードブロックをReactコンポーネントとしてレンダリングするプロセッサ
import { MarkdownPostProcessorContext } from "obsidian";
import { renderToContainer } from "./jsx-renderer";
import type { JsxRendererSettings } from "./settings";

/**
 * コードブロックプロセッサを登録する
 * ```jsx のコードブロックをインタラクティブなReactコンポーネントに変換
 */
export function jsxCodeBlockProcessor(
  source: string,
  el: HTMLElement,
  _ctx: MarkdownPostProcessorContext,
  settings: JsxRendererSettings
): void {
  // ソースが空なら何もしない
  if (!source.trim()) return;

  // コンテナを作成してレンダリング
  const container = el.createDiv({ cls: "jsx-renderer-container" });

  // ソース表示の切り替えボタン
  const toolbar = container.createDiv({ cls: "jsx-renderer-toolbar" });
  const toggleBtn = toolbar.createEl("button", {
    cls: "jsx-renderer-toggle-source",
    text: settings.defaultShowSource ? "レンダリングを表示" : "ソースを表示",
  });

  const renderArea = container.createDiv({ cls: "jsx-renderer-render-area" });
  const sourceArea = container.createDiv({
    cls: `jsx-renderer-source-area${settings.defaultShowSource ? "" : " jsx-renderer-hidden"}`,
  });
  sourceArea.createEl("pre").createEl("code", { text: source });

  if (settings.defaultShowSource) {
    renderArea.addClass("jsx-renderer-hidden");
  }

  let showSource = settings.defaultShowSource;
  toggleBtn.addEventListener("click", () => {
    showSource = !showSource;
    sourceArea.toggleClass("jsx-renderer-hidden", !showSource);
    renderArea.toggleClass("jsx-renderer-hidden", showSource);
    toggleBtn.textContent = showSource ? "レンダリングを表示" : "ソースを表示";
  });

  // レンダリング実行
  const cleanup = renderToContainer(renderArea, source, {
    showErrorDetails: settings.showErrorDetails,
  });

  // MutationObserverでDOMからの除去を検知してクリーンアップ
  const observer = new MutationObserver(() => {
    if (!el.isConnected) {
      cleanup();
      observer.disconnect();
    }
  });
  observer.observe(el.parentElement ?? document.body, {
    childList: true,
    subtree: true,
  });
}
