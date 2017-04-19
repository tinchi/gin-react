package models

type Deposit struct {
	Id            int     `json:"id" form:"id"`
	BankName      string  `json:"bank_name" form:"deposit[bank_name]"`
	AccountNumber string  `json:"account_number" form:"deposit[account_number]"`
	Ammount       int     `json:"ammount" form:"deposit[ammount]"`
	StartDate     string  `json:"start_date" form:"deposit[start_date]"`
	EndDate       string  `json:"end_date" form:"deposit[end_date]"`
	Interest      float32 `json:"interest" form:"deposit[interest]"`
	Taxes         float32 `json:"taxes" form:"deposit[taxes]"`
}

func (c *Deposit) TableName() string {
	return "deposits"
}

type User struct {
	Id    int    `json:"id" form:"id"`
	Name  string `json:"name" form:"user[name]"`
	Email string `json:"email" form:"user[email]"`
}

func (c *User) TableName() string {
	return "users"
}