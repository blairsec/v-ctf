<template>
  <main class="login">
    <h1>Login</h1>
    <section>
      <form @submit.prevent="login">
        <input placeholder="username" :value="username" type="text">
        <input placeholder="password" :value="password" type="password">
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
      this.post('/auth', { username: this.username, password: this.password }).then(function () {
        this.$router.push('/')
      }.bind(this)).catch(function (error) {
        console.log(error.response.data)
      })
    }
  }
}
</script>

<style scoped>

</style>
