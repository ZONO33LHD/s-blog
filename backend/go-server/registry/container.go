package registry

import (
	"github.com/s-blog/backend/go-server/domain/config"

	"gorm.io/gorm"
)

type Container struct {
	Config *config.Vars
	DB     *gorm.DB
}

func NewContainer(cfg *config.Vars) (*Container, error) {
	db, err := gormDBProvider(cfg.Database)
	if err != nil {
		return nil, err
	}

	return &Container{
		Config: cfg,
		DB:     db,
	}, nil
}
