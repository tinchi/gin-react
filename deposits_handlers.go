package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/tinchi/gin-react/models"
	"net/http"
)

func depositsIndexEndpoint(c *gin.Context) {
	var deposits []models.Deposit

	err := engine.Find(&deposits)

	if err != nil {
		fmt.Println(err)
	}

	c.JSON(http.StatusOK, gin.H{"deposits": deposits, "count": len(deposits)})
}

func depositsCreateEndpoint(c *gin.Context) {
	var deposit models.Deposit

	err := c.BindJSON(&deposit)

	if err == nil {
		_, err := engine.Insert(&deposit)
		if err != nil {
			panic(err)
		}

		c.JSON(http.StatusOK, gin.H{"deposit": deposit})
	} else {
		fmt.Println(err)

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
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
