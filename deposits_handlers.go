package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/tinchi/gin-react/models"
	"net/http"
)

func getCurrentUser(c *gin.Context) models.User {
	current_user, _ := c.Get("current_user")

	fmt.Println("current_user_id", current_user.(models.User))

	return current_user.(models.User)
}

func depositsIndexEndpoint(c *gin.Context) {
	var deposits []models.Deposit

	current_user := getCurrentUser(c)

	err := engine.Where("user_id = ?", current_user.Id).Find(&deposits)

	if err != nil {
		fmt.Println(err)
	}

	if len(deposits) > 0 {
		c.JSON(http.StatusOK, gin.H{"deposits": deposits, "count": len(deposits)})
	} else {
		c.JSON(http.StatusOK, gin.H{"deposits": []models.Deposit{}, "count": len(deposits)})
	}
}

func depositsCreateEndpoint(c *gin.Context) {
	var deposit models.Deposit

	current_user := getCurrentUser(c)

	err := c.BindJSON(&deposit)

	if err == nil {
		deposit.UserId = current_user.Id

		_, err := engine.Insert(&deposit)
		if err != nil {
			panic(err)
		}

		c.JSON(http.StatusOK, gin.H{"deposit": deposit})
	} else {
		fmt.Println(err)

		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
	}
}

func depositsShowEndpoint(c *gin.Context) {
	var deposit models.Deposit

	id := c.Param("id")

	_, err := engine.Where("deposits.id = ?", id).
		Get(&deposit)

	if err != nil {
		panic(err)
	}

	c.JSON(http.StatusOK, gin.H{"deposit": deposit})
}

func depositsUpdateEndpoint(c *gin.Context) {
	var deposit models.Deposit

	id := c.Param("id")

	err := c.BindJSON(&deposit)

	if err == nil {
		_, err = engine.Where("deposits.id = ?", id).
			Update(&deposit)

		if err != nil {
			panic(err)
		}

		c.JSON(http.StatusOK, gin.H{"deposit": deposit})
	} else {
		fmt.Println(err)

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
}

func depositsDeleteEndpoint(c *gin.Context) {
	var deposit models.Deposit

	id := c.Param("id")

	_, err := engine.Where("deposits.id = ?", id).
		Delete(&deposit)

	if err != nil {
		panic(err)
	}

	c.JSON(http.StatusOK, gin.H{})
}
