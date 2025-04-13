package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/s-blog/backend/go-server/infrastructure/gorm"
)

func main() {
	// .env ファイルを読み込む
	if err := godotenv.Load(); err != nil {
		log.Printf("Warning: .envファイルが見つかりません: %v", err)
	}

	// データベース接続を初期化
	gorm.InitDB()

	// マイグレーションを実行
	if err := gorm.MigrateDB(); err != nil {
		log.Fatalf("マイグレーションに失敗しました: %v", err)
		os.Exit(1)
	}

	log.Println("マイグレーションが正常に完了しました")
}
