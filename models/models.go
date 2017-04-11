package models

type Deposit struct {
	Id            int    `json:"id" form:"id"`
	BankName      string `json:"bank_name" form:"deposit[bank_name]" binding:"required"`
	AccountNumber string `json:"account_number" form:"deposit[account_number]" binding:"required"`
}
