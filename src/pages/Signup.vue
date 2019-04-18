<template>
  <main class="signup">
    <h1>Signup</h1>
    <section>
      <form @submit.prevent="createUser">
        <small>Email</small>
        <input v-model="email" type="email" placeholder="Email address" required>
        <small>Username (must contain only alphanumerics and underscores)</small>
        <input v-model="username" placeholder="Username" type="text" required maxlength=50 pattern="[A-Za-z0-9_]+">
        <small>Password (must be at least 8 characters long)</small>
        <input v-model="password" placeholder="Password" type="password" required pattern=".{8}.*">
        <label class="checkbox-container">I am eligible for prizes in this competition.
          <input v-model="eligible" type="checkbox">
          <span class="checkmark"></span>
        </label>
        <div class="g-recaptcha" data-sitekey="6Lc9EJ8UAAAAAJ_pV0yiVUIytkDMgYk-LVO-Df0n"></div>
        <button type="submit">Sign Up</button>
      </form>
    </section>
  </main>
</template>

<script>
export default {
  name: 'Signup',
  data () {
    return {
      email: '',
      username: '',
      password: '',
      eligible: false
    }
  },
  methods: {
    createUser () {
      this.post('/users', { username: this.username, password: this.password, email: this.email, eligible: this.eligible }, true, { captcha: grecaptcha.getResponse() }).then(function () {
        this.alert('Success!', 'You have created an account. Log in to get started!', 'success')
        this.email = ''
        this.username = ''
        this.password = ''
        this.eligible = false
      }.bind(this)).catch(function (error) {
        if (error.response.data.message === 'invalid_values' && this.password.length < 8) this.alert('Whoops!', 'Make sure your password is at least 8 characters long.', 'failure')
        else if (error.response.data.message === 'invalid_values') this.alert('Whoops!', 'Make sure all required fields are filled out.', 'failure')
        else if (error.response.data.message === 'username_email_conflict') this.alert('Uh-oh!', 'An account with that username or email already exists.', 'failure')
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
