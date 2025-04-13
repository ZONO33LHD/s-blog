package registry

import (
	stdhttp "net/http"

	"github.com/s-blog/backend/go-server/domain/config"
	"github.com/s-blog/backend/go-server/interface/http"
	"gorm.io/gorm"
)

func newMux(
	cfg *config.Vars,
	db *gorm.DB,
) *stdhttp.ServeMux {
	mux := stdhttp.NewServeMux()
	mux.HandleFunc("/health", http.NewHealthCheckHandler(db).HealthCheck)
	mux.HandleFunc("/graphql", http.NewGraphQLHandler(db).GraphQL)

	return mux
}
