package controllers

import (
  "fmt"
  "github.com/gin-gonic/gin"
  "github.com/tinchi/gin-react/db"
  "github.com/tinchi/gin-react/models"
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

    _, err = db.Engine.Insert(&user)
    if err != nil {
      panic(err)
    }

    c.JSON(http.StatusCreated, "")
  } else {
    fmt.Println(err)

    c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
  }
}
