package controllers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/tinchi/gin-react/db"
	"net/http"
	"time"
)

const RevenueSql = `SELECT
      id,
      bank_name,
      account_number,
      revenue_days,
      amount,
      ((amount * (interest::real/100) ) * (revenue_days::real/360)) * (1 -  (taxes::real/100)) as revenue_amount
    FROM
    (
      SELECT
        id,
        bank_name,
        account_number,
        amount,
        interest,
        taxes,
        (LEAST(end_date::date, '%s'::date ) - GREATEST(start_date::date, '%s'::date)) as revenue_days
      FROM
        deposits
      WHERE
        start_date < '%s' OR end_date < '%s') AS sb ;`

const dateLayout = "2006-01-02"

type RevenueController struct{}

type RevenueForm struct {
	FromDate time.Time `json:"from_date" binding:"required"`
	ToDate   time.Time `json:"to_date" binding:"required"`
}

type Revenue struct {
	Id            int     `json:"id"`
	BankName      string  `json:"bank_name"`
	AccountNumber string  `json:"account_number"`
	Amount        int     `json:"amount"`
	RevenueDays   int     `json:"revenue_days"`
	Interest      float32 `json:"interest"`
	Taxes         float32 `json:"taxes"`
	RevenueAmount float32 `json:"revenue_amount"`
}

func (ctrl RevenueController) ReportEndpoint(c *gin.Context) {
	var revenues []Revenue
	var form RevenueForm

	err := c.BindJSON(&form)

	if err == nil {
		fFromDate := form.FromDate.Format(dateLayout)
		fToDate := form.ToDate.Format(dateLayout)

		sqlQuery := fmt.Sprintf(RevenueSql, fToDate, fFromDate, fFromDate, fToDate)

		fmt.Println(sqlQuery)

		err = db.Engine.SQL(sqlQuery).Find(&revenues)

		fmt.Println(err)

		c.JSON(http.StatusOK, gin.H{"revenues": revenues})
	} else {
		fmt.Println(err)

		c.JSON(http.StatusBadRequest, gin.H{"message": "Wrong parameters"})
	}
}
