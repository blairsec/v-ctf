<template>
    <main class="shell">
      <iframe src="/shell.html" class="shellframe"></iframe>
      <p>Log in with the following credentials (note that you can't copy and paste):
      <ul><li>Username: <code>{{ shell.username }}</code></li>
      <li>Password: <code>{{ shell.password }}</code></li></ul></p>
    </main>
</template>

<style scoped lang="scss">
@import '../theme/colors.scss';
.shellframe {
  width: 100%;
  border: 1px solid $primary;
  flex: 1 0;
}
.shell {
  display: flex;
  flex-direction: column;
}
</style>

<script>
export default {
  name: 'profile',
  data () {
    return {
      shell: {
        username: null,
        password: null
      }
    }
  },
  methods: {
    loadShell () {
      this.get('/shell/team/' + this.$store.user.team.id).then(function (res) {
        this.shell = res.data
      }.bind(this))
    }
  },
  mounted () {
    this.loadShell()
  }
}
</script>
