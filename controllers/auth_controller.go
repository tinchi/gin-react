package controllers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/tinchi/gin-react/db"
	"github.com/tinchi/gin-react/models"
	"golang.org/x/crypto/bcrypt"
	"net/http"
)

type AuthController struct{}

func (ctrl AuthController) RegisterEndpoint(c *gin.Context) {
	var signupForm models.SignupForm

	err := c.BindJSON(&signupForm)

	if err == nil {
		bytePassword := []byte(signupForm.Password)
		hashedPassword, err := bcrypt.GenerateFromPassword(bytePassword, bcrypt.DefaultCost)

		if err != nil {
			panic(err)
		}

		_, err = db.Engine.Insert(&models.User{
			Name:     signupForm.Name,
			Email:    signupForm.Email,
			Password: string(hashedPassword),
			Role:     "user", // default role for registered users
		})

		if err != nil {
			// c.JSON(406, gin.H{"message": err.Error()})
			// TODO: reimplement
			c.JSON(406, gin.H{"message": "An email already taken."})
			c.Abort()
			return
		}

		c.JSON(http.StatusCreated, "")
	} else {
		fmt.Println(err)

		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid form parameters."})
	}
}
