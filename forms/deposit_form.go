package forms

import "time"

type DepositForm struct {
  BankName      string    `json:"bank_name" form:"deposit[bank_name]" binding:"required"`
  AccountNumber string    `json:"account_number" form:"deposit[account_number]" binding:"required"`
  Ammount       int       `json:"ammount" form:"deposit[ammount]" binding:"required,min=0"`
  StartDate     time.Time `json:"start_date" form:"deposit[start_date]" binding:"required"`
  EndDate       time.Time `json:"end_date" form:"deposit[end_date]" binding:"required"`
  Interest      float32   `json:"interest" form:"deposit[interest]" binding:"required"`
  Taxes         float32   `json:"taxes" form:"deposit[taxes]" binding:"required,min=0""`
}