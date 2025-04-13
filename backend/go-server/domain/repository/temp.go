package repository

import "github.com/s-blog/backend/go-server/domain/model"

type TempRepository interface {
    FindByID(id uint) (*model.Temp, error)
	}