package models

import (
	"time"
)

type Deposit struct {
	Id            int       `json:"id" xorm:"autoincr"`
	BankName      string    `json:"bank_name" form:"deposit[bank_name]"`
	AccountNumber string    `json:"account_number" form:"deposit[account_number]"`
	Ammount       int       `json:"ammount" form:"deposit[ammount]"`
	StartDate     time.Time `json:"start_date" form:"deposit[start_date]"`
	EndDate       time.Time `json:"end_date" form:"deposit[end_date]"`
	Interest      float32   `json:"interest" form:"deposit[interest]"`
	Taxes         float32   `json:"taxes" form:"deposit[taxes]"`
	UserId        int       `xorm:"'user_id'" json:"user_id"`
}

func (c *Deposit) TableName() string {
	return "deposits"
}

type User struct {
	Id       int       `json:"id" xorm:"autoincr"`
	Name     string    `json:"name" form:"user[name]"`
	Email    string    `json:"email" form:"user[email]" xorm:"unique"`
	Password string    `json:"-" form:"user[password]"`
	Role     string    `json:"role" form:"user[role]"`
	Deposits []Deposit `json:"-"`
}

func (c *User) TableName() string {
	return "users"
}

type SignupForm struct {
	Name     string `form:"name" json:"name" binding:"required,max=100"`
	Email    string `form:"email" json:"email" binding:"required,email"`
	Password string `form:"password" json:"password" binding:"required"`
}