package config

import (
	"context"
	"fmt"

	"github.com/sethvargo/go-envconfig"
)

type Database struct {
	User                   string `env:"DATABASE_USER" default:"postgres"`
	Password               string `env:"DATABASE_PASSWORD,required"`
	InstanceConnectionName string `env:"INSTANCE_CONNECTION_NAME"`
	Host                   string `env:"DATABASE_HOST" default:"localhost"`
	Port                   int64  `env:"DATABASE_PORT" default:"5435"`
	Name                   string `env:"DATABASE_NAME" default:"s-blog-db"`
	SocketDir              string `env:"DATABASE_SOCKET_DIR"`
}

type Vars struct {
	Database *Database
	Port     int `env:"PORT,default=8000"`
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
			"user=%s password=%s database=%s host=%s port=%d sslmode=disable",
			d.User, d.Password, d.Name, d.Host, d.Port,
		)
	}
	return fmt.Sprintf(
		"user=%s password=%s database=%s host=%s/%s",
		d.User, d.Password, d.Name, d.SocketDir, d.InstanceConnectionName,
	)
}
