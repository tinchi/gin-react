package controllers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/tinchi/gin-react/db"
	"github.com/tinchi/gin-react/forms"
	"github.com/tinchi/gin-react/models"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"strconv"
)

type UserController struct{}

func (ctrl UserController) MeEndpoint(c *gin.Context) {
	current_user := getCurrentUser(c)

	c.JSON(http.StatusOK, gin.H{"email": current_user.Email, "role": current_user.Role})
}

func (ctrl UserController) IndexEndpoint(c *gin.Context) {
	var users []models.User

	page, _ := strconv.Atoi(c.Param("page"))

	err := db.Engine.Limit(10, (page-1)*10).Find(&users)

	if err != nil {
		fmt.Println(err)
	}

	c.JSON(http.StatusOK, gin.H{"users": users})
}

func (ctrl UserController) CreateEndpoint(c *gin.Context) {
	var form forms.UserForm

	err := c.BindJSON(&form)

	if err == nil {
		bytePassword := []byte(form.Password)
		hashedPassword, err := bcrypt.GenerateFromPassword(bytePassword, bcrypt.DefaultCost)

		if err != nil {
			panic(err)
		}

		user := models.User{
			Name:     form.Name,
			Email:    form.Email,
			Password: string(hashedPassword),
			Role:     form.Role,
		}

		_, err = db.Engine.Insert(&user)
		if err != nil {
			fmt.Println(err)
			c.JSON(http.StatusBadRequest, gin.H{"message": "An email already taken."})
			c.Abort()
			return
		}

		c.JSON(http.StatusCreated, gin.H{"user": user})
	} else {
		fmt.Println(err)

		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
	}
}

func (ctrl UserController) ShowEndpoint(c *gin.Context) {
	var user models.User

	id := c.Param("id")

	_, err := db.Engine.Where("id = ?", id).
		Get(&user)

	if err != nil {
		panic(err)
	}

	c.JSON(http.StatusOK, gin.H{"user": user})
}

func (ctrl UserController) UpdateEndpoint(c *gin.Context) {
	var form forms.UserFormNoPass

	id := c.Param("id")
	err := c.BindJSON(&form)

	if err == nil {
		user := models.User{
			Name:  form.Name,
			Email: form.Email,
			Role:  form.Role,
		}
		_, err = db.Engine.Where("users.id = ?", id).
			Update(&user)

		if err != nil {
			panic(err)
		}

		c.JSON(http.StatusOK, gin.H{"user": user})
	} else {
		fmt.Println(err)

		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
	}
}

func (ctrl UserController) DeleteEndpoint(c *gin.Context) {
	var user models.User

	id := c.Param("id")

	_, err := db.Engine.Where("users.id = ?", id).
		Delete(&user)

	if err != nil {
		panic(err)
	}

	c.JSON(http.StatusOK, gin.H{})
}
