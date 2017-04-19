package main

import (
	"fmt"
	"github.com/appleboy/gin-jwt"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	// "net/http"
	"time"
)

func initializeRoutes(router *gin.Engine) {
	router.Static("/assets", "./assets")

	authMiddleware := &jwt.GinJWTMiddleware{
		Realm:      "test zone",
		Key:        []byte("secret key"),
		Timeout:    time.Hour,
		MaxRefresh: time.Hour,
		Authenticator: func(userId string, password string, c *gin.Context) (string, bool) {
			fmt.Println("Authenticator:", userId, password)

			var hashFromDatabase string
			_, err := engine.Where("user.email = ?", userId).Get(&hashFromDatabase)

			if err != nil {
				fmt.Println(err)
				fmt.Println(err.Error())

				return userId, false
			}

			fmt.Println("hashFromDatabase:", hashFromDatabase)

			// Comparing the password with the hash
			if err = bcrypt.CompareHashAndPassword([]byte(hashFromDatabase), []byte(password)); err != nil {
				// TODO: Properly handle error
				fmt.Println("Password was correct!")

				return userId, true
			}

			return userId, false

		},
		Authorizator: func(userId string, c *gin.Context) bool {
			fmt.Println(c)
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
	router.POST("/auth/register", registerEndpoint)

	v1 := router.Group("/v1")
	v1.Use(authMiddleware.MiddlewareFunc())

	{
		v1.GET("/deposits", depositsIndexEndpoint)
		v1.POST("/deposits", depositsCreateEndpoint)
		v1.GET("/deposits/:id", depositsShowEndpoint)
		v1.PUT("/deposits/:id", depositsUpdateEndpoint)
		v1.DELETE("/deposits/:id", depositsDeleteEndpoint)

		v1.GET("/users", usersIndexEndpoint)
		v1.POST("/users", usersCreateEndpoint)
	}

	router.NoRoute(func(c *gin.Context) {
		c.File("./assets/index.html")
	})
}
