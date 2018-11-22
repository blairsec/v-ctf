<template>
  <main class="team">
    <h1>Team</h1><h1>{{ team.name }}</h1>
    <section class="team">
      <h3>Info</h3>
      <table>
        <tr><td>Name</td><td>{{ team.name }}</td></tr>
        <tr><td>Eligible</td><td>{{ team.eligible ? "Yes" : "No" }}</td></tr>
        <tr><td>Affiliation</td><td>{{ team.affiliation }}</td></tr>
      </table>
      <h3>Members</h3>
      <ul>
        <li v-for="member in team.members">{{ member.username }}</li>
      </ul>
      <h3>Score Graph</h3>
      <chart id="chart" ref="chart"></chart>
      <h3>Solves</h3>
      <table v-if="team.solves.length > 0">
        <thead>
          <th>#</th>
          <th>Challenge</th>
          <th>Points</th>
          <th>Time</th>
          <th>User</th>
        </thead>
        <tbody>
          <tr v-for="(solve, index) in team.solves">
            <td>{{ index+1 }}</td>
            <td class="long">{{ solve.challenge.title }}</td>
            <td>{{ solve.challenge.value }}</td>
            <td class="long">{{ new Date(solve.time) .toLocaleString() }}</td>
            <td>{{ solve.user.username ? solve.user.username : "—" }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="team.solves.length === 0">This team hasn't solved anything yet.</p>
    </section>
  </main>
</template>

<script>
import Chart from '../components/Chart'
export default {
  name: 'team',
  data () {
    return {
      team: {
        name: '',
        affiliation: '',
        eligible: null,
        members: [],
        solves: []
      }
    }
  },
  components: {
    Chart
  },
  methods: {
    async loadTeam () {
      try {
        var team = await this.get('/teams/' + this.$route.params.id)
        this.team = team.data
        this.team.solves.sort((a, b) => +new Date(a.time) - +new Date(b.time))
        this.$refs.chart.updatePoints([this.team])
        this.$store.title = 'Team ' + this.team.name
        if (!this.$store.loaded) {
          this.$store.loaded = true
          this.loadTeam()
        }
      } catch (e) {
        if (e.response.status === 404) {
          this.$router.push({ path: '/404' })
        } else {
          throw e
        }
      }
    }
  },
  mounted () {
    this.$store.loaded = false
    this.loadTeam()
  }
}
</script>

<style lang="scss">
.team .container-container {
  padding-top: 0.3em;
}
.team .chart-container {
  height: 10em;
  svg {
    width: calc(100% - 1em);
  }
}
</style>
