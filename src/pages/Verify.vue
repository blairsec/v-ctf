<template>
  <main class="verifyemail">
    <h1>Verify Email</h1>
    <section>
      <p v-if="status === 'failure'">Invalid verification token. Your link may have expired or already been used.</p>
      <p v-if="status === 'success'">Your email has been verified.</p>
    </section>
  </main>
</template>

<script>
export default {
  name: 'resetpassword',
  data () {
    return {
      status: ''
    }
  },
  mounted () {
    this.post('/self/verification', { token: this.$route.query.token }).then(function (res) {
      this.status = 'success'
    }.bind(this)).catch(function () {
      this.status = 'failure'
    }.bind(this))
  }
}
</script>

<style scoped>

</style>
