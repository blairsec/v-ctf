<template>
  <main class="login">
    <h1>Login</h1>
    <section>
      <form @submit.prevent="login">
        <input placeholder="Username" v-model="username" type="text">
        <input placeholder="Password" v-model="password" type="password">
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
      }.bind(this)).then(this.reload)
    }
  }
}
</script>

<style scoped>

</style>
