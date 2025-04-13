import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  MessageSquare,
  Share2,
  Tag as TagIcon,
  ThumbsUp,
  User,
} from "lucide-react";
import { getClient } from "@/lib/apollo-client";
import { GET_ARTICLE } from "@/lib/graphql/queries";
import { markdownToHtml } from "@/lib/markdown";
import { notFound } from "next/navigation";

const relatedArticles = [
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
    tags: [
      { name: "CSS" },
      { name: "TailwindCSS" },
      { name: "フロントエンド" },
    ],
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
    tags: [
      { name: "React" },
      { name: "JavaScript" },
      { name: "フロントエンド" },
    ],
    likes: 134,
    comments: 21,
  },
];

// 記事データを取得する関数
async function getArticleData(id: string) {
  try {
    const { data, errors } = await getClient().query({
      query: GET_ARTICLE,
      variables: { id },
    });

    // Log GraphQL errors if they exist
    if (errors) {
      console.error("GraphQL Errors:", JSON.stringify(errors, null, 2));
      // Optionally return null or handle specific errors
    }

    if (data && data.article) {
      return data.article;
    } else {
      // Log even if data.article is just null/undefined without explicit errors
      console.error(
        "記事データの取得に失敗しました: article not found in response data",
        data
      );
      return null;
    }
  } catch (error: any) {
    // Catch specific error type if possible
    console.error("記事データの取得中にエラーが発生しました:", error.message);
    // Log network error details if available
    if (error.networkError && error.networkError.result) {
      console.error(
        "Network Error Result:",
        JSON.stringify(error.networkError.result, null, 2)
      );
    } else if (error.graphQLErrors) {
      console.error(
        "GraphQL Errors in Catch:",
        JSON.stringify(error.graphQLErrors, null, 2)
      );
    }
    return null;
  }
}

export default async function ArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const article = await getArticleData(params.id);

  if (!article) {
    notFound();
  }

  // Log the fetched content
  console.log("Fetched article.content:", article.content);

  const contentHtml = await markdownToHtml(article.content || "");

  // Log the converted HTML
  console.log("Converted contentHtml:", contentHtml);

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container px-4 py-8 mx-auto lg:py-12">
        <div className="mb-4">
          <Link
            href="/articles"
            className="flex items-center text-sm text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            記事一覧に戻る
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="order-2 lg:order-1 lg:col-span-3">
            <div className="p-8 mb-8 bg-white border border-slate-200 rounded-lg">
              <h1 className="mb-4 text-3xl font-bold text-slate-900">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-slate-500" />
                  <span className="text-sm text-slate-600">
                    {article.readingTime || "-"} 分
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-slate-500" />
                  <span className="text-sm text-slate-600">
                    {article.publishedAt}
                  </span>
                </div>
                <div className="flex items-center">
                  <ThumbsUp className="w-4 h-4 mr-1 text-slate-500" />
                  <span className="text-sm text-slate-600">
                    {article.likes || 0} いいね
                  </span>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1 text-slate-500" />
                  <span className="text-sm text-slate-600">
                    {article.comments || 0} コメント
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {article.tags &&
                  article.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tags/${encodeURIComponent(tag)}`}
                      className="flex items-center px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200"
                    >
                      <TagIcon className="w-3 h-3 mr-1" />
                      {tag}
                    </Link>
                  ))}
              </div>

              {article.author && (
                <div className="flex items-center p-4 mb-6 border border-slate-200 rounded-lg">
                  <div className="w-12 h-12 mr-4 overflow-hidden rounded-full">
                    <img
                      src={article.author.avatar || "/placeholder-avatar.png"}
                      alt={article.author.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">
                      {article.author.name}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button className="flex items-center px-3 py-1 bg-blue-100 rounded-md hover:bg-blue-200">
                  <ThumbsUp className="w-4 h-4 mr-1 text-blue-700" />
                  <span className="text-sm text-blue-700">いいね</span>
                </button>
                <button className="flex items-center px-3 py-1 bg-slate-100 rounded-md hover:bg-slate-200">
                  <Share2 className="w-4 h-4 mr-1 text-slate-700" />
                  <span className="text-sm text-slate-700">シェア</span>
                </button>
              </div>
            </div>

            <div className="p-8 mb-8 bg-white border border-slate-200 rounded-lg">
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
              </div>
            </div>

            <div className="p-8 bg-white border border-slate-200 rounded-lg">
              <h2 className="mb-6 text-2xl font-bold text-slate-900">
                コメント
              </h2>

              <div className="p-4 mb-6 border border-slate-200 rounded-lg">
                <textarea
                  className="w-full p-3 mb-3 border border-slate-300 rounded-md"
                  rows={3}
                  placeholder="コメントを入力..."
                ></textarea>
                <button className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  コメントを投稿
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-slate-600">
                  まだコメントはありません。最初のコメントを投稿しましょう！
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-1">
            {article.author && (
              <div className="p-5 bg-white border border-slate-200 rounded-lg">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">
                  著者について
                </h3>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 mr-3 overflow-hidden rounded-full">
                    <img
                      src={article.author.avatar || "/placeholder-avatar.png"}
                      alt={article.author.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">
                      {article.author.name}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-600">
                  {article.author.bio || "自己紹介はありません。"}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-8 text-center bg-white border-t border-slate-200">
        <div className="container px-4 mx-auto">
          <p className="text-sm text-slate-600">
            &copy; 2023 S-Blog. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
