<template>
  <main class="admin">
      <h1>Admin Panel</h1>
    <div v-if="register === false && login === false">
      <h2>Competitions</h2>
      <section class="competitions">
        <table v-if="$store.competitions.length > 0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Teams</th>
              <th>Users</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="competition in $store.competitions">
              <td>{{ competition.id }}</td>
              <td>{{ competition.name }}</td>
              <td>{{ competition.teams }}</td>
              <td>{{ competition.users }}</td>
            </tr>
          </tbody>
        </table>
        <p v-if="$store.competitions.length === 0">No competitions found.</p>
        <Dialog>
          <template scope="dialog">
            <form @submit.prevent="createCompetition(dialog)">
              <input v-model="newCompetition.name" type="text" placeholder="Name">
              <input v-model="newCompetition.startDate" name="start-date" type="date">
              <input v-model="newCompetition.startTime" name="start-time" type="time">
              <input v-model="newCompetition.endDate" name="end-date" type="date">
              <input v-model="newCompetition.endTime" name="end-time" type="time">
              <button type="reset" @click="resetNewCompetition(dialog)">Cancel</button>
              <button type="submit">Create</button>
            </form>
          </template>
        </Dialog>
      </section>
    </div>
    <section v-if="register === true">
      <p>No admin accounts have been created yet.</p>
      <form @submit.prevent="registerAdmin">
        <input v-model="adminRegister.email" placeholder="email" type="text">
        <input v-model="adminRegister.username" placeholder="username" type="text">
        <input v-model="adminRegister.password" placeholder="password" type="password">
        <button type="submit">Sign Up</button>
      </form>
    </section>
    <section v-if="login === true">
      <form @submit.prevent="loginAdmin">
        <input v-model="adminLogin.username" placeholder="username" type="text">
        <input v-model="adminLogin.password" placeholder="password" type="password">
        <button type="submit">Log In</button>
      </form>
    </section>
  </main>
</template>

<script>
import Dialog from '@/components/Dialog'

export default {
  data () {
    return {
      newCompetition: {
        name: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: ''
      },
      register: null,
      login: null,
      adminRegister: {
        email: '',
        username: '',
        password: ''
      },
      adminLogin: {
        username: '',
        password: ''
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
    Dialog
  },
  methods: {
    createCompetition (dialog) {
      this.post('/competitions', {
        name: this.newCompetition.name,
        start: this.newCompetitionStart,
        end: this.newCompetitionEnd
      }, false).then(function (data) {
        if (dialog) { this.resetNewCompetition(dialog) }
      }.bind(this))
    },
    resetNewCompetition (dialog) {
      this.newCompetition.endTime = this.newCompetition.endDate = this.newCompetition.startTime = this.newCompetition.startDate = this.newCompetition.name = ''
      if (dialog) { dialog.open(false) }
    },
    registerAdmin () {
      this.post('/admin', {
        email: this.adminRegister.email,
        username: this.adminRegister.username,
        password: this.adminRegister.password
      }, false).then(function (res) {
        console.log(res)
      })
    },
    loginAdmin () {
      this.post('/admin/auth', {
        username: this.adminLogin.username,
        password: this.adminLogin.password
      }, false)
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.get('/admin', false).then(function (res) {
        if (res.data.length === 0) {
          this.register = true
          this.login = false
        } else {
          this.register = false
          vm.get('/admin/self', false).then(function (res) {
            if (res.data.admin) this.login = false
            else this.login = true
          }.bind(vm)).catch(function () {
            this.login = true
          }.bind(vm))
        }
        next()
      }.bind(vm))
    })
  }
}
</script>

<style>

</style>
