export GO111MODULE := on
export GOBIN := $(PWD)/bin
export PATH := $(GOBIN):$(PATH)
PID = server.pid
REPOSITORY_ROOT = $(shell git rev-parse --show-toplevel)
GO_TEST_OPTION = -v -p=1 -parallel=1 -race -orverlay=`go run github.com/tenntenn/cmd/testtime -u`

PROTOC_GO_OPTION = -I./proto \
--proto_path=. \
--go_out=./proto \
--go_opt=paths=source_relative \
--go-grpc_out=./proto \
--go-grpc_opt=paths=source_relative \
--validate_out=lang=go:./proto \
--validate_opt=paths=source_relative

restart: kill clean build serve ## Restart a server
.PHONY: restart

kill: ## Kill a server
ifeq ($(OS),Windows_NT)
	@if exist "$(PID)" ( \
		for /f "tokens=1" %%i in ('type "$(PID)"') do ( \
			taskkill /F /PID %%i 2>nul || exit 0 \
		) && \
		del /f "$(PID)" 2>nul || exit 0 \
	)
else
	@kill `cat $(PID)` 2> /dev/null || true
endif
.PHONY: kill

build: ## Build binary
ifeq ($(OS),Windows_NT)
	@go build -ldflags="-X=google.golang.org/protobuf/reflect/protoregistry.conflictPolicy=warn" -o bin/server.exe ./cmd/server
else
	GOFLAGS="-ldflags=-X=google.golang.org/protobuf/reflect/protoregistry.conflictPolicy=warn" go build -o bin/server ./cmd/server
endif

clean: ## Remove artifacts
ifeq ($(OS),Windows_NT)
	@if exist "bin\server" del /f "bin\server" 2>nul || exit 0
	@if exist "bin\server.exe" del /f "bin\server.exe" 2>nul || exit 0
else
	${RM} bin/server
endif

test: ## Run tests
	go test $(GO_TEST_OPTION) ./...

test-coverage: ## Run tests with coverage
	go test $(GO_TEST_OPTION) -coverprofile=coverage.out ./...
.PHONY: all

all:
	go build -o bin/protogen ./cmd/protogen

run: ## Run docker container
	docker build -t s-blog .
	docker run -d -p 8080:8080 s-blog

init: ## Install development tools
	@go list -tags=tools -e -f='{{ .Imports }}' ./tools.go | tr -d [ | tr -d ] | xargs -L 1 go install
.PHONY: init

wire-generate: ## Generate wire_gen.go from ./registry/wire.go
	@go run github.com/google/wire/cmd/wire gen ./registry
.PHONY: wire-generate

wire-check: ## Check wire generate can be executed successfully
	@go run github.com/google/wire/cmd/wire check ./registry
.PHONY: wire-check

ent-describe: ## Run `ent describe`
	@go run -mod=mod entgo.io/ent/cmd/ent describe ./infrastructure/ent/schema
.PHONY: ent-generate

ent-init: ## Run `ent init` to initialize ent schema
	@go run -mod=mod entgo.io/ent/cmd/ent --target=infrastructure/ent/schema new $(ARGS)
.PHONY: ent-init

ent-generate: ## Run `ent generate`
	@go run -mod=mod entgo.io/ent/cmd/ent generate \
		--feature sql/lock \
		--feature sql/upsert \
		--feature sql/modifier \
		--feature sql/execquery \
		./infrastructure/ent/schema
.PHONY: ent-generate

serve: ## Start the server
ifeq ($(OS),Windows_NT)
	@echo Starting server...
	@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -Command "bin\server.exe 2>&1 | Tee-Object -FilePath server.log" && \
	timeout /t 2 > nul && \
	for /f "tokens=2" %%i in ('"%SystemRoot%\System32\tasklist" /fi "imagename eq server.exe" /nh') do ( \
		@echo %%i > $(PID) && \
		@echo Server started with PID: %%i \
	)
else
	@echo Starting server...
	@bin/server 2>&1 | tee server.log & echo $$! > $(PID) && \
	echo "Server started with PID: $$(cat $(PID))" && \
	cat server.log
endif
.PHONY: serve

status: ## Check server status
ifeq ($(OS),Windows_NT)
	@if exist "$(PID)" ( \
		for /f "tokens=1" %%i in ('type "$(PID)"') do ( \
			"%SystemRoot%\System32\tasklist" /fi "PID eq %%i" /nh > nul 2>&1 && ( \
				echo Server process is running with PID: %%i && \
				powershell -Command "try { \
					$response = Invoke-WebRequest -Uri 'http://localhost:8080/health' -Method GET -UseBasicParsing; \
					if ($response.StatusCode -eq 200) { Write-Host 'Server is responding to health checks' } \
					else { Write-Host 'Server is running but not responding properly' } \
				} catch { Write-Host 'Server is running but not responding to health checks' }" \
			) || echo Server is not running \
		) \
	) else ( \
		echo Server is not running \
	)
else
	@if [ -f "$(PID)" ]; then \
		if kill -0 `cat $(PID)` 2>/dev/null; then \
			echo "Server process is running with PID: $$(cat $(PID))"; \
			if curl -s -f http://localhost:8080/health >/dev/null 2>&1; then \
				echo "Server is responding to health checks"; \
			else \
				echo "Server is running but not responding to health checks"; \
			fi \
		else \
			echo "Server is not running"; \
		fi \
	else \
		echo "Server is not running"; \
	fi
endif
.PHONY: status
