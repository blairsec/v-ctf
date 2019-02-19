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
