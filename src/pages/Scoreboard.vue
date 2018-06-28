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
            <td class="long">{{ team.name }}</td>
            <td class="long">{{ team.affiliation }}</td>
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
      origTeams: [],
      showIneligible: true,
      interval: null
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
      this.loadTeams(false)
    }
  },
  methods: {
    loadTeams (request) {
      var promise
      if (request === false) {
        promise = new Promise(function (resolve, reject) { resolve({data: this.origTeams}) }.bind(this))
      } else {
        promise = this.get('/teams')
      }
      promise.then(function (res) {
        var teams = res.data
        if (request !== false) this.origTeams = teams
        if (!this.showIneligible) {
          teams = res.data.filter(team => team.eligible)
        }
        teams = teams.filter(function (team) { return +new Date(team.created) < +new Date(this.$store.competition.end) }.bind(this))
        this.number(teams)
        this.teams = teams
        if (!this.$store.loaded) {
          this.$store.loaded = true
          this.loadTeams(false)
        } else this.$refs.chart.updatePoints(this.teams.slice(0, 10))
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
  },
  mounted () {
    this.$store.loaded = false
    this.interval = setInterval(this.loadTeams, 30000)
  },
  beforeRouteLeave (to, from, next) {
    clearInterval(this.interval)
    next()
  }
}
</script>

<style scoped>

</style>