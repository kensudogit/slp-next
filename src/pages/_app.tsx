// Next.jsのAppコンポーネントをカスタマイズするためのファイル
// 全てのページで共通のレイアウトや状態管理を実装するために使用
import type { AppProps } from 'next/app';
import '../styles/globals.css';

// アプリケーションのルートコンポーネント
// Component: 現在表示中のページコンポーネント
// pageProps: ページコンポーネントに渡されるprops
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
} 