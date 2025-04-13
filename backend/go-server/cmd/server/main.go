package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"runtime"
	"time"

	"github.com/joho/godotenv"
	"github.com/rs/cors"

	"github.com/s-blog/backend/go-server/domain/config"
	infralog "github.com/s-blog/backend/go-server/infrastructure/log"
	ihttp "github.com/s-blog/backend/go-server/interface/http"
	"github.com/s-blog/backend/go-server/registry"
)

func main() {
	godotenv.Load()

	ctx := context.Background()
	cfg := config.MustNew(ctx)
	logger := infralog.New(os.Stdout)
	logger.Info(ctx, "starting server...")

	muxServer, cleanup, err := registry.InitMuxServer(ctx, cfg)
	if err != nil {
		logger.Error(ctx, fmt.Sprintf("failed to init mux server: %v", err))
		os.Exit(1)
	}
	defer cleanup()

	withLoggerHandler := func(next http.Handler) http.HandlerFunc {
		return ihttp.WithLogger(next.ServeHTTP, logger)
	}

	rootMux := http.NewServeMux()
	rootMux.Handle("/", withLoggerHandler(muxServer.Mux))

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:8080"},
		AllowedMethods:   []string{http.MethodGet, http.MethodPost, http.MethodOptions},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
		Debug:            true,
	})

	httpHandler := c.Handler(rootMux)

	logger.Info(ctx, fmt.Sprintf("Starting a server on port %d with %s", cfg.Port, runtime.Version()))
	httpServer := &http.Server{
		Addr:              fmt.Sprintf(":%d", cfg.Port),
		Handler:           httpHandler,
		ReadHeaderTimeout: 30 * time.Second,
	}
	if err := httpServer.ListenAndServe(); err != nil {
		cleanup()
		logger.Error(ctx, fmt.Sprintf("server error: %v", err))
		os.Exit(1)
	}
}
