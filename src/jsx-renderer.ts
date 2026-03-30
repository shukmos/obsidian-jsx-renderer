// JSXコードをReactコンポーネントに変換・レンダリングするエンジン
import { transform } from "sucrase";
import React from "react";
import ReactDOM from "react-dom/client";

export interface RenderOptions {
  showErrorDetails?: boolean;
}

// ランタイムエラーをキャッチするError Boundary
class ErrorBoundary extends React.Component<
  { onError: (error: Error) => void; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { onError: (error: Error) => void; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    this.props.onError(error);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

/**
 * JSXソースコードをトランスパイルし、Reactコンポーネントとして評価する
 */
export function transpileAndEvaluate(jsxSource: string): React.ComponentType {
  // Sucraseでトランスパイル
  const { code } = transform(jsxSource, {
    transforms: ["jsx", "imports"],
    jsxRuntime: "classic",
    production: true,
  });

  // モック用のrequire関数
  const mockRequire = (id: string) => {
    if (id === "react" || id === "React") return React;
    if (id === "react-dom/client") return ReactDOM;
    if (id === "react-dom") return ReactDOM;
    throw new Error(`未対応のモジュール: ${id}`);
  };

  // module.exportsを収集するオブジェクト
  const moduleObj: { exports: Record<string, unknown> } = { exports: {} };

  // コードを評価
  const fn = new Function("require", "module", "exports", "React", code);
  fn(mockRequire, moduleObj, moduleObj.exports, React);

  // default exportを取得
  const Component =
    (moduleObj.exports.default as React.ComponentType) ||
    (moduleObj.exports as unknown as React.ComponentType);

  if (typeof Component !== "function") {
    throw new Error(
      "コンポーネントが見つからない。`export default function ...` 形式でエクスポートされているか確認してください。"
    );
  }

  return Component;
}

/**
 * コンテナ要素にReactコンポーネントをレンダリングする
 * アンマウント用のクリーンアップ関数を返す
 */
export function renderToContainer(
  container: HTMLElement,
  jsxSource: string,
  options?: RenderOptions
): () => void {
  const showErrorDetails = options?.showErrorDetails ?? true;

  // エラー表示用のラッパー
  const wrapper = container.createDiv({ cls: "jsx-renderer-wrapper" });

  const showError = (err: unknown) => {
    wrapper.empty();
    wrapper.addClass("jsx-renderer-error");
    wrapper.createEl("div", {
      cls: "jsx-renderer-error-title",
      text: "JSX レンダリングエラー",
    });

    if (showErrorDetails) {
      wrapper.createEl("pre", {
        cls: "jsx-renderer-error-message",
        text: err instanceof Error ? err.message : String(err),
      });
    }
  };

  try {
    const Component = transpileAndEvaluate(jsxSource);
    const root = ReactDOM.createRoot(wrapper);

    // Error Boundaryでランタイムエラーもキャッチ
    root.render(
      React.createElement(ErrorBoundary, {
        onError: (error: Error) => showError(error),
        children: React.createElement(Component),
      })
    );

    return () => {
      root.unmount();
    };
  } catch (err) {
    showError(err);

    return () => {
      wrapper.empty();
    };
  }
}
