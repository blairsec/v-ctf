<template>
  <main class="challenges">
    <h1>Challenges</h1>
    <section>
      <ul class="challengeList">
        <li class="challenge" :class="{ solved: challenge.solved }" v-for="challenge in challenges" @click="showChallenge(challenge.id)">
          <h1 class="title">{{ challenge.title }}</h1>
          <div class="category">{{ challenge.category }}</div>
          <div class="value">{{ challenge.value }}</div>
          <div class="solves">{{ challenge.solves.length }}</div>
        </li>
      </ul>
      <Dialog v-for="challenge in challenges" :key="challenge.id" class="challengeModal" :ref="'dialog' + challenge.id.toString()">
        <template slot-scope="dialog">
          <h1 class="title">{{ challenge.title }}</h1><span class="category">{{ challenge.category }}</span>
          <div class="value">{{ challenge.value }}</div>
          <div class="solves">{{ challenge.solves.length }}</div>
          <p class="description">{{ challenge.description }}</p>
          <form @submit.prevent="submitFlag" :id="challenge.id">
            <input type="text" class="flagInput" placeholder="Flag" v-model="flagInput" v-if="!challenge.solved && $store.user.id && $store.user.team">
            <p v-if="!$store.user.id">Create an account or log in to submit flags.</p>
            <p v-if="$store.user.id && !$store.user.team">Create or join a team to submit flags.</p>
            <p v-if="challenge.solved">You already solved this challenge!</p>
            <button v-if="!challenge.solved && $store.user.id && $store.user.team" class="flagSubmit" type="submit">Submit</button>
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
      flagInput: ''
    }
  },
  components: {
    Dialog
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
      }.bind(this))
    },
    showChallenge (id) {
      this.$refs['dialog' + id.toString()][0].dialogOpen(true)
    },
    submitFlag (event) {
      this.post('/challenges/' + event.target.id + '/submissions', {
        flag: this.flagInput
      })
    }
  },
  mounted () {
    this.getChallenges()
  }
}
</script>

<style scoped lang="scss">
@import '../themes/challenges.scss';
</style>
