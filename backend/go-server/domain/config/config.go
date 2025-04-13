package config

import (
	"context"
	"fmt"

	"github.com/sethvargo/go-envconfig"
)

type Database struct {
	User                   string `env:"DB_USER" default:"postgres"`
	Password               string `env:"DB_PASSWORD,required"`
	InstanceConnectionName string `env:"INSTANCE_CONNECTION_NAME"`
	Host                   string `env:"DB_HOST" default:"localhost"`
	Port                   int64  `env:"DB_PORT" default:"5435"`
	Name                   string `env:"DB_NAME" default:"sblog_dev"`
	SocketDir              string `env:"DATABASE_SOCKET_DIR"`
}

type Vars struct {
	Database *Database
	Port     int `env:"API_PORT,default=8080"`
}

func New(ctx context.Context) (*Vars, error) {
	var vars Vars
	if err := envconfig.Process(ctx, &vars); err != nil {
		return nil, err
	}
	return &vars, nil
}

func MustNew(ctx context.Context) *Vars {
	vars, err := New(ctx)
	if err != nil {
		panic(err)
	}
	return vars
}

func (d *Database) DataSourceName() string {
	if d.InstanceConnectionName == "" {
		return fmt.Sprintf(
			"user=%s password=%s database=%s host=%s port=5435 sslmode=disable",
			d.User, d.Password, d.Name, d.Host,
		)
	}
	return fmt.Sprintf(
		"user=%s password=%s database=%s host=%s/%s",
		d.User, d.Password, d.Name, d.SocketDir, d.InstanceConnectionName,
	)
}
