package forms

type UserForm struct {
	Name     string `json:"name" form:"user[name]" binding:"required,max=100"`
	Email    string `json:"email" form:"user[email]" binding:"required,email"`
	Password string `json:"password" form:"user[password]" binding:"required|omitempty"`
	Role     string `json:"role" form:"user[role]" binding:"required"`
}

type UserFormNoPass struct {
	Name  string `json:"name" form:"user[name]" binding:"required,max=100"`
	Email string `json:"email" form:"user[email]" binding:"required,email"`
	Role  string `json:"role" form:"user[role]" binding:"required"`
}
