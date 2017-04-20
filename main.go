package main

import (
	"github.com/gin-gonic/gin"
	"github.com/tinchi/gin-react/db"
)

func main() {
	router := gin.Default()

	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	db.Init()
	initializeRoutes(router)

	router.Run(":3001")
}
