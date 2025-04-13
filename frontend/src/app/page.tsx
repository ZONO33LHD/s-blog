import Link from "next/link";
import { BookOpen, Clock, Tag, TrendingUp } from "lucide-react";
import { getClient } from "@/lib/apollo-client";
import { GET_ARTICLES, GET_TRENDING_ARTICLES } from "@/lib/graphql/queries";
import { format, isValid } from 'date-fns';

// サーバーコンポーネントでデータを取得する関数
async function getArticles() {
  try {
    const { data } = await getClient().query({
      query: GET_ARTICLES,
    });
    return data.articles;
  } catch (error) {
    console.error("記事データの取得に失敗しました:", error);
    return [];
  }
}

// トレンド記事を取得する関数
async function getTrendingArticles() {
  try {
    const { data } = await getClient().query({
      query: GET_TRENDING_ARTICLES,
    });
    return data.trendingArticles;
  } catch (error) {
    console.error("トレンド記事の取得に失敗しました:", error);
    return [];
  }
}

// --- Helper function for date formatting (Copied from articles/page.tsx) ---
function formatDate(dateString: string | null | undefined): string {
  if (!dateString) {
    return "-";
  }
  try {
    const isoString = dateString.replace(' ', 'T').replace(/ (\+\d{4}).*$/, '$1');
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

export default async function Home() {
  // データを取得
  const articles = await getArticles();
  const trendingArticles = await getTrendingArticles();

  return (
    <div className="min-h-screen bg-slate-50">
      <main>
        {/* トレンド記事 */}
        <section className="py-12 bg-white">
          <div className="container px-4 mx-auto">
            <div className="flex items-center mb-8">
              <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-900">
                トレンド記事
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {trendingArticles.slice(0, 3).map((article) => (
                <div
                  key={article.id}
                  className="overflow-hidden transition-shadow border border-slate-200 rounded-lg hover:shadow-md"
                >
                  <Link href={`/articles/${article.id}`}>
                    <div className="p-6">
                      <h3 className="mb-2 text-xl font-bold text-slate-900 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="mb-4 text-slate-600 line-clamp-3">
                        {article.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.map((tag) => (
                          <span
                            key={tag.name}
                            className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded-md"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center text-sm text-slate-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDate(article.publishedAt)}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 最新記事 */}
        <section className="py-12 bg-slate-50">
          <div className="container px-4 mx-auto">
            <div className="flex items-center mb-8">
              <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-900">最新記事</h2>
            </div>
            <div className="space-y-6">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="p-6 transition-shadow bg-white border border-slate-200 rounded-lg hover:shadow-md"
                >
                  <Link href={`/articles/${article.id}`}>
                    <h3 className="mb-2 text-xl font-bold text-slate-900">
                      {article.title}
                    </h3>
                    <p className="mb-4 text-slate-600">{article.excerpt}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.map((tag) => (
                        <span
                          key={tag.name}
                          className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded-md"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                            <img
                              src={
                                article.author.avatar ||
                                "/placeholder-avatar.png"
                              }
                              alt={article.author.name}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="text-sm font-medium text-slate-900">
                            {article.author.name}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-slate-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDate(article.publishedAt)}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 人気のタグ */}
        <section className="py-12 bg-white">
          <div className="container px-4 mx-auto">
            <div className="flex items-center mb-8">
              <Tag className="w-6 h-6 mr-2 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-900">人気のタグ</h2>
            </div>
            <div className="flex flex-wrap gap-4">
              {[
                "Next.js",
                "React",
                "TypeScript",
                "GraphQL",
                "TailwindCSS",
                "Node.js",
                "Docker",
                "AWS",
                "Python",
                "JavaScript",
                "Web開発",
                "フロントエンド",
              ].map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${tag}`}
                  className="px-4 py-2 text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </section>
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
