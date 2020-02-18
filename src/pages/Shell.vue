<template>
    <main class="shell">
      <iframe :src="webshell_url" class="shellframe"></iframe>
      <p v-if="$store.user && (!$store.user.team || !$store.user.team.id)">You must create or join a team to receive credentials for the shell server.</p>
      <div v-if="$store.user && $store.user.team && $store.user.team.id">
        <p>Log in with the following credentials (note that you can't copy and paste):
        <ul><li>Username: <code>{{ shell.username }}</code></li>
        <li>Password: <code>{{ shell.password }}</code></li></ul></p>
      </div>
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
      },
      webshell_url: null
    }
  },
  watch: {
    '$store.user.id': function () {
      if (!this.$store.user.id) { this.$router.push('/login') }
    }
  },
  methods: {
    loadShell () {
      this.get('/shell/team/' + this.$store.user.team.id).then(function (res) {
        this.shell = res.data
        this.webshell_url = process.env.VUE_APP_WEB_SHELL_URL+'#'+this.shell.username+':'+this.shell.password
      }.bind(this))
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (!vm.$store.user.id) {
        next({
          path: '/login',
          replace: true
        })
      }
    })
  },
  mounted () {
    this.loadShell()
  }
}
</script>
