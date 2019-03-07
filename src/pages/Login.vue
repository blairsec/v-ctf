<template>
  <main class="login">
    <h1>Login</h1>
    <section>
      <form @submit.prevent="login">
        <small>Username</small>
        <input placeholder="Username" v-model="username" type="text" required>
        <small>Password <router-link to="/resetpassword">(Forgot password?)</router-link></small>
        <input placeholder="Password" v-model="password" type="password" required>
        <button>Log In</button>
      </form>
    </section>
  </main>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login () {
      this.post('/auth', { username: this.username, password: this.password }).then(function (res) {
        localStorage['competition_' + this.$store.competition.id] = res.data.token
        this.$router.push('/')
      }.bind(this)).then(this.reload).then(function () { this.alert('Success!', 'You have logged in.', 'success') }.bind(this)).catch(function (error) {
        if (error.response.status === 401) this.alert('Uh-oh!', 'You couldn\'t be logged in. Wrong username or password?', 'failure')
        else if (error.response.status === 400) this.alert('Uh-oh!', 'Make sure to fill out all required fields.', 'failure')
      }.bind(this))
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.$store.user.id) {
        next({
          path: '/profile',
          replace: true
        })
      }
    })
  }
}
</script>

<style scoped>

</style>
