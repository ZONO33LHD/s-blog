package model

import "github.com/google/uuid"

type Temp struct {
	ID uuid.UUID `json:"id"`
}

func NewTemp(id uuid.UUID) *Temp {
	return &Temp{
		ID: id,
	}
}
