import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Search,
  Tag as TagIcon,
  ThumbsUp,
} from "lucide-react";
import { getClient } from "@/lib/apollo-client";
import { GET_ARTICLES_BY_TAG } from "@/lib/graphql/queries";
import { format, isValid } from 'date-fns';

// ダミーデータ - 記事
const articles = [
  {
    id: "1",
    title: "Next.js 14で実装するモダンなブログアプリケーション",
    excerpt:
      "Next.js 14の新機能を活用して、高速で使いやすいブログアプリケーションを構築する方法を解説します。App Routerの活用方法からサーバーコンポーネントの実装まで、実践的なテクニックを紹介します。",
    publishedAt: "2023-12-01",
    author: {
      name: "山田太郎",
      avatar: "/placeholder-avatar.png",
    },
    tags: ["Next.js", "React", "TypeScript"],
    likes: 124,
    comments: 18,
  },
  {
    id: "2",
    title: "GraphQLとApolloを使った効率的なデータフェッチング",
    excerpt:
      "RESTからGraphQLへの移行によるフロントエンド開発の効率化について解説します。ApolloClientを使ったキャッシュ戦略やクエリ最適化のテクニックもご紹介します。",
    publishedAt: "2023-11-25",
    author: {
      name: "佐藤花子",
      avatar: "/placeholder-avatar.png",
    },
    tags: ["GraphQL", "Apollo", "Web開発"],
    likes: 98,
    comments: 12,
  },
  {
    id: "3",
    title: "Tailwind CSSでスタイリングを効率化する方法",
    excerpt:
      "ユーティリティファーストのCSSフレームワークであるTailwind CSSを活用して、効率的かつ一貫性のあるUIを構築するためのベストプラクティスをご紹介します。",
    publishedAt: "2023-11-20",
    author: {
      name: "鈴木一郎",
      avatar: "/placeholder-avatar.png",
    },
    tags: ["CSS", "TailwindCSS", "フロントエンド"],
    likes: 156,
    comments: 23,
  },
  {
    id: "7",
    title: "React HooksとContext APIを使った状態管理",
    excerpt:
      "Reduxなどの外部ライブラリを使わずに、React HooksとContext APIだけで効率的な状態管理を実現する方法を解説します。",
    publishedAt: "2023-11-01",
    author: {
      name: "加藤健太",
      avatar: "/placeholder-avatar.png",
    },
    tags: ["React", "JavaScript", "フロントエンド"],
    likes: 134,
    comments: 21,
  },
];

// ダミー - 関連タグ
const relatedTags = [
  { name: "JavaScript", count: 428 },
  { name: "TypeScript", count: 347 },
  { name: "フロントエンド", count: 241 },
  { name: "Web開発", count: 198 },
  { name: "Next.js", count: 285 },
];

// --- Helper function for date formatting ---
function formatDate(dateString: string | null | undefined): string {
  if (!dateString) {
    return "-";
  }
  try {
    const isoString = dateString.replace(' ', 'T').replace(/ (\+\\d{4}).*$/, '$1');
    const date = new Date(isoString);
    if (isValid(date)) {
      return format(date, 'yyyy/MM/dd');
    } else {
      console.warn("Could not parse date with new Date(), original:", dateString, "modified:", isoString);
      return "日付無効";
    }
  } catch (e) {
    console.error("Error formatting date:", dateString, e);
    return "日付エラー";
  }
}

export default async function TagPage({ params }: { params: { tag: string } }) {
  const decodedTag = decodeURIComponent(params.tag);

  // GraphQLからデータを取得する
  let articlesData = [];
  try {
    const { data } = await getClient().query({
      query: GET_ARTICLES_BY_TAG,
      variables: { tag: decodedTag },
    });
    articlesData = data.articlesByTag || [];
    console.log("タグ記事の取得に成功:", articlesData.length);
  } catch (error) {
    console.error("タグ記事の取得に失敗しました:", error);
    // エラー時はダミーデータを使用
    articlesData = articles.filter((article) =>
      article.tags.some((tag) => tag.toLowerCase() === decodedTag.toLowerCase())
    );
  }

  // 記事データがない場合はダミーデータでフィルタリング
  if (articlesData.length === 0) {
    articlesData = articles.filter((article) =>
      article.tags.some((tag) => tag.toLowerCase() === decodedTag.toLowerCase())
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container px-4 py-8 mx-auto lg:py-12">
        <div className="mb-4">
          <Link
            href="/tags"
            className="flex items-center text-sm text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            すべてのタグに戻る
          </Link>
        </div>

        {/* タグヘッダー */}
        <div className="p-8 mb-8 bg-white border border-slate-200 rounded-lg">
          <div className="flex flex-col items-center md:flex-row md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <TagIcon className="w-8 h-8 mr-3 text-blue-600" />
              <h1 className="text-3xl font-bold text-slate-900">
                #{decodedTag}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-slate-100 rounded-md">
                <span className="text-lg font-semibold text-slate-700">
                  {articlesData.length}
                </span>
                <span className="ml-2 text-slate-600">記事</span>
              </div>

              <button className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                フォローする
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* サイドバー */}
          <div className="order-2 lg:order-1 lg:col-span-1">
            {/* 検索ボックス */}
            <div className="sticky top-24">
              <div className="mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-5 h-5 text-slate-400" />
                  </div>
                  <input
                    type="search"
                    className="block w-full p-2 pl-10 text-sm border border-slate-300 rounded-lg bg-slate-50 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="記事を検索..."
                  />
                </div>
              </div>

              {/* 関連タグ */}
              <div className="p-5 mb-8 bg-white border border-slate-200 rounded-lg">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">
                  関連タグ
                </h3>
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">
                    関連タグは現在表示できません。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* メインコンテンツ */}
          <div className="order-1 lg:order-2 lg:col-span-3">
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-600">並び替え:</span>
                <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
                  新着順
                </button>
                <button className="px-3 py-1 text-sm text-slate-700 rounded-full hover:bg-slate-100">
                  人気順
                </button>
                <button className="px-3 py-1 text-sm text-slate-700 rounded-full hover:bg-slate-100">
                  コメント順
                </button>
              </div>
            </div>

            {/* 記事リスト */}
            {articlesData.length > 0 ? (
              <div className="space-y-6">
                {articlesData.map((article) => (
                  <div
                    key={article.id}
                    className="p-6 transition-shadow bg-white border border-slate-200 rounded-lg hover:shadow-md"
                  >
                    <Link href={`/articles/${article.id}`}>
                      <div className="mb-4">
                        <h2 className="mb-2 text-xl font-bold text-slate-900 hover:text-blue-700">
                          {article.title}
                        </h2>
                        <p className="text-slate-600 line-clamp-2">
                          {article.excerpt}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`px-2 py-1 text-xs rounded-md ${
                              tag.toLowerCase() === decodedTag.toLowerCase()
                                ? "bg-blue-500 text-white"
                                : "text-blue-700 bg-blue-100"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 mr-2 overflow-hidden bg-slate-200 rounded-full">
                            {/* 画像は実際には適切な画像を使用する */}
                          </div>
                          <span className="text-sm text-slate-700">
                            {article.author.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <div className="flex items-center">
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            <span>{article.likes}</span>
                          </div>
                          <div className="flex items-center">
                            <BookOpen className="w-4 h-4 mr-1" />
                            <span>{article.comments}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{formatDate(article.publishedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-white border border-slate-200 rounded-lg">
                <h3 className="mb-2 text-xl font-bold text-slate-900">
                  記事が見つかりませんでした
                </h3>
                <p className="text-slate-600">
                  「{decodedTag}」のタグがついた記事はまだありません。
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="py-8 text-white bg-slate-800">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-4 text-lg font-bold">S-Blog</h3>
              <p className="text-slate-300">
                技術者のための知識共有プラットフォーム
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-lg font-bold">リンク</h4>
              <ul className="space-y-2 text-slate-300">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/policy" className="hover:text-white">
                    プライバシーポリシー
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    利用規約
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    お問い合わせ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-lg font-bold">ソーシャル</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-300 hover:text-white">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-slate-300 hover:text-white">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="pt-8 mt-8 text-center text-slate-400 border-t border-slate-700">
            <p>
              &copy; {new Date().getFullYear()} S-Blog. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
