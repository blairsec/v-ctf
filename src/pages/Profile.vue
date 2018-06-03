<template>
  <main class="profile">
    <h1>Profile</h1>
    <section class="user">
      <table>
        <tr><td>Username</td><td>{{ $store.user.username }}</td></tr>
        <tr><td>Email</td><td>{{ $store.user.email }}</td></tr>
      </table>
    </section>
    <h1>Team</h1>
    <section class="team">
      <div v-if="!$store.user.team">
        <p>You don't have a team yet.</p>
        <div class="tabs">
          <div class="tab" :class="{active: team.action === 'join'}" @click="team.action = 'join'">Join Team</div><!--
          --><div class="tab" :class="{active: team.action === 'create'}" @click="team.action = 'create'">Create Team</div>
        </div>
        <form class="team" @submit.prevent="team.action === 'create' ? createTeam() : team.action === 'join' ? joinTeam() : null">
          <input v-model="team.name" type="text" placeholder="Team Name">
          <input v-model="team.affiliation" v-if="team.action === 'create'" type="text" placeholder="Affiliation">
          <input v-model="team.passcode" type="text" placeholder="Passcode">
          <button type="submit" v-if="team.action === 'join'">Join Team</button>
          <button type="submit" v-if="team.action === 'create'">Create Team</button>
        </form>
      </div>
      <div v-if="$store.user.team">
        <table>
          <tr><td>Name</td><td>{{ $store.user.team.name }}</td></tr>
          <tr><td>Eligible</td><td>{{ $store.user.team.eligible ? 'Yes' : 'No' }}</td></tr>
          <tr><td>Affiliation</td><td>{{ $store.user.team.affiliation }}</td></tr>
          <tr><td>Members</td><td>{{ $store.user.team.members.map(member => member.username).join(', ') }}</td></tr>
        </table>
      </div>
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
      }
    }
  },
  methods: {
    createTeam () {
      this.post('/teams', { name: this.team.name, affiliation: this.team.affiliation, passcode: this.team.passcode })
    },
    joinTeam () {
      this.patch('/teams', { name: this.team.name, passcode: this.team.passcode })
    }
  }
}
</script>

<style scoped>

</style>
