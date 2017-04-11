package main

import "gopkg.in/gin-gonic/gin.v1"
import "net/http"

// * A saving deposit is identified by a 
// FIELDS:
// bank name, 
// account number, 
// initial amount saved (currency in USD),
// start date, 
// end date, 
// interest percentage per year and
// taxes percentage.

type Deposit struct {
    BankName      string `json:"bank_name" form:"bank_name" binding:"required"`
    AccountNumber   string `json:"account_number" form:"account_number" binding:"required"`
}

func depositsIndexEndpoint(c *gin.Context) {
  deposits := []Deposit{ {"first d", "Blalba"}, {"first 2", "Blalba"} }

  c.JSON(http.StatusOK, gin.H{"deposits": deposits, "count": len(deposits)})
}

func depositsCreateEndpoint(c *gin.Context) {
  // c.JSON(http.StatusCreated, deposits[0])
}

func main() {
  r := gin.Default()

  r.Static("/assets", "./assets")

  r.StaticFile("/", "./assets/index.html")

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "message": "pong",
    })
  })

  v1 := r.Group("/v1")
  {
    v1.GET("/deposits", depositsIndexEndpoint)
    v1.POST("/deposits", depositsCreateEndpoint)
  }

  r.Run(":3001") // listen and serve on 0.0.0.0:8080
}
