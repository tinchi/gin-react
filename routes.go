package main

import (
	"fmt"
	"github.com/appleboy/gin-jwt"
	"github.com/gin-gonic/gin"
	"github.com/tinchi/gin-react/models"
	"net/http"
	"time"
)

func depositsIndexEndpoint(c *gin.Context) {
	var deposits []models.Deposit

	err := engine.Find(&deposits)

	if err != nil {
		fmt.Println(err)
	}

	c.JSON(http.StatusOK, gin.H{"deposits": deposits, "count": len(deposits)})
}

func depositsCreateEndpoint(c *gin.Context) {
	var deposit models.Deposit

	if c.Bind(&deposit) == nil {

		_, err := engine.Insert(&deposit)
		if err != nil {
			panic(err)
		}

		c.JSON(http.StatusOK, gin.H{"deposit": deposit})
	}
}

func depositsShowEndpoint(c *gin.Context) {
	var deposit models.Deposit

	id := c.Param("id")

	_, err := engine.Where("deposits.id = ?", id).
		Get(&deposit)

	if err != nil {
		panic(err)
	}

	c.JSON(http.StatusOK, gin.H{"deposit": deposit})
}

func depositsUpdateEndpoint(c *gin.Context) {
	var deposit models.Deposit

	id := c.Param("id")

	if c.Bind(&deposit) == nil {
		_, err := engine.Where("deposits.id = ?", id).
			Update(&deposit)

		if err != nil {
			panic(err)
		}
	}

	c.JSON(http.StatusOK, gin.H{"deposit": deposit})
}

func depositsDeleteEndpoint(c *gin.Context) {
	var deposit models.Deposit

	id := c.Param("id")

	_, err := engine.Where("deposits.id = ?", id).
		Delete(&deposit)

	if err != nil {
		panic(err)
	}

	c.JSON(http.StatusOK, gin.H{})
}

func initializeRoutes() {
	router.Static("/assets", "./assets")

	authMiddleware := &jwt.GinJWTMiddleware{
		Realm:      "test zone",
		Key:        []byte("secret key"),
		Timeout:    time.Hour,
		MaxRefresh: time.Hour,
		Authenticator: func(userId string, password string, c *gin.Context) (string, bool) {
			if (userId == "admin" && password == "admin") || (userId == "test" && password == "test") {
				return userId, true
			}

			return userId, false
		},
		Authorizator: func(userId string, c *gin.Context) bool {
			if userId == "admin" {
				return true
			}

			return false
		},
		Unauthorized: func(c *gin.Context, code int, message string) {
			c.JSON(code, gin.H{
				"code":    code,
				"message": message,
			})
		},
		TokenLookup:   "header:Authorization",
		TokenHeadName: "Bearer",
		TimeFunc:      time.Now,
	}

	router.POST("/auth/login", authMiddleware.LoginHandler)

	v1 := router.Group("/v1")
	v1.Use(authMiddleware.MiddlewareFunc())

	{
		v1.GET("/deposits", depositsIndexEndpoint)
		v1.POST("/deposits", depositsCreateEndpoint)
		v1.GET("/deposits/:id", depositsShowEndpoint)
		v1.PUT("/deposits/:id", depositsUpdateEndpoint)
		v1.DELETE("/deposits/:id", depositsDeleteEndpoint)
	}

	router.NoRoute(func(c *gin.Context) {
		c.File("./assets/index.html")
	})
}
