<template>
  <section class="competitions">
    <table v-if="$store.competitions.length > 0">
      <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Start</th>
        <th>End</th>
        <th></th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="competition in $store.competitions">
        <td>{{ competition.id }}</td>
        <td>{{ competition.name }}</td>
        <td>{{ new Date(competition.start).toLocaleString() }}</td>
        <td>{{ new Date(competition.end).toLocaleString() }}</td>
        <td class="action edit">
          <Dialog icon="far fa-edit" :iconAction="function () { this(competition) }.bind(updateNewCompetition)">
            <template slot-scope="dialog">
              <form @submit.prevent="editCompetition(competition, dialog)">
                <input v-model="newCompetition.name" type="text" placeholder="Name">
                <textarea v-model="newCompetition.about" type="text" placeholder="About"></textarea>
                <label>Start Time</label>
                <input v-model="newCompetition.startDate" name="start-date" type="date">
                <input v-model="newCompetition.startTime" name="start-time" type="time">
                <label>End Time</label>
                <input v-model="newCompetition.endDate" name="end-date" type="date">
                <input v-model="newCompetition.endTime" name="end-time" type="time">
                <button type="reset" @click="resetNewCompetition(dialog)">Cancel</button>
                <button type="submit">Apply</button>
              </form>
            </template>
          </Dialog>
        </td>
        <td class="action delete">
          <Dialog icon="far fa-trash-alt">
            <template slot-scope="dialog">
              <p>Are you sure you want to delete the competition "{{ competition.name }}"?</p>
              <button @click="deleteRequest('/competitions/' + competition.id, false).then(function () { dialog.open(false); reloadAdmin()})">Delete</button><button @click="dialog.open(false)">Cancel</button>
            </template>
          </Dialog>
        </td>
      </tr>
      </tbody>
    </table>
    <p v-if="$store.competitions.length === 0">No competitions found.</p>
    <Dialog buttonText="Create Competition">
      <template slot-scope="dialog">
        <form @submit.prevent="createCompetition(dialog)">
          <input v-model="newCompetition.name" type="text" placeholder="Name">
          <textarea v-model="newCompetition.about" type="text" placeholder="About"></textarea>
          <label>Start Time</label>
          <input v-model="newCompetition.startDate" name="start-date" type="date">
          <input v-model="newCompetition.startTime" name="start-time" type="time">
          <label>End Time</label>
          <input v-model="newCompetition.endDate" name="end-date" type="date">
          <input v-model="newCompetition.endTime" name="end-time" type="time">
          <button type="reset" @click="resetNewCompetition(dialog)">Cancel</button>
          <button type="submit">Create</button>
        </form>
      </template>
    </Dialog>
  </section>
</template>

<script>
import Dialog from '@/components/Dialog'

export default {
  name: 'CompetitionPanel',
  data () {
    return {
      newCompetition: {
        name: '',
        about: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: ''
      }
    }
  },
  components: {
    Dialog
  },
  props: [
    'reloadAdmin'
  ],
  computed: {
    newCompetitionStart () {
      return new Date(this.newCompetition.startDate + ' ' + this.newCompetition.startTime).toISOString()
    },
    newCompetitionEnd () {
      return new Date(this.newCompetition.endDate + ' ' + this.newCompetition.endTime).toISOString()
    }
  },
  methods: {
    updateNewCompetition (competition) {
      this.newCompetition.name = competition.name
      this.newCompetition.about = competition.about
      var start = new Date(competition.start)
      this.newCompetition.startDate = start.getFullYear() + '-' + (start.getMonth() + 1).toString().padStart(2, '0') + '-' + start.getDate().toString().padStart(2, '0')
      this.newCompetition.startTime = start.toTimeString().split(' ')[0]
      var end = new Date(competition.end)
      this.newCompetition.endDate = end.getFullYear() + '-' + (end.getMonth() + 1).toString().padStart(2, '0') + '-' + end.getDate().toString().padStart(2, '0')
      this.newCompetition.endTime = end.toTimeString().split(' ')[0]
    },
    createCompetition (dialog) {
      this.post('/competitions', {
        name: this.newCompetition.name,
        about: this.newCompetition.about,
        start: this.newCompetitionStart,
        end: this.newCompetitionEnd
      }, false).then(function (data) {
        if (dialog) { this.resetNewCompetition(dialog) }
      }.bind(this)).then(this.reloadAdmin)
    },
    editCompetition (competition, dialog) {
      this.patch('/competitions/' + competition.id, {
        name: this.newCompetition.name,
        about: this.newCompetition.about,
        start: this.newCompetitionStart,
        end: this.newCompetitionEnd
      }, false).then(function (data) {
        if (dialog) { this.resetNewCompetition(dialog) }
      }.bind(this)).then(this.reloadAdmin)
    },
    resetNewCompetition (dialog) {
      this.newCompetition.endTime = this.newCompetition.endDate = this.newCompetition.startTime = this.newCompetition.startDate = this.newCompetition.name = ''
      if (dialog) { dialog.open(false) }
    },
    reloadPanel () {}
  }
}
</script>

<style>

</style>
