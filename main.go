package main

import (
	"gopkg.in/gin-gonic/gin.v1"
	"net/http"

	"github.com/go-pg/pg"
	// "github.com/go-pg/pg/orm"
	"./models"
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

var dbConn *pg.DB

func main() {
	r := gin.Default()

  dbConn = pg.Connect(&pg.Options{
    User:     "saint",
    Database: "deposit_manager",
  })

	r.Static("/assets", "./assets")
	r.StaticFile("/", "./assets/index.html")

	v1 := r.Group("/v1")
	{
		v1.GET("/deposits", depositsIndexEndpoint)
		v1.POST("/deposits", depositsCreateEndpoint)
	}

	r.Run(":3001") // listen and serve on 0.0.0.0:8080
}
