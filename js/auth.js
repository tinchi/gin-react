import axios from 'axios'

module.exports = {
  login(email, password, callback, onError) {
    axios.post('/auth/login', {
        'username': email,
        'password': password
      })
      .then((res) => {
        if (res) {
          localStorage.token = res.data.token
          localStorage.expire = res.data.expire
        }

        callback(true)
      }).catch(onError.bind(this))
  },

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
  },

  isAuthenticated() {
    console.log('isAuthenticated', !!localStorage.token)
    return !!localStorage.token
  },

  getAuthHeaders() {
    return {
      "Authorization": "Bearer " + this.getToken()
    }
  },

}