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
          <p class="description" v-html="challenge.description"></p>
          <button class="hintButton" @click="toggleHint(challenge.id)" v-if="challenge.hint">{{ showHint[challenge.id] ? 'Hide' : 'Show' }} Hint</button>
          <transition name="challengeHintTransition">
            <p class="hint" v-html="challenge.hint" v-if="challenge.hint && showHint[challenge.id]"></p>
          </transition>
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

export default {
  name: 'Challenges',
  data () {
    return {
      challenges: [],
      flagInput: '',
      showHint: {}
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
      }.bind(this))
    },
    toggleHint (id) {
      if (this.showHint[id] === undefined) this.$set(this.showHint, id, false)
      this.showHint[id] = !this.showHint[id]
    }
  },
  mounted () {
    this.$store.loaded = false
    this.getChallenges()
  }
}
</script>

<style scoped lang="scss">
@import '../themes/angstromctf/challenges';
</style>
