package http

import (
	"net/http"

	"github.com/s-blog/backend/go-server/infrastructure/log"

	"go.uber.org/zap"
)

func WithLogger(next http.HandlerFunc, logger *log.Logger) http.HandlerFunc {
	fn := func(w http.ResponseWriter, r *http.Request) {
		// Add following fields into logger on request
		l := logger.With(zap.String("url", r.URL.String()))
		ctx := log.WithContext(r.Context(), l)
		req := r.WithContext(ctx)
		next.ServeHTTP(w, req)
	}
	return fn
}
