package forms

import "time"

type DepositForm struct {
  BankName      string    `json:"bank_name" form:"deposit[bank_name]" binding:"required"`
  AccountNumber string    `json:"account_number" form:"deposit[account_number]" binding:"required"`
  Ammount       int       `json:"ammount" form:"deposit[ammount]" binding:"required"`
  StartDate     time.Time `json:"start_date" form:"deposit[start_date]" binding:"required"`
  EndDate       time.Time `json:"end_date" form:"deposit[end_date]" binding:"required"`
  Interest      float32   `json:"interest" form:"deposit[interest]" binding:"required"`
  Taxes         float32   `json:"taxes" form:"deposit[taxes]" binding:"required"`
}

// type SignupForm struct {
//   Name     string `form:"name" json:"name" binding:"required,max=100"`
//   Email    string `form:"email" json:"email" binding:"required,email"`
//   Password string `form:"password" json:"password" binding:"required"`
// }