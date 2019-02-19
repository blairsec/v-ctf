<template>
  <main class="resetpassword">
    <h1>Reset Password</h1>
    <section v-if="!$route.query.token">
      <p>Enter your email address to receive a password reset email.</p>
      <form @submit.prevent="reset">
        <input placeholder="Email Address" v-model="email" type="email" required>
        <button type="submit">Reset Password</button>
      </form>
    </section>
    <section v-if="$route.query.token">
      <p>Enter a new password for user <strong>{{ user.username }}</strong>.</p>
      <form @submit.prevent="set">
        <input placeholder="New Password" v-model="password" type="password" required pattern=".{8}.*">
        <button type="submit">Set Password</button>
      </form>
    </section>
  </main>
</template>

<script>
export default {
  name: 'resetpassword',
  data () {
    return {
      email: '',
      password: '',
      user: {
        id: null,
        username: ''
      }
    }
  },
  methods: {
    reset () {
      this.post('/auth/reset/token', { email: this.email }).then(function (res) {
        this.email = ''
        this.alert('Success!', 'A password reset email has been sent.', 'success')
      }.bind(this)).catch(function (err) {
        if (err.response.data.message === 'password_reset_already_active') {
          this.alert('Oops!', 'That account already has an active password reset token.')
        } else if (err.response.data.message === 'user_not_found') {
          this.alert('Oops!', 'No account has been created with that email.', 'failure')
        }
      }.bind(this))
    },
    set () {
      this.post('/auth/reset', { token: this.$route.query.token, password: this.password }).then(function (res) {
        this.password = ''
        this.alert('Success!', 'Your password has been changed', 'success')
        this.$router.push('/login')
      }.bind(this)).catch(function (err) {
        if (err) {
          this.alert('Oops!', 'Something went wrong.', 'failure')
        }
      }.bind(this))
    }
  },
  mounted () {
    if (this.$route.query.token) {
      this.get('/auth/reset/token?token=' + this.$route.query.token).then(function (res) {
        console.log('hey')
        this.user = res.data.user
      }.bind(this)).catch(function (err) {
        if (err) {
          this.$router.replace({ query: { token: undefined } })
          this.alert('Oops!', 'The password reset token may have expired or already been used.', 'failure')
        }
      }.bind(this))
    }
  }
}
</script>

<style scoped>

</style>
