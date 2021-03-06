package models

import (
	"time"
)

type Deposit struct {
	Id            int       `json:"id" xorm:"autoincr"`
	BankName      string    `json:"bank_name" form:"deposit[bank_name]"`
	AccountNumber string    `json:"account_number" form:"deposit[account_number]"`
	Amount        int       `xorm:"index" json:"amount" form:"deposit[amount]"`
	StartDate     time.Time `xorm:"index" json:"start_date" form:"deposit[start_date]"`
	EndDate       time.Time `xorm:"index" json:"end_date" form:"deposit[end_date]"`
	Interest      float32   `json:"interest" form:"deposit[interest]"`
	Taxes         float32   `json:"taxes" form:"deposit[taxes]"`
	UserId        int       `xorm:"index" json:"user_id"`
	CreatedAt     time.Time `xorm:"created" json:"created_at" `
}

func (c *Deposit) TableName() string {
	return "deposits"
}

type User struct {
	Id        int       `json:"id" xorm:"autoincr"`
	Name      string    `json:"name" form:"user[name]"`
	Email     string    `json:"email" form:"user[email]" xorm:"unique"`
	Password  string    `json:"-" form:"user[password]"`
	Role      string    `json:"role" form:"user[role]"`
	Deposits  []Deposit `json:"-"`
	CreatedAt time.Time `xorm:"created" json:"created_at"`
}

func (c *User) TableName() string {
	return "users"
}

type SignupForm struct {
	Name     string `form:"name" json:"name" binding:"required,max=100"`
	Email    string `form:"email" json:"email" binding:"required,email"`
	Password string `form:"password" json:"password" binding:"required"`
}
