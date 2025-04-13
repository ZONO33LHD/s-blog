package registry

import (
	"database/sql"

	"github.com/s-blog/backend/go-server/domain/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func gormDBProvider(db *config.Database) (*gorm.DB, error) {
	sqlDB, err := sql.Open("pgx", db.DataSourceName())
	if err != nil {
		return nil, err
	}

	gormDB, err := gorm.Open(postgres.New(postgres.Config{
		Conn: sqlDB,
	}), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	return gormDB, nil
}
