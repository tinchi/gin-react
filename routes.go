package main

import (
  "gopkg.in/gin-gonic/gin.v1"
  "net/http"

  // "github.com/go-pg/pg"
  // "github.com/go-pg/pg/orm"
  "github.com/tinchi/gin-react/models"
  // "fmt"
 //  "reflect"
)

// * A saving deposit is identified by a
// FIELDS:
// bank name,
// account number,
// initial amount saved (currency in USD),
// start date,
// end date,
// interest percentage per year and
// taxes percentage.

func depositsIndexEndpoint(c *gin.Context) {
  var deposits []models.Deposit

  err := dbConn.Model(&deposits).Select()

  if err != nil {
    panic(err)
  }

  c.JSON(http.StatusOK, gin.H{"deposits": deposits, "count": len(deposits)})
}

func depositsCreateEndpoint(c *gin.Context) {
  var deposit models.Deposit

  if c.Bind(&deposit) == nil {

    err := dbConn.Insert(&deposit)
    if err != nil {
      panic(err)
    }

    c.JSON(http.StatusOK, gin.H{"deposit": deposit})
  }
}

func depositsShowEndpoint(c *gin.Context) {
  var deposit models.Deposit

  id := c.Param("id")

  err := dbConn.Model(&deposit).
      Where("deposit.id = ?", id).
      Select()

  if err != nil {
    panic(err)
  }

  c.JSON(http.StatusOK, gin.H{"deposit": deposit})
}

func depositsUpdateEndpoint(c *gin.Context) {
  var deposit models.Deposit

  id := c.Param("id")

  if c.Bind(&deposit) == nil {

    _, err := dbConn.Model(&deposit).
        Where("deposit.id = ?", id).
        Returning("*").
        Update()

    if err != nil {
      panic(err)
    }
  }

  c.JSON(http.StatusOK, gin.H{"deposit": deposit})
}

func depositsDeleteEndpoint(c *gin.Context) {
  var deposit models.Deposit

  id := c.Param("id")

  _, err := dbConn.Model(&deposit).
    Where("deposit.id = ?", id).
    Delete()

  if err != nil {
    panic(err)
  }

  c.JSON(http.StatusOK, gin.H{})
}

func initializeRoutes() {
  router.Static("/assets", "./assets")

  v1 := router.Group("/v1")
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