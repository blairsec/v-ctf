// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueStash from 'vue-stash'
import axios from 'axios'
import config from './config'
import marked from 'marked'

Vue.use(VueStash)

Vue.mixin({
  methods: {
    markdown (text) {
      return marked(text)
    },
    post (route, data, competition) {
      var _csrf = this.randomString(64).replace(/[;, ]/g, '')
      document.cookie = '_csrf=' + _csrf
      return axios.post(config.API_URL + (competition === false ? '' : ('/competitions/' + this.$store.competition.id)) + route,
        Object.assign(data, { _csrf: _csrf }),
        { withCredentials: true })
    },
    get (route, competition) {
      return axios.get(config.API_URL + (competition === false ? '' : ('/competitions/' + this.$store.competition.id)) + route)
    },
    patch (route, data, competition) {
      var _csrf = this.randomString(64).replace(/[;, ]/g, '')
      document.cookie = '_csrf=' + _csrf
      return axios.patch(config.API_URL + (competition === false ? '' : ('/competitions/' + this.$store.competition.id)) + route,
        Object.assign(data, { _csrf: _csrf }),
        { withCredentials: true })
    },
    put (route, data, competition) {
      var _csrf = this.randomString(64).replace(/[;, ]/g, '')
      document.cookie = '_csrf=' + _csrf
      return axios.put(config.API_URL + (competition === false ? '' : ('/competitions/' + this.$store.competition.id)) + route,
        Object.assign(data, { _csrf: _csrf }),
        { withCredentials: true })
    },
    deleteRequest (route, competition) {
      var _csrf = this.randomString(64).replace(/[;, ]/g, '')
      document.cookie = '_csrf=' + _csrf
      return axios.delete(config.API_URL + (competition === false ? '' : ('/competitions/' + this.$store.competition.id)) + route,
        { params: { _csrf: _csrf }, withCredentials: true })
    },
    randomString (length) {
      var string = ''
      var crypto = window.crypto || window.msCrypto
      var values = new Uint32Array(length)
      crypto.getRandomValues(values)
      for (var i = 0; i < length; i++) {
        string += String.fromCharCode((values[i] % (127 - 32)) + 32)
      }
      return string
    },
    logout () {
      localStorage.removeItem('competition_' + this.$store.competition.id)
      document.cookie = 'token =; Max-Age=0'
      this.reload()
      this.alert('Success!', 'You have been logged out.', 'success')
    },
    updateCompetition (competition) {
      this.$store.competition = competition
      localStorage.competition = competition.id
      if (!this.$store.user.admin && this.$store.competition) document.cookie = 'token=' + localStorage['competition_' + this.$store.competition.id]
      this.reload()
    },
    alert (title, message, type, duration) {
      var alert = { title, message, type, duration }
      this.$store.alerts.push(alert)
    },
    reload () {
      var emptyUser = {
        id: null,
        username: null,
        eligible: null,
        created: null,
        team: {
          id: null,
          name: null,
          members: [],
          eligible: null,
          affiliation: null,
          created: null,
          score: null,
          solves: []
        }
      }
      this.get('/competitions', false).then(function (res) {
        this.$store.competitions = res.data
      }.bind(this)).then(() => this.get('/self', false)).then(function (res) {
        this.$store.user = res.data.user
        if ((this.$store.competition === null || this.$store.competition.id === res.data.competition.id) && res.data.competition) this.$store.competition = res.data.competition
        else if (this.$store.user.admin === true) this.$store.competition = this.$store.competition || this.$store.competitions.filter(c => c.id === parseInt(localStorage.competition))[0] || this.$store.competitions[this.$store.competitions.length - 1] || null
        else this.$store.user = emptyUser
        if (!this.$store.user.admin && this.$store.competition) document.cookie = 'token=' + localStorage['competition_' + this.$store.competition.id]
        this.$store.competitionLoaded = true
        this.$store.loaded = true
      }.bind(this)).catch(function (data) {
        this.$store.competition = this.$store.competition || this.$store.competitions.filter(c => c.id === parseInt(localStorage.competition))[0] || this.$store.competitions[this.$store.competitions.length - 1]
        if (!this.$store.user.admin && this.$store.competition) document.cookie = 'token=' + localStorage['competition_' + this.$store.competition.id]
        this.$store.competitionLoaded = true
        this.$store.loaded = true
        this.$store.user = emptyUser
      }.bind(this))
    }
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  data: {
    store: {
      user: {
        id: null,
        username: null,
        eligible: null,
        created: null,
        team: {
          id: null,
          name: null,
          members: [],
          eligible: null,
          affiliation: null,
          created: null,
          score: null,
          solves: []
        },
        theme: ''
      },
      competition: null,
      competitions: [],
      loaded: false,
      competitionLoaded: false,
      alerts: []
    },
    refreshKey: 1
  },
  mounted () {
    this.reload()
  }
})
