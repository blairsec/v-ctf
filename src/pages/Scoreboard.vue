
<template>
  <main class="scoreboard">
    <h1>Scoreboard</h1>
    <chart ref="chart"></chart>
    <div class="scoreboard-filters">
      <label class="checkbox-container">Show ineligible teams
        <input v-model="showIneligible" type="checkbox">
        <span class="checkmark"></span>
      </label>&ensp;
      <label class="checkbox-container" v-if="new Date($store.competition.end) < new Date()">Freeze scoreboard
        <input v-model="freeze" type="checkbox">
        <span class="checkmark"></span>
      </label>
    </div>
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
          <tr v-for="(team, index) in teams" :key="team.id">
            <td>{{ index+1 }}</td>
            <td class="long"><router-link :to="'/teams/'+team.id">{{ team.name }}</router-link></td>
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
      freeze: true,
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
    },
    freeze () {
      this.loadTeams()
    }
  },
  methods: {
    loadTeams (request) {
      var promise
      if (request === false) {
        promise = new Promise(function (resolve, reject) { resolve({ data: this.origTeams }) }.bind(this))
      } else {
        promise = this.get('/teams' + (this.freeze ? '?frozen=1' : ''))
      }
      promise.then(function (res) {
        var teams = res.data.filter(function (team) { return !this.freeze || (+new Date(team.created) < +new Date(this.$store.competition.end)) }.bind(this))
        if (request !== false) this.origTeams = teams
        if (!this.showIneligible) {
          teams = res.data.filter(function (team) { return team.eligible }.bind(this))
        }
        this.number(teams)
        this.teams = teams
        if (!this.$store.loaded) {
          this.$store.loaded = true
          this.loadTeams(false)
        } else {
          var chartTeams = this.teams.slice(0, 10)
          for (var i = 0; i < chartTeams.length; i++) {
            chartTeams[i] = this.get('/teams/' + chartTeams[i].id)
          }
          Promise.all(chartTeams).then(function (responseList) {
            this.$refs.chart.updatePoints(responseList.map(res => res.data), this.freeze)
          }.bind(this))
        }
      }.bind(this))
    },
    number (teams) {
      teams.sort(function (a, b) {
        if (a.score !== b.score) {
          return b.score - a.score
        } else {
          return +new Date(a.lastSolve) - +new Date(b.lastSolve)
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
