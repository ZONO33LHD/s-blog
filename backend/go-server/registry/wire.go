//go:build wireinject
// +build wireinject

package registry

import (
	"context"
	"net/http"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/s-blog/backend/go-server/domain/config"

	"github.com/google/wire"
)

type MuxServer struct {
	Mux *http.ServeMux
}

func InitMuxServer(ctx context.Context, cfg *config.Vars) (*MuxServer, func(), error) {
	panic(wire.Build(
		wire.FieldsOf(new(*config.Vars), "Database"),
		gormDBProvider,
		newMux,
		wire.Struct(new(MuxServer), "Mux"),
	))
}
