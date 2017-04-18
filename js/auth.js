import axios from 'axios'

module.exports = {
  login(email, password, callback) {
    // cb = arguments[arguments.length - 1]
    // if (localStorage.token) {
    //   if (cb) cb(true)
    //   this.onChange(true)
    //   return
    // }
    console.log("POST")

    axios.post('/auth/login', {
        'username': email,
        'password': password
      })
      .then((res) => {
        console.log("then")
        if (res) {
          localStorage.token = res.data.token
          localStorage.expire = res.data.expire
            // localStorage.email = res.data.email
            // localStorage.role = res.data.role
        }

        callback(true)
      })
      // .catch(this.onLoginError.bind(this))
  },

  // onLoginSuccess(res) {

  // },

  getToken() {
    return localStorage.token
  },

  getCurrentUserEmail() {
    return localStorage.email
  },

  getRole() {
    return localStorage.role
  },

  isAdmin() {
    this.isAuthenticated() && this.getRole() == 'admin'
  },

  isManager() {
    this.isAuthenticated() && this.getRole() == 'manager'
  },

  logout(cb) {
    delete localStorage.token
    if (cb) cb()
    this.onChange(false)
  },

  isAuthenticated() {
    return !!localStorage.token
  },

  getAuthHeaders() {
    return {
      "Authorization": "Bearer " + this.getToken()
    }
  },

  onChange(true_false) {
    // Set auth headers
  }
}