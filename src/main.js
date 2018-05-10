// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueStash from 'vue-stash'
import axios from 'axios'
import config from './config'

Vue.use(VueStash)

Vue.mixin({
  methods: {
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
    randomString (length) {
      var string = ''
      var crypto = window.crypto || window.msCrypto
      var values = new Uint32Array(length)
      crypto.getRandomValues(values)
      for (var i = 0; i < length; i++) {
        string += String.fromCharCode((values[i] % (127 - 32)) + 32)
      }
      return string
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
        }
      },
      competition: null,
      competitions: [],
      loaded: false
    }
  },
  mounted () {
    this.get('/competitions', false).then(function (res) {
      this.$store.competitions = res.data
      this.$store.competition = this.$store.competitions[this.$store.competitions.length-1]
      this.$store.loaded = true
    }.bind(this)).catch(function (data) {
      this.$store.loaded = true
    }.bind(this))
  }
})
