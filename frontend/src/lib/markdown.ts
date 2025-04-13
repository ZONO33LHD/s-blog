import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";

export async function markdownToHtml(markdown: string) {
  // コードブロック内のJSX構文をエスケープ
  let escapedMarkdown = markdown.replace(
    /```(.+?)\n([\s\S]+?)```/g,
    (match, lang, code) => {
      // JSXの中括弧をエスケープ
      const escapedCode = code
        .replace(/{/g, "&#123;")
        .replace(/}/g, "&#125;")
        .replace(/`/g, "&#96;");
      return "```" + lang + "\n" + escapedCode + "```";
    }
  );

  // インラインコード内のJSX構文もエスケープ
  escapedMarkdown = escapedMarkdown.replace(/`([^`]+)`/g, (match, code) => {
    const escapedCode = code.replace(/{/g, "&#123;").replace(/}/g, "&#125;");
    return "`" + escapedCode + "`";
  });

  const result = await remark()
    .use(remarkGfm) // GitHub Flavored Markdownをサポート
    .use(html, { sanitize: false }) // コードブロックなどのHTMLを保持
    .process(escapedMarkdown);

  return result.toString();
}
