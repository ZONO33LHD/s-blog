package log

import (
	"context"
)

type contextKey struct{}

func FromContext(ctx context.Context) (*Logger, bool) {
	v := ctx.Value(contextKey{})
	if v == nil {
		return nil, false
	}
	logger, ok := v.(*Logger)
	if !ok {
		return nil, false
	}
	return logger, true
}

func MustFromContext(ctx context.Context) *Logger {
	logger, ok := FromContext(ctx)
	if !ok {
		panic("failed to get logger from context")
	}
	return logger
}

func WithContext(parent context.Context, logger *Logger) context.Context {
	return context.WithValue(parent, contextKey{}, logger)
}
