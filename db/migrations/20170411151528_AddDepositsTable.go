
package migration

import (
    "database/sql"

    "github.com/pressly/goose"
)

func init() {
    goose.AddMigration(Up_20170411151528, Down_20170411151528)
}

func Up_20170411151528(tx *sql.Tx) error {
    return nil
}

func Down_20170411151528(tx *sql.Tx) error {
    return nil
}
