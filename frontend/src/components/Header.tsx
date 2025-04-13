import Link from "next/link";

const Header = () => {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-slate-200">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link href="/" className="text-xl font-bold">
          S-Blog
        </Link>
        <nav className="flex items-center space-x-4">
          <Link
            href="/articles"
            className="text-slate-600 hover:text-slate-900"
          >
            記事一覧
          </Link>
          <Link href="/tags" className="text-slate-600 hover:text-slate-900">
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
  );
};

export default Header;
