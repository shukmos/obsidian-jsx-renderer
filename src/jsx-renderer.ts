// JSXコードをReactコンポーネントに変換・レンダリングするエンジン
import { transform } from "sucrase";
import React from "react";
import ReactDOM from "react-dom/client";

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
  jsxSource: string
): () => void {
  // エラー表示用のラッパー
  const wrapper = container.createDiv({ cls: "jsx-renderer-wrapper" });

  try {
    const Component = transpileAndEvaluate(jsxSource);
    const root = ReactDOM.createRoot(wrapper);
    root.render(React.createElement(Component));

    return () => {
      root.unmount();
    };
  } catch (err) {
    // エラー時はエラーメッセージを表示
    wrapper.addClass("jsx-renderer-error");
    wrapper.createEl("div", {
      cls: "jsx-renderer-error-title",
      text: "JSX レンダリングエラー",
    });
    wrapper.createEl("pre", {
      cls: "jsx-renderer-error-message",
      text: err instanceof Error ? err.message : String(err),
    });

    return () => {
      wrapper.empty();
    };
  }
}
