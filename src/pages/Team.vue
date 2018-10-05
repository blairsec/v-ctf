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
      <table>
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
        members: []
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
      } catch (e) {
        if (e.response.status === 404) {
          this.$router.push({ path: '/404' })
        } else {
          throw e
        }
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => vm.loadTeam())
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
