<template>
  <main class="profile">
    <h1>Profile</h1>
    <section class="user">
      <p v-for="(status, index) in emailStatus" :key="index" class="verification-notification">Awaiting verification for <strong>{{ status.email }}</strong>. Verification email will expire in {{ Math.floor((new Date(status.expiry) - new Date())/1000/60 + 1) }} minute{{ Math.floor((new Date(status.expiry) - new Date())/1000/60 + 1) !== 1 ? 's' : '' }}.</p>
      <form @submit.prevent="saveProfile">
        <div class="email-button-group" v-if="verified === false && emailStatus.length === 0"><div>Your email has not been verified.</div><button type="submit">Send Verification Email</button></div>
        <table>
          <tr><td>Username</td><td v-if="!editingProfile">{{ $store.user.username }}</td><td v-if="editingProfile"><input type="text" maxlength=50 v-model="$store.user.username" pattern="[A-Za-z0-9_]+"></td></tr>
          <tr><td>Email</td><td v-if="!editingProfile">{{ $store.user.email }}</td><td v-if="editingProfile"><input type="email" v-model="$store.user.email" v-if="emailStatus.length === 0"><input type="email" placeholder="Email verification in progress." disabled v-if="emailStatus.length > 0"></td></tr>
          <tr><td>Eligible</td><td v-if="!editingProfile">{{ $store.user.eligible ? 'Yes' : 'No' }}</td><td v-if="editingProfile">
            <label class="checkbox-container"><span v-if="$store.user.eligible">Yes</span><span v-if="!$store.user.eligible">No</span>
              <input v-model="$store.user.eligible" type="checkbox">
              <span class="checkmark"></span>
            </label>
          </td></tr>
        </table>
        <div class="editusercontainer">
          <button class="edituser" type="button" v-if="!editingProfile" @click.prevent="editProfile">Edit Profile</button>
          <button class="saveuser" type="submit" v-if="editingProfile">Save Profile</button>
        </div>
      </form>
    </section>
    <h1>Team</h1>
    <section class="team">
      <div v-if="(!$store.user.team || switchingTeam) && verified">
        <p v-if="!$store.user.team">You don't have a team yet.</p>
        <p v-if="switchingTeam">You are switching from the team <strong>{{ $store.user.team.name }}</strong>.</p>
        <div class="tabs">
          <div class="tab" :class="{active: team.action === 'join'}" @click="team.action = 'join'">Join Team</div><!--
          --><div class="tab" :class="{active: team.action === 'create'}" @click="team.action = 'create'">Create Team</div>
        </div>
        <form class="team" @submit.prevent="team.action === 'create' ? createTeam() : team.action === 'join' ? joinTeam() : null">
          <input v-model="team.name" type="text" placeholder="Team Name" pattern="[ -~]+" maxlength=50>
          <input v-model="team.affiliation" v-if="team.action === 'create'" type="text" placeholder="Affiliation" pattern="[ -~]+" maxlength=50>
          <input v-model="team.passcode" type="text" placeholder="Passcode">
          <button type="submit" v-if="team.action === 'join'">Join Team</button>
          <button type="submit" v-if="team.action === 'create'">Create Team</button>
          <button type="button" @click="switchingTeam = false" v-if="switchingTeam">Cancel</button>
        </form>
      </div>
      <div v-if="($store.user.team && $store.user.team.id && !switchingTeam) && verified">
        <form @submit.prevent="saveTeam"><table>
          <tr><td>Name</td><td v-if="!editingTeam"><router-link :to="'/teams/' + $store.user.team.id">{{ $store.user.team.name }}</router-link></td><td v-if="editingTeam"><input type="text" v-model="$store.user.team.name" pattern="[ -~]+" maxlength=50></td></tr>
          <tr><td>Eligible</td><td>{{ $store.user.team.eligible ? 'Yes' : 'No' }}</td></tr>
          <tr><td>Affiliation</td><td v-if="!editingTeam">{{ $store.user.team.affiliation }}</td><td v-if="editingTeam"><input type="text" v-model="$store.user.team.affiliation" pattern="[ -~]+" maxlength=50></td></tr>
          <tr><td>Members</td><td>{{ $store.user.team.members.map(member => member.username).join(', ') }}</td></tr>
        </table>
        <div class="editteamcontainer">
          <button type="button" class="editteam" v-if="!editingTeam" @click.prevent="editTeam">Edit Team</button>
          <button type="submit" class="saveteam" v-if="editingTeam">Save Team</button>
          <button type="button" class="editteam" @click="switchingTeam = true" v-if="new Date($store.competition.start) > new Date()">Switch Teams</button>
        </div></form>
      </div>
      <div v-if="verified === false">
        <p>You must verify your email before creating or joining a team.</p>
      </div>
    </section>
    <h1 v-if="$store.user.team && $store.user.team.id">Shell</h1>
    <section class="shell" v-if="$store.user.team && $store.user.team.id">
      <p>Connect to the shell server on the <router-link to="/shell">shell</router-link> page, or ssh to <code>{{ shell_url }}</code>.</p>
      <table>
        <tr><td>Username</td><td><code>{{ shell.username }}</code></td></tr>
        <tr><td>Password</td><td><code>{{ shell.password }}</code></td></tr>
      </table>
    </section>
  </main>
</template>

<script>
export default {
  name: 'profile',
  data () {
    return {
      team: {
        name: '',
        affiliation: '',
        passcode: '',
        action: 'join'
      },
      shell: {
        username: null,
        password: null
      },
      shell_url: null,
      editingProfile: false,
      editingTeam: false,
      switchingTeam: false,
      emailStatus: [],
      verified: null
    }
  },
  methods: {
    createTeam () {
      this.post('/teams', { name: this.team.name, affiliation: this.team.affiliation, passcode: this.team.passcode }).then(function () {
        this.switchingTeam = false
        this.alert('Success!', 'You have created a team.', 'success')
        this.reloadPage()
      }.bind(this)).catch(function (error) {
        if (error.response.data.message === 'invalid_values') this.alert('Whoops!', 'Make sure to fill out all required fields.', 'failure')
        else if (error.response.data.message === 'team_name_conflict') this.alert('Uh-oh!', 'That team name is already in use.', 'failure')
      }.bind(this))
    },
    joinTeam () {
      this.patch('/teams', { name: this.team.name, passcode: this.team.passcode }).then(function () {
        this.switchingTeam = false
        this.alert('Success!', 'You have joined a team.', 'success')
        this.reloadPage()
      }.bind(this)).catch(function (error) {
        if (error.response.data.message === 'invalid_values') this.alert('Whoops!', 'Make sure to fill out all required fields.', 'failure')
        else if (error.response.data.message === 'incorrect_passcode') this.alert('Whoops!', 'That passcode is incorrect.', 'failure')
        else if (error.response.data.message === 'team_not_found') this.alert('Whoops!', 'That team does not exist.', 'failure')
        else if (error.response.data.message === 'team_is_full') this.alert('Whoops!', 'That team is already full.', 'failure')
      }.bind(this))
    },
    loadShell () {
      if (this.$store.user.team && this.$store.user.team.id) {
        return this.get('/shell/team/' + this.$store.user.team.id).then(function (res) {
          this.shell = res.data
        }.bind(this))
      }
    },
    loadEmailStatus () {
      this.get('/self/verification').then(function (res) {
        this.emailStatus = res.data.pending
        this.verified = res.data.verified
      }.bind(this))
    },
    async reloadPage (reloadSite) {
      if (reloadSite === undefined) reloadSite = true
      if (reloadSite) await this.reload()
      await this.loadShell()
      await this.loadEmailStatus()
      this.$store.loaded = true
    },
    editProfile () {
      this.editingProfile = true
    },
    saveProfile () {
      this.patch('/users/' + this.$store.user.id, { username: this.$store.user.username, email: this.$store.user.email, eligible: this.$store.user.eligible }).then(function () {
        this.alert('Success!', 'Your changes were saved.', 'success')
        this.editingProfile = false
        this.reloadPage()
      }.bind(this)).catch(function (error) {
        if (error.response.data.message === 'invalid_values') this.alert('Whoops!', 'Make sure all required fields are filled out correctly.', 'failure')
        else if (error.response.data.message === 'username_email_conflict') this.alert('Uh-oh!', 'An account with that username or email already exists.', 'failure')
      }.bind(this))
    },
    editTeam () {
      this.editingTeam = true
    },
    saveTeam () {
      this.patch('/teams/' + this.$store.user.team.id, { name: this.$store.user.team.name, affiliation: this.$store.user.team.affiliation }).then(function () {
        this.alert('Success!', 'Your changes were saved.', 'success')
        this.editingTeam = false
        this.reloadPage()
      }.bind(this)).catch(function (error) {
        if (error.response.data.message === 'invalid_values') this.alert('Whoops!', 'Make sure all required fields are filled out correctly.', 'failure')
        else if (error.response.data.message === 'team_name_conflict') this.alert('Uh-oh!', 'A team with that name already exists.', 'failure')
      }.bind(this))
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (!vm.$store.user.id) { next('/login') }
    })
  },
  watch: {
    '$store.user.id': function () {
      if (!this.$store.user.id) { this.$router.push('/login') }
    },
    '$store.competition': function () {
      this.reloadPage(false)
    },
    '$store.team.id': function () {
      this.reloadPage(false)
    }
  },
  mounted () {
    this.$store.loaded = false
    this.shell_url = process.env.VUE_APP_SHELL_URL
    this.reloadPage()
  }
}
</script>

<style scoped>

</style>
