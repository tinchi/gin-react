package main

import (
	"fmt"
	"github.com/appleboy/gin-jwt"
	"github.com/gin-gonic/gin"
	"github.com/tinchi/gin-react/controllers"
	"github.com/tinchi/gin-react/db"
	"github.com/tinchi/gin-react/models"
	"golang.org/x/crypto/bcrypt"
	// "net/http"
	"net/url"
	"regexp"
	"time"
)

func hasPermission(url *url.URL, userRole string) bool {
	fmt.Println(url.Path, userRole)

	matchUserMe, _ := regexp.MatchString("v1/user/me", url.Path)

	fmt.Println(matchUserMe)

	if matchUserMe == true {
		return true
	}

	switch userRole {
	case "admin":
		return true
	case "manager":
		match, _ := regexp.MatchString("v1/users(/\\d)?", url.Path)

		return match
	case "user":
		match, _ := regexp.MatchString("v1/(deposits(/\\d)?|revenue/report)", url.Path)

		return match
	default:
		fmt.Println("Unknown role!")
		return false
	}

	return false
}

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
			_, err := db.Engine.Table("users").Where("email = ?", userId).Cols("password").Get(&hashFromDatabase)

			if err != nil {
				fmt.Println(err)
				fmt.Println(err.Error())

				return userId, false
			}

			err = bcrypt.CompareHashAndPassword([]byte(hashFromDatabase), []byte(password))

			if err != nil {
				fmt.Println("Wrong password!")
				fmt.Println(err)

				return userId, false
			}

			fmt.Println("Password was correct!")

			return userId, true
		},
		Authorizator: func(userId string, c *gin.Context) bool {
			var user models.User

			fmt.Println("Authorizator")

			_, err := db.Engine.Where("users.email = ?", userId).Get(&user)

			if err != nil {
				fmt.Println(err.Error())
			}

			c.Set("current_user", user)

			return hasPermission(c.Request.URL, user.Role)
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

	auth := new(controllers.AuthController)

	router.POST("/auth/login", authMiddleware.LoginHandler)
	router.POST("/auth/register", auth.RegisterEndpoint)

	v1 := router.Group("/v1")
	v1.Use(authMiddleware.MiddlewareFunc())

	{
		deposit := new(controllers.DepositController)

		v1.GET("/deposits", deposit.IndexEndpoint)
		v1.POST("/deposits", deposit.CreateEndpoint)
		v1.GET("/deposits/:id", deposit.ShowEndpoint)
		v1.PUT("/deposits/:id", deposit.UpdateEndpoint)
		v1.DELETE("/deposits/:id", deposit.DeleteEndpoint)

		user := new(controllers.UserController)

		v1.GET("/users", user.IndexEndpoint)
		v1.POST("/users", user.CreateEndpoint)
		v1.GET("/users/:id", user.ShowEndpoint)
		v1.PUT("/users/:id", user.UpdateEndpoint)
		v1.DELETE("/users/:id", user.DeleteEndpoint)

		v1.GET("/user/me", user.MeEndpoint)

		revenue := new(controllers.RevenueController)

		v1.POST("/revenue/report", revenue.ReportEndpoint)
	}

	router.NoRoute(func(c *gin.Context) {
		c.File("./assets/index.html")
	})
}
