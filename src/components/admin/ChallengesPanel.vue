<template>
  <section class="challenges">
    <table v-if="challenges.length > 0">
      <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Value</th>
        <td>Category</td>
        <th>Description</th>
        <th></th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="challenge in challenges">
        <td>{{ challenge.id }}</td>
        <td>{{ challenge.title }}</td>
        <td>{{ challenge.value }}</td>
        <td>{{ challenge.category }}</td>
        <td>{{ challenge.description }}</td>
        <td class="action edit">
          <Dialog icon="far fa-edit" :iconAction="function () { this(challenge) }.bind(updateNewChallenge)">
            <template slot-scope="dialog">
              <form @submit.prevent="editChallenge(challenge, dialog)">
                <input v-model="newChallenge.title" type="text" placeholder="Title">
                <textarea placeholder="Description" v-model="newChallenge.description"></textarea>
                <input placeholder="Value" v-model="newChallenge.value" type="number">
                <input placeholder="Author"  v-model="newChallenge.author" type="text">
                <input placeholder="Flag" v-model="newChallenge.flag" type="text">
                <input placeholder="Category" v-model="newChallenge.category" type="text">
                <button type="reset" @click="resetNewChallenge(dialog)">Cancel</button>
                <button type="submit">Apply</button>
              </form>
            </template>
          </Dialog>
        </td>
        <td class="action delete">
          <Dialog icon="far fa-trash-alt">
            <template slot-scope="dialog">
              <p>Are you sure you want to delete the challenge "{{ challenge.title }}"?</p>
              <button @click="deleteRequest('/challenges/' + challenge.id).then(function () { dialog.open(false); reloadAdmin()})">Delete</button><button @click="dialog.open(false)">Cancel</button>
            </template>
          </Dialog>
        </td>
      </tr>
      </tbody>
    </table>
    <p v-if="challenges.length === 0">No challenges have been created yet.</p>
    <Dialog buttonText="Create Challenge">
      <template slot-scope="dialog">
        <form @submit.prevent="createChallenge(dialog)">
          <input v-model="newChallenge.title" type="text" placeholder="Title">
          <textarea placeholder="Description" v-model="newChallenge.description"></textarea>
          <input placeholder="Value" v-model="newChallenge.value" type="number">
          <input placeholder="Author"  v-model="newChallenge.author" type="text">
          <input placeholder="Flag" v-model="newChallenge.flag" type="text">
          <input placeholder="Category" v-model="newChallenge.category" type="text">
          <button type="reset" @click="resetNewChallenge(dialog)">Cancel</button>
          <button type="submit">Create</button>
        </form>
      </template>
    </Dialog>
  </section>
</template>

<script>
import Dialog from '@/components/Dialog'

export default {
  name: 'ChallengesPanel',
  components: {
    Dialog
  },
  props: [
    'reloadAdmin'
  ],
  data () {
    return {
      newChallenge: {
        title: '',
        description: '',
        value: null,
        author: '',
        flag: ''
      },
      challenges: []
    }
  },
  methods: {
    updateNewChallenge (challenge) {
      this.newChallenge = Object.assign(this.newChallenge, challenge)
    },
    createChallenge (dialog) {
      this.post('/challenges', this.newChallenge).then(function (data) {
        this.resetNewChallenge(dialog)
      }.bind(this)).then(this.reloadAdmin)
    },
    resetNewChallenge (dialog) {
      this.newChallenge = {
        title: '',
        description: '',
        value: 0,
        author: '',
        flag: ''
      }
      if (dialog) { dialog.open(false) }
    },
    editChallenge (challenge, dialog) {
      this.patch('/challenges/' + challenge.id, this.newChallenge).then(function (data) {
        if (dialog) { this.resetNewChallenge(dialog) }
      }.bind(this)).then(this.reloadAdmin)
    },
    reloadPanel () {
      this.get('/challenges').then(function (res) {
        this.challenges = res.data
      }.bind(this))
    }
  }
}
</script>

<style>

</style>
