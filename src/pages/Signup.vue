<template>
  <main class="signup">
    <h1>Signup</h1>
    <section>
      <form @submit.prevent="createUser">
        <input v-model="email" type="email" placeholder="Email">
        <input v-model="username" placeholder="Username" type="text">
        <input v-model="password" placeholder="Password" type="password">
        <label class="checkbox-container">I am eligible for prizes in this competition.
          <input v-model="eligible" type="checkbox">
          <span class="checkmark"></span>
        </label>
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
      eligible: null
    }
  },
  methods: {
    createUser () {
      this.post('/users', { username: this.username, password: this.password, email: this.email, eligible: this.eligible }).then(function () {
      })
    }
  }
}
</script>

<style scoped>

</style>
