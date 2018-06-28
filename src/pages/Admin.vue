<template>
  <main class="admin">
    <h1>Admin Panel</h1>
    <div v-if="$store.user.admin === true">
      <h2>Home Page</h2>
      <section class="edithome">
        <form @submit.prevent="editHome">
          <input v-model="home.title" type="text" placeholder="Title">
          <textarea v-model="home.content" placeholder="Content"></textarea>
          <button type="submit">Save</button>
        </form>
      </section>
      <h2>Competitions</h2>
      <competitions-panel ref="competitionsPanel" :reloadAdmin="reloadAdmin"></competitions-panel>
      <div class="tabs">
        <div class="tab" @click="updateCompetition(competition)" :class="{ active: competition.id === $store.competition.id }" v-for="competition in $store.competitions">{{ competition.name }}</div>
      </div>
      <h2 class="competition" v-if="$store.competition">{{ $store.competition.name }}</h2>
      <section class="competition" v-if="$store.competition">
        <h3>Challenges</h3>
        <challenges-panel v-if="$store.competition" ref="challengesPanel" :reloadAdmin="reloadAdmin"></challenges-panel>
        <h3>Users</h3>
        <section class="users">
          <table v-if="users.length > 0">
            <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Username</th>
              <th>Team</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="user in users">
              <td>{{ user.id }}</td>
              <td class="long">{{ user.email }}</td>
              <td class="long">{{ user.username }}</td>
              <td class="long">{{ user.team ? user.team.name : 'None' }}</td>
            </tr>
            </tbody>
          </table>
          <p v-if="users.length === 0">No users have been created yet.</p>
        </section>
      </section>
    </div>
    <section v-if="register === true">
      <p>No admin accounts have been created yet.</p>
      <form @submit.prevent="registerAdmin">
        <input v-model="adminRegister.email" placeholder="Email" type="text">
        <input v-model="adminRegister.username" placeholder="Username" type="text">
        <input v-model="adminRegister.password" placeholder="Password" type="password">
        <button type="submit">Sign Up</button>
      </form>
    </section>
    <section v-if="!$store.user.admin && register === false">
      <form @submit.prevent="loginAdmin">
        <input v-model="adminLogin.username" placeholder="Username" type="text">
        <input v-model="adminLogin.password" placeholder="Password" type="password">
        <button type="submit">Log In</button>
      </form>
    </section>
  </main>
</template>

<script>
import Dialog from '@/components/Dialog'
import CompetitionsPanel from '@/components/admin/CompetitionsPanel'
import ChallengesPanel from '@/components/admin/ChallengesPanel'

export default {
  data () {
    return {
      register: null,
      adminRegister: {
        email: '',
        username: '',
        password: ''
      },
      adminLogin: {
        username: '',
        password: ''
      },
      users: [],
      home: {
        title: '',
        content: ''
      }
    }
  },
  computed: {
    newCompetitionStart () {
      return new Date(this.newCompetition.startDate + ' ' + this.newCompetition.startTime).toISOString()
    },
    newCompetitionEnd () {
      return new Date(this.newCompetition.endDate + ' ' + this.newCompetition.endTime).toISOString()
    }
  },
  components: {
    Dialog,
    CompetitionsPanel,
    ChallengesPanel
  },
  watch: {
    '$store.competition' () {
      this.reloadAdmin()
    }
  },
  methods: {
    registerAdmin () {
      this.post('/admin', {
        email: this.adminRegister.email,
        username: this.adminRegister.username,
        password: this.adminRegister.password
      }, false).then(this.reload).then(this.reloadAdmin)
    },
    loginAdmin () {
      this.post('/admin/auth', {
        username: this.adminLogin.username,
        password: this.adminLogin.password
      }, false).then(this.reload).then(this.reloadAdmin)
    },
    reloadAdmin () {
      this.get('/admin', false).then(function (res) {
        if (res.data.length === 0) {
          this.register = true
          return
        }
        this.register = false
      }.bind(this))
      if (this.$store.competition) {
        this.get('/users').then(function (res) {
          this.users = res.data
        }.bind(this))
      }
      this.get('/home', false).then(function (res) {
        this.home = res.data
      }.bind(this))
      if (this.$refs.challengesPanel && this.$refs.competitionsPanel) {
        this.$refs.challengesPanel.reloadPanel()
        this.$refs.competitionsPanel.reloadPanel()
      }
    },
    editHome () {
      this.put('/home', this.home, false)
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.reload()
      vm.reloadAdmin()
    })
  }
}
</script>

<style>

</style>
