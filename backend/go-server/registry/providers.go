package registry

import (
	"fmt"

	"github.com/s-blog/backend/go-server/domain/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func gormDBProvider(db *config.Database) (*gorm.DB, error) {
	// 直接GORMのPostgres接続を使用
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=5435 sslmode=disable",
		db.Host, db.User, db.Password, db.Name,
	)

	// postgres.Openを使用して直接接続
	gormDB, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	return gormDB, nil
}
