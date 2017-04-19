package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/go-xorm/xorm"
	_ "github.com/lib/pq"
	"github.com/tinchi/gin-react/models"
)

var engine *xorm.Engine
var router *gin.Engine

func main() {
	router = gin.Default()

	router.Use(gin.Logger())

	engine, _ = xorm.NewEngine("postgres", "dbname=deposit_manager sslmode=disable")

	fmt.Println(engine)

	engine.ShowSQL(true)

	err := engine.Sync2(new(models.Deposit), new(models.User))

	if err != nil {
		fmt.Println(err)
	}

	initializeRoutes()

	router.Run(":3001")
}
