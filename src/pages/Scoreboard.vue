<template>
  <main class="scoreboard">
    <h1>Scoreboard</h1>
    <chart ref="chart"></chart>
    <label class="checkbox-container">Show ineligible teams
      <input v-model="showIneligible" type="checkbox">
      <span class="checkmark"></span>
    </label>
    <section>
      <table class="scoreboard">
        <thead>
          <tr>
            <th>#</th>
            <th>Team</th>
            <th>Affiliation</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(team, index) in teams">
            <td>{{ index+1 }}</td>
            <td>{{ team.name }}</td>
            <td>{{ team.affiliation }}</td>
            <td>{{ team.score }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</template>

<script>
import Chart from '../components/Chart'

export default {
  name: 'Scoreboard',
  data () {
    return {
      teams: [],
      showIneligible: true
    }
  },
  components: {
    Chart
  },
  watch: {
    '$store.competition' () {
      this.loadTeams()
    },
    showIneligible () {
      this.loadTeams()
    }
  },
  methods: {
    loadTeams () {
      this.get('/teams').then(function (res) {
        var teams = res.data
        if (!this.showIneligible) {
          teams = res.data.filter(team => team.eligible)
        }
        this.number(teams)
        this.teams = teams
        this.$refs.chart.updatePoints(this.teams)
      }.bind(this))
    },
    number (teams) {
      teams.sort(function (a, b) {
        if (a.score !== b.score) {
          return b.score - a.score
        } else {
          return Math.max(...a.solves.map(solve => +new Date(solve.time))) - Math.max(...b.solves.map(solve => +new Date(solve.time)))
        }
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => vm.loadTeams())
  }
}
</script>

<style scoped>

</style>
