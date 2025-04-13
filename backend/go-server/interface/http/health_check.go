package http

import (
	"fmt"
	"net/http"

	"github.com/s-blog/backend/go-server/infrastructure/log"

	"gorm.io/gorm"

	"go.uber.org/zap"
)

type HealthCheckHandler struct {
	db *gorm.DB
}

func NewHealthCheckHandler(db *gorm.DB) *HealthCheckHandler {
	return &HealthCheckHandler{
		db: db,
	}
}

func (h *HealthCheckHandler) HealthCheck(w http.ResponseWriter, r *http.Request) {
	// GORMで簡単なクエリを実行してDBの接続状態を確認
	var result int
	err := h.db.Raw("SELECT 1").Scan(&result).Error
	if err != nil {
		log.MustFromContext(r.Context()).Error(r.Context(), "failed to check database", zap.Error(err))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	_, _ = fmt.Fprint(w, "OK")
}
