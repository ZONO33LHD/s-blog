package http

import (
	"context"
	"fmt"
	"net/http"

	"github.com/s-blog/backend/go-server/infrastructure/log"

	"go.uber.org/zap"
)

func writeError(ctx context.Context, w http.ResponseWriter, code int, message string, err error) {
	log.MustFromContext(ctx).Error(ctx, message, zap.Error(err))
	w.WriteHeader(code)
	if message == "" {
		message = err.Error()
	}
	_, _ = fmt.Fprint(w, message)
}

func writeWarning(ctx context.Context, w http.ResponseWriter, message string, err error) {
	log.MustFromContext(ctx).Warn(ctx, message, zap.Error(err))
	w.WriteHeader(http.StatusUnauthorized)
	if message == "" {
		message = err.Error()
	}
	_, _ = fmt.Fprint(w, message)
}

func writeSuccess(ctx context.Context, w http.ResponseWriter, message string) {
	log.MustFromContext(ctx).Info(ctx, message)
	w.WriteHeader(http.StatusOK)
	_, _ = fmt.Fprint(w, message)
}

func writeGraphQL(ctx context.Context, w http.ResponseWriter, message string) {
	w.WriteHeader(http.StatusOK)
	_, _ = fmt.Fprint(w, message)
}

