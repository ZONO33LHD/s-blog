import { gql } from "@apollo/client";

// 記事一覧を取得するクエリ
export const GET_ARTICLES = gql`
  query GetArticles {
    articles {
      id
      title
      excerpt
      publishedAt
      author {
        name
        avatar
      }
      tags
    }
  }
`;

// 特定の記事を取得するクエリ
export const GET_ARTICLE = gql`
  query GetArticle($id: ID!) {
    article(id: $id) {
      id
      title
      content
      excerpt
      publishedAt
      author {
        name
        avatar
        bio
      }
      tags
      likes
      comments
      readingTime
    }
  }
`;

// トレンド記事を取得するクエリ
export const GET_TRENDING_ARTICLES = gql`
  query GetTrendingArticles {
    trendingArticles {
      id
      title
      excerpt
      publishedAt
      author {
        name
        avatar
      }
      tags
      likes
      comments
    }
  }
`;

// タグで記事を検索するクエリ
export const GET_ARTICLES_BY_TAG = gql`
  query GetArticlesByTag($tag: String!) {
    articlesByTag(tag: $tag) {
      id
      title
      excerpt
      publishedAt
      author {
        name
        avatar
      }
      tags
      likes
      comments
    }
  }
`;
