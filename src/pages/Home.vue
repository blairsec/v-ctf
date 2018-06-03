<template>
  <main class="home">
    <h1>{{ home.title }}</h1>
    <section v-html="home.content"></section>
  </main>
</template>

<script>
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
    }
  },
  mounted () {
    this.getHome()
  }
}
</script>

<style scoped>

</style>
