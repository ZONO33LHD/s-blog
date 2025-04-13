package log

import (
	"context"
	"io"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

type Logger struct {
	logger        *zap.Logger
}

func New(w io.Writer) *Logger {
	l := newZapLogger(nil, []io.Writer{w}, zapcore.InfoLevel)

	return &Logger{
		logger: l,
	}
}

func (l *Logger) Debug(_ context.Context, msg string, fields ...zap.Field) {
	l.logger.Debug(msg, fields...)
}

func (l *Logger) Info(_ context.Context, msg string, fields ...zap.Field) {
	l.logger.Info(msg, fields...)
}

func (l *Logger) Warn(_ context.Context, msg string, fields ...zap.Field) {
	l.logger.Warn(msg, fields...)
}

func (l *Logger) Error(_ context.Context, msg string, fields ...zap.Field) {
	l.logger.Error(msg, fields...)

	// エラーフィールドを抽出
	for _, f := range fields {
		if f.Type == zapcore.ErrorType {
			if err, ok := f.Interface.(error); ok {
				l.notifyError(err)
			}
		}
	}
}

func (l *Logger) With(fields ...zap.Field) *Logger {
	return &Logger{
		logger: l.logger.With(fields...),
	}
}

func (l *Logger) notifyError(err error) {
	// エラー通知の代替でログ出力
	l.logger.Error("error notification", zap.Error(err))
}

func newZapLogger(
	encoderConfig *zapcore.EncoderConfig,
	writers []io.Writer,
	logLevel zapcore.Level,
	options ...zap.Option,
) *zap.Logger {
	if encoderConfig == nil {
		c := zap.NewProductionEncoderConfig()
		c.LevelKey = "severity"
		c.TimeKey = "timestamp"
		c.EncodeTime = zapcore.RFC3339NanoTimeEncoder
		encoderConfig = &c
	}
	if len(writers) == 0 {
		writers = append(writers, io.Discard)
	}
	enabler := zap.LevelEnablerFunc(func(lvl zapcore.Level) bool {
		return lvl >= logLevel
	})
	cores := make([]zapcore.Core, len(writers))
	for i, w := range writers {
		cores[i] = zapcore.NewCore(zapcore.NewJSONEncoder(*encoderConfig), zapcore.AddSync(w), enabler)
	}
	return zap.New(zapcore.NewTee(cores...), options...)
}
