package repository

import (
	"github.com/s-blog/backend/go-server/domain/model"
	"github.com/s-blog/backend/go-server/domain/repository"
	gormmodel "github.com/s-blog/backend/go-server/infrastructure/gorm/model"
	"gorm.io/gorm"
)

type postRepository struct {
	db *gorm.DB
}

func NewPostRepository(db *gorm.DB) repository.PostRepository {
	return &postRepository{db: db}
}

func (r *postRepository) FindByID(id uint) (*model.Temp, error) {
	var post gormmodel.Temp
	if err := r.db.First(&post, id).Error; err != nil {
		return nil, err
	}
	return post.ToDomain(), nil
}
