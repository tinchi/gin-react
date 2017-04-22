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

        axios.get('/v1/user/me', {
          "headers": this.getAuthHeaders()
        }).then((res) => {
          if (res) {
            localStorage.email = res.data.email
            localStorage.role = res.data.role
          }

          callback(true)

        })

      }).catch(onError.bind(this))
  },

  getToken() {
    return localStorage.token
  },

  getEmail() {
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

  tockenExpired() {
    return new Date(localStorage.expire) < new Date()
  },

  logout(cb) {
    delete localStorage.clear()
    if (cb) cb()
  },

  isAuthenticated() {
    if (this.tockenExpired()) {
      this.logout()
      return false
    }

    return !!localStorage.token
  },

  getAuthHeaders() {
    return {
      "Authorization": "Bearer " + this.getToken()
    }
  }

}