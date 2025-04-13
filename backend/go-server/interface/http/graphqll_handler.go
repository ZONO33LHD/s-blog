package http

import (
	"log"
	"net/http"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/s-blog/backend/go-server/interface/graphql/generated"
	"github.com/s-blog/backend/go-server/interface/graphql/resolver"
	"gorm.io/gorm"
)

type GraphQLHandler struct {
	db *gorm.DB
}

func NewGraphQLHandler(db *gorm.DB) *GraphQLHandler {
	return &GraphQLHandler{db: db}
}

func (h *GraphQLHandler) GraphQL(w http.ResponseWriter, r *http.Request) {
	// Log incoming request method
	log.Printf("GraphQL handler received request: Method=%s, URL=%s", r.Method, r.URL.Path)

	// GraphQLサーバーとPlaygroundを設定
	resolvers := &resolver.Resolver{DB: h.db}
	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: resolvers}))

	// POSTリクエスト時はGraphQLクエリを処理
	if r.Method == "POST" {
		log.Println("GraphQL handler: Processing POST request...") // Log before serving POST
		srv.ServeHTTP(w, r)
		log.Println("GraphQL handler: Finished processing POST request.") // Log after serving POST (might not be reached if panic occurs)
		return
	}

	// GETリクエスト時はPlaygroundを表示
	log.Println("GraphQL handler: Serving Playground...") // Log before serving Playground
	playground.Handler("GraphQL Playground", "/graphql").ServeHTTP(w, r)
}
