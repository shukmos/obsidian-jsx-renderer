// マークダウン内の ```jsx コードブロックをReactコンポーネントとしてレンダリングするプロセッサ
import { MarkdownPostProcessorContext } from "obsidian";
import { renderToContainer } from "./jsx-renderer";

/**
 * コードブロックプロセッサを登録する
 * ```jsx のコードブロックをインタラクティブなReactコンポーネントに変換
 */
export function jsxCodeBlockProcessor(
  source: string,
  el: HTMLElement,
  _ctx: MarkdownPostProcessorContext
): void {
  // ソースが空なら何もしない
  if (!source.trim()) return;

  // コンテナを作成してレンダリング
  const container = el.createDiv({ cls: "jsx-renderer-container" });

  // ソース表示の切り替えボタン
  const toolbar = container.createDiv({ cls: "jsx-renderer-toolbar" });
  const toggleBtn = toolbar.createEl("button", {
    cls: "jsx-renderer-toggle-source",
    text: "ソースを表示",
  });

  const renderArea = container.createDiv({ cls: "jsx-renderer-render-area" });
  const sourceArea = container.createDiv({ cls: "jsx-renderer-source-area" });
  sourceArea.style.display = "none";
  sourceArea.createEl("pre").createEl("code", { text: source });

  let showSource = false;
  toggleBtn.addEventListener("click", () => {
    showSource = !showSource;
    sourceArea.style.display = showSource ? "block" : "none";
    renderArea.style.display = showSource ? "none" : "block";
    toggleBtn.textContent = showSource ? "レンダリングを表示" : "ソースを表示";
  });

  // レンダリング実行
  const cleanup = renderToContainer(renderArea, source);

  // MutationObserverでDOMからの除去を検知してクリーンアップ
  const observer = new MutationObserver(() => {
    if (!el.isConnected) {
      cleanup();
      observer.disconnect();
    }
  });
  observer.observe(el.parentElement ?? document.body, { childList: true, subtree: true });
}
