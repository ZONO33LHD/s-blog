package gorm

import (
	"fmt"
	"log"
	"os"

	"github.com/s-blog/backend/go-server/domain/model"
	// postgres
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// DB コネクション
var DB *gorm.DB

// InitDB データベース接続の初期化
func InitDB() {
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Tokyo",
		host, user, password, dbname, port,
	)

	log.Printf("データベース接続情報: host=%s, port=%s, user=%s, dbname=%s", host, port, user, dbname)

	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags),
		logger.Config{
			LogLevel: logger.Info,
		},
	)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: newLogger,
	})

	if err != nil {
		log.Fatalf("データベースへの接続に失敗しました: %v", err)
	}

	log.Println("データベース接続に成功しました")
}

// MigrateDB データベースマイグレーションを実行
func MigrateDB() error {
	log.Println("データベースマイグレーションを開始します...")

	// テーブルが存在する場合は削除（開発環境のみ）
	if os.Getenv("APP_ENV") == "development" {
		log.Println("開発環境: 既存のテーブルをドロップします")
		err := DB.Migrator().DropTable(
			&model.User{},
			&model.Article{},
			&model.Tag{},
			&model.Comment{},
			&model.ArticleTag{},
		)
		if err != nil {
			return fmt.Errorf("テーブルのドロップに失敗しました: %w", err)
		}
	}

	// マイグレーション実行
	err := DB.AutoMigrate(
		&model.User{},
		&model.Article{},
		&model.Tag{},
		&model.Comment{},
		&model.ArticleTag{},
	)

	if err != nil {
		return fmt.Errorf("マイグレーションに失敗しました: %w", err)
	}

	log.Println("データベースマイグレーションが完了しました")
	return nil
}

// GetDB DBコネクションを取得
func GetDB() *gorm.DB {
	return DB
}
