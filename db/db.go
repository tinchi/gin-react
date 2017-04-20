package db

import (
  "fmt"
  "github.com/go-xorm/xorm"
  "github.com/tinchi/gin-react/models"
  _ "github.com/lib/pq" //import postgres
  "golang.org/x/crypto/bcrypt"
)

var Engine *xorm.Engine

func Init() {
  Engine, _ = xorm.NewEngine("postgres", "dbname=deposit_manager sslmode=disable")

  fmt.Println(Engine)

  Engine.ShowSQL(true)

  err := Engine.Sync2(new(models.Deposit), new(models.User))

  if err != nil {
    fmt.Println(err)
  }

  userSeeds()
}

func userSeeds() {
  bytePassword := []byte("qweqwe")
  hashedPassword, err := bcrypt.GenerateFromPassword(bytePassword, bcrypt.DefaultCost)

  _, err = Engine.Insert(
    &models.User{Name: "admin", Email: "admin@admin.com", Password: string(hashedPassword), Role: "admin"},
    &models.User{Name: "manager", Email: "manager@manager.com", Password: string(hashedPassword), Role: "manager"},
    &models.User{Name: "user", Email: "user@user.com", Password: string(hashedPassword), Role: "user"},
  )

  if err != nil {
    fmt.Println(err)
  }
}