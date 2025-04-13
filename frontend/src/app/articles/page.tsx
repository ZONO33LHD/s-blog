import Link from "next/link";
import { getClient } from "@/lib/apollo-client";
import { GET_ARTICLES } from "@/lib/graphql/queries"; // queries.ts からインポート
import { Calendar, Tag as TagIcon, User } from "lucide-react"; // アイコンをインポート
import { format, isValid } from "date-fns"; // date-fns から関数をインポート

interface Author {
  name: string;
  avatar: string;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  author: Author | null;
  tags: string[];
}

// GetArticlesData のようなレスポンス全体の型も定義またはインポート推奨
interface GetArticlesData {
  articles: Article[];
}

// --- Helper function for date formatting ---
function formatDate(dateString: string | null | undefined): string {
  if (!dateString) {
    return "-";
  }
  try {
    // タイムゾーン情報 (' JST' など) を取り除く
    // ISO 8601 に近い形に整形 (スペースを'T'に、タイムゾーンオフセット前のスペースを削除)
    const isoString = dateString
      .replace(" ", "T")
      .replace(/ (\+\d{4}).*$/, "$1");
    const date = new Date(isoString); // まず Date オブジェクトを試す

    if (isValid(date)) {
      // date-fns の isValid でチェック
      // 必要に応じてフォーマットを変更 'yyyy/MM/dd HH:mm' など
      return format(date, "yyyy/MM/dd");
      // 日本語ロケールを使う場合:
      // return format(date, 'yyyy年MM月dd日', { locale: ja });
    } else {
      console.warn(
        "Could not parse date with new Date(), original:",
        dateString,
        "modified:",
        isoString
      );
      return "日付無効"; // パース失敗時
    }
  } catch (e) {
    console.error("Error formatting date:", dateString, e);
    return "日付エラー"; // 予期せぬエラー
  }
}

async function getArticlesData(): Promise<Article[]> {
  try {
    // <GetArticlesData> でレスポンスの型を指定
    const { data, errors } = await getClient().query<GetArticlesData>({
      query: GET_ARTICLES, // インポートしたクエリを使用
      fetchPolicy: "no-cache",
    });

    if (errors) {
      console.error(
        "GraphQL Errors fetching articles:",
        JSON.stringify(errors, null, 2)
      );
      return [];
    }

    if (data && data.articles) {
      return data.articles;
    } else {
      console.error(
        "Failed to fetch articles: No articles found in response data"
      );
      return [];
    }
  } catch (error: any) {
    console.error("Error fetching articles:", error.message);
    if (error.networkError?.result) {
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
    return [];
  }
}

export default async function ArticlesPage() {
  const articles = await getArticlesData();

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container px-4 py-8 mx-auto lg:py-12">
        <h1 className="mb-8 text-3xl font-bold text-center text-slate-900">
          記事一覧
        </h1>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => {
              console.log("Rendering card for article ID:", article.id);
              return (
                <Link key={article.id} href={`/articles/${article.id}`}>
                  <div className="flex flex-col h-full overflow-hidden bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
                    {/* Optional: Add an image placeholder */}
                    {/* <div className="h-40 bg-gray-200"></div> */}
                    <div className="flex flex-col flex-grow p-5">
                      <h2 className="mb-2 text-xl font-semibold text-slate-900 line-clamp-2">
                        {article.title}
                      </h2>
                      <p className="mb-4 text-sm text-slate-600 line-clamp-3 flex-grow">
                        {article.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {article.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="flex items-center px-2 py-0.5 text-xs text-blue-700 bg-blue-100 rounded-full"
                          >
                            <TagIcon className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-auto text-xs text-slate-500">
                        <div className="flex items-center">
                          {article.author ? (
                            <>
                              <img
                                src={
                                  article.author.avatar ||
                                  "/placeholder-avatar.png"
                                }
                                alt={article.author.name}
                                className="w-5 h-5 mr-1.5 rounded-full object-cover"
                              />
                              <span>{article.author.name}</span>
                            </>
                          ) : (
                            <>
                              <User className="w-4 h-4 mr-1" />
                              <span>匿名</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{formatDate(article.publishedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-slate-600">
            表示できる記事がありません。
          </p>
        )}
      </main>
    </div>
  );
}
