package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/go-xorm/xorm"
	_ "github.com/lib/pq"
	"github.com/tinchi/gin-react/models"
	"golang.org/x/crypto/bcrypt"
)

var engine *xorm.Engine

func main() {
	router := gin.Default()

	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	initDB()
	initializeRoutes(router)

	router.Run(":3001")
}

func initDB() {
	engine, _ = xorm.NewEngine("postgres", "dbname=deposit_manager sslmode=disable")

	fmt.Println(engine)

	engine.ShowSQL(true)

	err := engine.Sync2(new(models.Deposit), new(models.User))

	if err != nil {
		fmt.Println(err)
	}

	bytePassword := []byte("qweqwe")
	hashedPassword, err := bcrypt.GenerateFromPassword(bytePassword, bcrypt.DefaultCost)

	_, err = engine.Insert(
		&models.User{Name: "admin", Email: "admin@admin.com", Password: string(hashedPassword), Role: "admin"},
		&models.User{Name: "manager", Email: "manager@manager.com", Password: string(hashedPassword), Role: "manager"},
		&models.User{Name: "user", Email: "user@user.com", Password: string(hashedPassword), Role: "user"},
	)
}
