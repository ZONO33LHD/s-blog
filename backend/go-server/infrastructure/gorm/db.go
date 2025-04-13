package gorm

import (
	"github.com/s-blog/backend/go-server/domain/config"
	// postgres
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func NewDB(cfg *config.Vars) (*gorm.DB, error) {
	dsn := cfg.Database.DataSourceName() // 設定から接続情報を取得
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	// モデルの自動マイグレーション
	// db.AutoMigrate(&model.User{}, &model.Post{}, ...)

	return db, nil
}
