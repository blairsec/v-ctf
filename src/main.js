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
    post (route, data, competition, headers) {
      return axios.post(config.API_URL + (competition === false ? '' : ('/competitions/' + this.$store.competition.id)) + route, data, this.$store.competition ? { headers: {...(headers ? headers : {}), ...{ Authorization: 'Token ' + localStorage['competition_' + this.$store.competition.id] } } } : {})
    },
    get (route, competition) {
      return axios.get(config.API_URL + (competition === false ? '' : ('/competitions/' + this.$store.competition.id)) + route, this.$store.competition ? { headers: { Authorization: 'Token ' + localStorage['competition_' + this.$store.competition.id] } } : {})
    },
    patch (route, data, competition) {
      return axios.patch(config.API_URL + (competition === false ? '' : ('/competitions/' + this.$store.competition.id)) + route, data, this.$store.competition ? { headers: { Authorization: 'Token ' + localStorage['competition_' + this.$store.competition.id] } } : {})
    },
    put (route, data, competition) {
      return axios.put(config.API_URL + (competition === false ? '' : ('/competitions/' + this.$store.competition.id)) + route, data, this.$store.competition ? { headers: { Authorization: 'Token ' + localStorage['competition_' + this.$store.competition.id] } } : {})
    },
    deleteRequest (route, competition) {
      return axios.delete(config.API_URL + (competition === false ? '' : ('/competitions/' + this.$store.competition.id)) + route, this.$store.competition ? { headers: { Authorization: 'Token ' + localStorage['competition_' + this.$store.competition.id] } } : {})
    },
    logout () {
      localStorage.removeItem('competition_' + this.$store.competition.id)
      this.reload()
      this.alert('Success!', 'You have been logged out.', 'success')
    },
    updateCompetition (competition) {
      this.$store.competition = competition
      localStorage.competition = competition.id
      this.reload()
    },
    alert (title, message, type, duration) {
      var alert = { title, message, type, duration, id: Math.floor(Math.random() * 100000) }
      this.$store.alerts.push(alert)
    },
    reload () {
      if (localStorage.competition) this.$store.competition.id = parseInt(localStorage.competition)
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
      this.get('/home', false).then(function (res) {
        this.$store.name = res.data.title
      }.bind(this)).then(function () {
        this.get('/competitions', false).then(function (res) {
          this.$store.competitions = res.data
          if (process.env.VUE_APP_COMPETITION_SUBDOMAINS) {
            var subdomain = location.host.split('.')[0]
            var competitions = this.$store.competitions.filter(c => c.name.toLowerCase() === subdomain.toLowerCase())
            if (competitions.length > 0) {
              this.$store.competition.id = competitions[0].id
            }
          }
          if (this.$store.competition.id) this.$store.competition = this.$store.competitions.filter(c => c.id === this.$store.competition.id)[0]
        }.bind(this)).then(() => this.get('/self', false)).then(function (res) {
          this.$store.user = res.data.user
          if ((this.$store.competition === null || this.$store.competition.id === res.data.competition.id) && res.data.competition) this.$store.competition = res.data.competition
          else if (this.$store.user.admin === true) this.$store.competition = this.$store.competition || this.$store.competitions.filter(c => c.id === parseInt(localStorage.competition))[0] || this.$store.competitions[this.$store.competitions.length - 1] || null
          else this.$store.user = emptyUser
          this.$store.competitionLoaded = true
          this.$store.loaded = true
        }.bind(this)).catch(function (data) {
          this.$store.competition = (this.$store.competition.id ? this.$store.competition : false) || this.$store.competitions.filter(c => c.id === parseInt(localStorage.competition))[0] || this.$store.competitions[this.$store.competitions.length - 1]
          this.$store.competitionLoaded = true
          this.$store.loaded = true
          this.$store.user = emptyUser
        }.bind(this)).finally(function () {
          this.$store.title = this.$route.name
        }.bind(this))
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
      name: '',
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
        }
      },
      title: '',
      competition: { id: null },
      competitions: [],
      loaded: false,
      competitionLoaded: false,
      alerts: []
    },
    refreshKey: 1
  },
  mounted () {
    this.reload()
  },
  watch: {
    'store.title' () {
      document.title = (this.$store.title !== 'Home' ? (this.$store.title + ' | ') : '') + router.app.$store.name + (router.app.$store.competition ? ' ' + router.app.$store.competition.name : '')
    }
  }
})

router.beforeEach(function (to, from, next) {
  router.app.$store.title = to.name
  next()
})
