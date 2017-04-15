package main

import (
	"gopkg.in/gin-gonic/gin.v1"
	"github.com/go-pg/pg"
)

var dbConn *pg.DB
var router *gin.Engine

func main() {
	router = gin.Default()

  dbConn = pg.Connect(&pg.Options{
    User:     "saint",
    Database: "deposit_manager",
  })

  initializeRoutes()

	router.Run(":3001")
}
