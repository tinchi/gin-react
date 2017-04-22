package controllers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/tinchi/gin-react/db"
	"github.com/tinchi/gin-react/forms"
	"github.com/tinchi/gin-react/models"
	"net/http"
)

type DepositController struct{}

func getCurrentUser(c *gin.Context) models.User {
	current_user, _ := c.Get("current_user")

	fmt.Println("current_user_id", current_user.(models.User))

	return current_user.(models.User)
}

// * User can filter saving deposits by amount (minimum and maximum), bank name and date.
type DepositFilter struct {
	BankName  string `json:"bank_name" form:"bank_name"`
	AmountMin int    `json:"amount_from" form:"amount_from"`
	AmountMax int    `json:"amount_to" form:"amount_to"`
	From      string `json:"from" form:"from"`
	To        string `json:"to" form:"to"`
	Page      int    `json:"page" form:"page"`
}

func (ctrl DepositController) IndexEndpoint(c *gin.Context) {
	var deposits []models.Deposit
	var form DepositFilter

	err := c.Bind(&form)

	current_user := getCurrentUser(c)

	if err != nil {
		fmt.Println("c.Bind(&form)")
		fmt.Println(err.Error())
	}

	session := db.Engine.Table("deposits")

	if current_user.Role != "admin" {
		session.Where("user_id = ?", current_user.Id)
	}

	if len(form.BankName) != 0 {
		session.And("bank_name = ?", form.BankName)
	}

	// if len(form.From) != 0 {
	// 	session.And("started_data <= ?", form.From)
	// }

	// if len(form.To) != 0 {
	// 	session.And("started_data >= ?", form.To)
	// }

	if form.AmountMax != 0 {
		session.And("amount <= ?", form.AmountMax)
	}

	if form.AmountMin != 0 {
		session.And("amount >= ?", form.AmountMin)
	}

	fmt.Println(form, form.AmountMax, form.AmountMin)

	err = session.Limit(10, (form.Page-1)*10).Find(&deposits)

	if err != nil {
		fmt.Println(err)
	}

	if len(deposits) > 0 {
		c.JSON(http.StatusOK, gin.H{"deposits": deposits})
	} else {
		c.JSON(http.StatusOK, gin.H{"deposits": []models.Deposit{}})
	}
}

func (ctrl DepositController) CreateEndpoint(c *gin.Context) {
	var form forms.DepositForm

	current_user := getCurrentUser(c)

	err := c.BindJSON(&form)

	if err == nil {
		deposit := models.Deposit{
			BankName:      form.BankName,
			AccountNumber: form.AccountNumber,
			Amount:        form.Amount,
			StartDate:     form.StartDate,
			EndDate:       form.EndDate,
			Interest:      form.Interest,
			Taxes:         form.Taxes,
			UserId:        current_user.Id,
		}

		_, err = db.Engine.Insert(&deposit)

		if err != nil {
			panic(err)
		}

		c.JSON(http.StatusCreated, gin.H{"deposit": deposit})
	} else {
		fmt.Println(err)

		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid form parameters."})
	}
}

func (ctrl DepositController) ShowEndpoint(c *gin.Context) {
	var deposit models.Deposit

	id := c.Param("id")
	current_user := getCurrentUser(c)

	_, err := db.Engine.Where("id = ?", id).
		And("user_id = ?", current_user.Id).
		Get(&deposit)

	if err != nil {
		panic(err)
	}

	c.JSON(http.StatusOK, gin.H{"deposit": deposit})
}

func (ctrl DepositController) UpdateEndpoint(c *gin.Context) {
	var form forms.DepositForm

	current_user := getCurrentUser(c)
	id := c.Param("id")
	err := c.BindJSON(&form)

	if err == nil {
		deposit := models.Deposit{
			BankName:      form.BankName,
			AccountNumber: form.AccountNumber,
			Amount:        form.Amount,
			StartDate:     form.StartDate,
			EndDate:       form.EndDate,
			Interest:      form.Interest,
			Taxes:         form.Taxes,
		}
		_, err = db.Engine.Where("id = ?", id).
			And("user_id = ?", current_user.Id).
			Update(&deposit)

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		} else {
			c.JSON(http.StatusOK, gin.H{"deposit": deposit})
		}
	} else {
		fmt.Println(err)

		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid form parameters."})
	}
}

func (ctrl DepositController) DeleteEndpoint(c *gin.Context) {
	var deposit models.Deposit

	id := c.Param("id")
	current_user := getCurrentUser(c)

	_, err := db.Engine.Where("deposits.id = ?", id).
		And("user_id = ?", current_user.Id).
		Delete(&deposit)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
	} else {
		c.JSON(http.StatusOK, gin.H{})
	}
}
