<template>
  <main class="about">
    <h1>About</h1><h1>{{ $store.competition.name }}</h1>
    <section v-html="$store.competition.about"></section>
  </main>
</template>

<script>
export default {
  name: 'About'
}
</script>

<style scoped>

</style>
