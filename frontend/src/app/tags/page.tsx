import Link from "next/link";
import { Search, Tag as TagIcon, TrendingUp } from "lucide-react";

// ダミーデータ - カテゴリー別のタグ
const tagCategories = [
  {
    name: "プログラミング言語",
    tags: [
      { name: "JavaScript", count: 428 },
      { name: "TypeScript", count: 347 },
      { name: "Python", count: 218 },
      { name: "Go", count: 145 },
      { name: "Rust", count: 126 },
      { name: "Java", count: 120 },
      { name: "PHP", count: 110 },
      { name: "Ruby", count: 98 },
      { name: "Swift", count: 87 },
      { name: "Kotlin", count: 76 },
    ],
  },
  {
    name: "フロントエンド",
    tags: [
      { name: "React", count: 532 },
      { name: "Next.js", count: 285 },
      { name: "Vue.js", count: 198 },
      { name: "Angular", count: 132 },
      { name: "CSS", count: 155 },
      { name: "TailwindCSS", count: 144 },
      { name: "SCSS", count: 94 },
      { name: "HTML", count: 130 },
      { name: "フロントエンド", count: 241 },
    ],
  },
  {
    name: "バックエンド",
    tags: [
      { name: "Node.js", count: 167 },
      { name: "Express", count: 110 },
      { name: "Django", count: 95 },
      { name: "Rails", count: 89 },
      { name: "Spring Boot", count: 78 },
      { name: "Laravel", count: 88 },
      { name: "GraphQL", count: 127 },
      { name: "REST API", count: 115 },
      { name: "バックエンド", count: 135 },
    ],
  },
  {
    name: "インフラ・DevOps",
    tags: [
      { name: "Docker", count: 113 },
      { name: "Kubernetes", count: 96 },
      { name: "AWS", count: 132 },
      { name: "GCP", count: 87 },
      { name: "Azure", count: 79 },
      { name: "CI/CD", count: 94 },
      { name: "Terraform", count: 65 },
      { name: "インフラ", count: 103 },
      { name: "DevOps", count: 92 },
    ],
  },
  {
    name: "データベース",
    tags: [
      { name: "PostgreSQL", count: 104 },
      { name: "MySQL", count: 113 },
      { name: "MongoDB", count: 97 },
      { name: "SQLite", count: 72 },
      { name: "Redis", count: 89 },
      { name: "Firestore", count: 66 },
      { name: "データベース", count: 112 },
      { name: "SQL", count: 109 },
    ],
  },
];

// 人気のタグ（トップ10）
const popularTags = [
  { name: "React", count: 532 },
  { name: "JavaScript", count: 428 },
  { name: "TypeScript", count: 347 },
  { name: "Next.js", count: 285 },
  { name: "フロントエンド", count: 241 },
  { name: "Web開発", count: 198 },
  { name: "Node.js", count: 167 },
  { name: "CSS", count: 155 },
  { name: "GraphQL", count: 127 },
  { name: "Docker", count: 113 },
];

export default function TagsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <Link href="/" className="text-xl font-bold">
            S-Blog
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/articles" className="text-slate-600 hover:text-slate-900">
              記事一覧
            </Link>
            <Link href="/tags" className="text-blue-600 hover:text-blue-800">
              タグ
            </Link>
            <Link href="/about" className="text-slate-600 hover:text-slate-900">
              About
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              ログイン
            </Link>
          </nav>
        </div>
      </header>

      <main className="container px-4 py-8 mx-auto lg:py-12">
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-slate-900">タグ一覧</h1>
          <p className="text-slate-600">
            記事のタグから探したいトピックを見つけられます。人気のタグやカテゴリー別のタグ一覧から関心のある記事を探してみましょう。
          </p>
        </div>

        {/* 検索ボックス */}
        <div className="max-w-xl mb-10">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-slate-400" />
            </div>
            <input
              type="search"
              className="block w-full p-3 pl-10 text-sm border border-slate-300 rounded-lg bg-slate-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="タグを検索..."
            />
          </div>
        </div>

        {/* 人気のタグ */}
        <div className="p-6 mb-8 bg-white border border-slate-200 rounded-lg">
          <div className="flex items-center mb-6">
            <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
            <h2 className="text-2xl font-bold text-slate-900">人気のタグ</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            {popularTags.map((tag) => (
              <Link
                key={tag.name}
                href={`/tags/${tag.name}`}
                className="flex items-center justify-between px-4 py-3 transition-colors bg-white border border-slate-200 rounded-md hover:border-blue-300 hover:bg-blue-50"
              >
                <span className="mr-3 text-lg font-medium text-slate-800">#{tag.name}</span>
                <span className="px-2 py-1 text-sm text-slate-600 bg-slate-100 rounded-full">
                  {tag.count}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* カテゴリー別タグ */}
        <div className="space-y-8">
          {tagCategories.map((category) => (
            <div key={category.name} className="p-6 bg-white border border-slate-200 rounded-lg">
              <h2 className="mb-6 text-xl font-bold text-slate-900">{category.name}</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {category.tags.map((tag) => (
                  <Link
                    key={tag.name}
                    href={`/tags/${tag.name}`}
                    className="flex items-center justify-between p-3 transition-colors border border-slate-200 rounded-md hover:border-blue-300 hover:bg-blue-50"
                  >
                    <div className="flex items-center">
                      <TagIcon className="w-4 h-4 mr-2 text-slate-500" />
                      <span className="text-slate-800">{tag.name}</span>
                    </div>
                    <span className="px-2 py-1 text-xs text-slate-600 bg-slate-100 rounded-full">
                      {tag.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
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
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/policy" className="hover:text-white">プライバシーポリシー</Link></li>
                <li><Link href="/terms" className="hover:text-white">利用規約</Link></li>
                <li><Link href="/contact" className="hover:text-white">お問い合わせ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-lg font-bold">ソーシャル</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-300 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-slate-300 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="pt-8 mt-8 text-center text-slate-400 border-t border-slate-700">
            <p>&copy; {new Date().getFullYear()} S-Blog. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 