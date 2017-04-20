package controllers

import (
  "fmt"
  "github.com/gin-gonic/gin"
  "github.com/tinchi/gin-react/db"
  "github.com/tinchi/gin-react/models"
  "github.com/tinchi/gin-react/forms"
  "golang.org/x/crypto/bcrypt"
  "net/http"
)

type UserController struct{}

func (ctrl UserController) IndexEndpoint(c *gin.Context) {
  var users []models.User

  err := db.Engine.Find(&users)

  if err != nil {
    fmt.Println(err)
  }

  c.JSON(http.StatusOK, gin.H{"users": users, "count": len(users)})
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
