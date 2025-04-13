package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// User ユーザーモデル
type User struct {
	ID        uuid.UUID `gorm:"type:uuid;primary_key" json:"id"`
	Name      string    `gorm:"size:100;not null" json:"name"`
	Email     string    `gorm:"size:100;not null;unique" json:"email"`
	Password  string    `gorm:"size:100;not null" json:"-"`
	Avatar    string    `gorm:"size:255" json:"avatar"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Articles  []Article `gorm:"foreignKey:AuthorID" json:"articles,omitempty"`
	Comments  []Comment `gorm:"foreignKey:UserID" json:"comments,omitempty"`
}

// Tag タグモデル
type Tag struct {
	ID        uuid.UUID      `gorm:"type:uuid;primary_key" json:"id"`
	Name      string         `gorm:"size:50;not null;unique" json:"name"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	Articles  []*Article     `gorm:"many2many:article_tags;" json:"articles,omitempty"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// Article 記事モデル
type Article struct {
	ID          uuid.UUID      `gorm:"type:uuid;primary_key" json:"id"`
	Title       string         `gorm:"size:200;not null" json:"title"`
	Content     string         `gorm:"type:text;not null" json:"content"`
	Excerpt     string         `gorm:"size:500" json:"excerpt"`
	Slug        string         `gorm:"size:200;not null;unique" json:"slug"`
	PublishedAt *time.Time     `json:"published_at"`
	AuthorID    uuid.UUID      `gorm:"type:uuid;not null" json:"author_id"`
	Author      User           `gorm:"foreignKey:AuthorID" json:"author,omitempty"`
	Tags        []*Tag         `gorm:"many2many:article_tags;" json:"tags,omitempty"`
	Comments    []Comment      `gorm:"foreignKey:ArticleID" json:"comments,omitempty"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

// Comment コメントモデル
type Comment struct {
	ID        uuid.UUID      `gorm:"type:uuid;primary_key" json:"id"`
	Content   string         `gorm:"type:text;not null" json:"content"`
	ArticleID uuid.UUID      `gorm:"type:uuid;not null" json:"article_id"`
	UserID    uuid.UUID      `gorm:"type:uuid;not null" json:"user_id"`
	User      User           `gorm:"foreignKey:UserID" json:"user,omitempty"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// ArticleTag 記事とタグの中間テーブル
type ArticleTag struct {
	ArticleID uuid.UUID `gorm:"type:uuid;primary_key" json:"article_id"`
	TagID     uuid.UUID `gorm:"type:uuid;primary_key" json:"tag_id"`
}

// ファクトリー関数
func NewUser(id uuid.UUID, name, email, password, avatar string) *User {
	return &User{
		ID:       id,
		Name:     name,
		Email:    email,
		Password: password,
		Avatar:   avatar,
	}
}

func NewTag(id uuid.UUID, name string) *Tag {
	return &Tag{
		ID:   id,
		Name: name,
	}
}

func NewArticle(id uuid.UUID, title, content, excerpt, slug string, authorID uuid.UUID) *Article {
	return &Article{
		ID:       id,
		Title:    title,
		Content:  content,
		Excerpt:  excerpt,
		Slug:     slug,
		AuthorID: authorID,
	}
}

func NewComment(id uuid.UUID, content string, articleID, userID uuid.UUID) *Comment {
	return &Comment{
		ID:        id,
		Content:   content,
		ArticleID: articleID,
		UserID:    userID,
	}
}
