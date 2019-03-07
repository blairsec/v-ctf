<template>
  <main class="home">
    <h1>{{ home.title }}</h1>
    <section v-html="markdown(home.content)"></section>
  </main>
</template>

<script>
import marked from 'marked'

export default {
  name: 'Home',
  data () {
    return {
      home: {
        title: '',
        content: ''
      }
    }
  },
  methods: {
    getHome () {
      this.get('/home', false).then(function (res) {
        this.home = res.data
        this.$nextTick(function () {
          var scripts = document.querySelectorAll('.home > section')[0].getElementsByTagName('script')
          for (var i = 0; i < scripts.length; i++) {
            console.log(scripts[i])
            // eslint-disable-next-line
            eval(scripts[i].innerHTML)
          }
        })
      }.bind(this))
    },
    markdown (text) {
      return marked(text)
    }
  },
  mounted () {
    this.getHome()
  }
}
</script>

<style scoped>

</style>
