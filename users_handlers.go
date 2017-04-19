package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/tinchi/gin-react/models"
	"golang.org/x/crypto/bcrypt"
	"net/http"
)

func usersIndexEndpoint(c *gin.Context) {
	var users []models.User

	err := engine.Find(&users)

	if err != nil {
		fmt.Println(err)
	}

	c.JSON(http.StatusOK, gin.H{"users": users, "count": len(users)})
}

func usersCreateEndpoint(c *gin.Context) {
	var user models.User

	err := c.BindJSON(&user)

	if err == nil {
		userPassword1 := user.Password

		// Generate "hash" to store from user password
		hash, err := bcrypt.GenerateFromPassword([]byte(userPassword1), bcrypt.DefaultCost)
		if err != nil {
			// TODO: Properly handle error
			fmt.Println(err)
		}
		user.Password = string(hash)

		_, err = engine.Insert(&user)
		if err != nil {
			panic(err)
		}

		c.JSON(http.StatusCreated, "")
	} else {
		fmt.Println(err)

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
}

func registerEndpoint(c *gin.Context) {
	var signupForm models.SignupForm

	err := c.BindJSON(&signupForm)

	if err == nil {
		bytePassword := []byte(signupForm.Password)
		hashedPassword, err := bcrypt.GenerateFromPassword(bytePassword, bcrypt.DefaultCost)

		if err != nil {
			panic(err)
		}

		_, err = engine.Insert(&models.User{
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

		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
	}
}
