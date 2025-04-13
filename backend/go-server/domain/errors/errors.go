package errors

import (
	"database/sql"
	"errors"

	"github.com/morikuni/failure"
	"gorm.io/gorm"
)

const (
	CodeNotFound failure.StringCode = "not-found"
)

func IsNotFound(err error) bool {
	if failure.Is(err, CodeNotFound) {
		return true
	}
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return true
	}
	return errors.Is(err, sql.ErrNoRows)
}

func IsRetryable(err error) bool {
	var re *RetryableError
	return errors.As(err, &re)
}
