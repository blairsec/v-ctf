<template>
  <main class="challenges">
    <h1>Challenges</h1>
    <section>
      <ul class="categoryList" v-for="category in categories">
        <li class="categoryTitle"><h2>{{ category }}</h2></li>
        <ul class="challengeList">
          <li class="challenge" :class="{ solved: $store.user.team && $store.user.team.solves.filter(s => s.challenge.id === challenge.id)[0] }" v-for="challenge in challenges" v-if="challenge.category === category" @click="showChallenge(challenge.id)">
            <h1 class="title">{{ challenge.title }}</h1>
            <div class="category">{{ challenge.category }}</div>
            <div class="value">{{ challenge.value }}</div>
            <div class="solves">{{ challenge.solves }}</div>
          </li>
        </ul>
      </ul>
      <Dialog v-for="challenge in challenges" :key="challenge.id" class="challengeModal" :ref="'dialog' + challenge.id.toString()">
        <template slot-scope="dialog">
          <h1 class="title">{{ challenge.title }}</h1><span class="category">{{ challenge.category }}</span>
          <div class="value">{{ challenge.value }}</div>
          <div class="solves">{{ challenge.solves }}</div>
          <p class="description" v-html="markdown(challenge.description)"></p>
          <button class="hintButton" @click="toggleHint(challenge.id)" v-if="challenge.hint">{{ showHint[challenge.id] ? 'Hide' : 'Show' }} Hint</button>
          <button class="hintButton" @click="toggleSolves(challenge.id)">{{ showSolves[challenge.id] ? 'Hide' : 'Show' }} Solves</button>
          <transition name="challengeHintTransition">
            <p class="hint" v-html="markdown(challenge.hint)" v-if="challenge.hint && showHint[challenge.id]"></p>
          </transition>
          <table class="solveTable" :class="{ 'hideSolves': !showSolves[challenge.id] }">
            <thead>
              <tr><th>Team</th><th>Affiliation</th></tr>
            </thead>
            <tbody style="max-height: 10em;">
              <tr v-for="solve in challengeSolves"><td class="long"><router-link :to="'/teams/'+solve.team.id">{{ solve.team.name }}</router-link></td><td class="long">{{ solve.team.affiliation }}</td></tr>
            </tbody>
          </table>
          <form @submit.prevent="submitFlag" :id="challenge.id">
            <input type="text" class="flagInput" placeholder="Flag" v-model="flagInput" v-if="$store.user.id && $store.user.team && !$store.user.team.solves.filter(s => s.challenge.id === challenge.id)[0]">
            <p v-if="!$store.user.id"><em>Create an account or log in to submit flags.</em></p>
            <p v-if="$store.user.id && !$store.user.team"><em>Create or join a team to submit flags.</em></p>
            <p v-if="$store.user.team && $store.user.team.solves.filter(s => s.challenge.id === challenge.id)[0]"><em>You already solved this challenge!</em></p>
            <button v-if="$store.user.id && $store.user.team && !$store.user.team.solves.filter(s => s.challenge.id === challenge.id)[0]" class="flagSubmit" type="submit">Submit</button>
            <button @click.prevent="dialog.open(false)">Cancel</button>
          </form>
        </template>
      </Dialog>
    </section>
  </main>
</template>

<script>
import Dialog from '@/components/Dialog'
import marked from 'marked'

export default {
  name: 'Challenges',
  data () {
    return {
      challenges: [],
      flagInput: '',
      showHint: {},
      showSolves: {},
      challengeSolves: []
    }
  },
  components: {
    Dialog
  },
  computed: {
    categories () {
      return this.challenges.map(c => c.category).filter(function (i, p) { return this.challenges.map(c => c.category).indexOf(i) === p }.bind(this))
    }
  },
  watch: {
    '$store.competition' () {
      this.getChallenges()
    }
  },
  methods: {
    getChallenges () {
      this.get('/challenges').then(function (res) {
        this.challenges = res.data
        this.challenges.sort(function (a, b) { return a.value - b.value })
        this.$store.loaded = true
      }.bind(this))
    },
    showChallenge (id) {
      this.toggleSolves(id, true)
      this.toggleHint(id, true)
      this.flagInput = ''
      this.$refs['dialog' + id.toString()][0].dialogOpen(true)
    },
    submitFlag (event) {
      this.post('/challenges/' + event.target.id + '/submissions', {
        flag: this.flagInput
      }).then(function (res) {
        if (res.data.correct) {
          this.alert('Nice!', 'You got it!', 'success')
          this.reload()
        } else {
          this.alert('Nope!', 'Keep trying...', 'failure')
        }
      }.bind(this)).catch(function (err) {
        if (err.response.status === 400) {
          this.alert('Nope!', 'Keep trying...', 'failure')
        } else {
          throw err
        }
      }.bind(this))
    },
    toggleHint (id, hide) {
      if (hide) { this.$set(this.showHint, id, false); return }
      if (this.showHint[id] === undefined) this.$set(this.showHint, id, false)
      this.showHint[id] = !this.showHint[id]
    },
    toggleSolves (id, hide) {
      if (this.showSolves[id] || hide) this.$set(this.showSolves, id, false)
      else {
        this.get('/challenges/' + id).then(res => {
          this.challengeSolves = res.data.solves
          this.challengeSolves.sort(function (a, b) { return +new Date(a.time) - +new Date(b.time) })
          if (this.showSolves[id] === undefined) this.$set(this.showSolves, id, false)
          this.showSolves[id] = !this.showSolves[id]
        })
      }
    },
    markdown (text) {
      return marked(text)
    }
  },
  mounted () {
    this.$store.loaded = false
    this.getChallenges()
  }
}
</script>

<style scoped lang="scss">
@import '../theme/challenges';
</style>
