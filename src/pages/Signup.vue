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
      eligible: false
    }
  },
  methods: {
    createUser () {
      this.post('/users', { username: this.username, password: this.password, email: this.email, eligible: this.eligible }).then(function () {
        this.alert('Success!', 'You have created an account. Log in to get started!', 'success')
      }.bind(this)).catch(function (error) {
        if (error.response.data.message === 'invalid_values' && this.password.length < 8) this.alert('Whoops!', 'Make sure your password is at least 8 characters long.', 'failure')
        else if (error.response.data.message === 'invalid_values') this.alert('Whoops!', 'Make sure all required fields are filled out.', 'failure')
        else if (error.response.data.message === 'username_email_conflict') this.alert('Uh-oh!', 'An account with that username or email already exists.', 'failure')
      }.bind(this))
    }
  }
}
</script>

<style scoped>

</style>
