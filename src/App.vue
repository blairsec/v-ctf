<template>
  <div id="app">
      <navbar v-if="$store.loaded"></navbar>
      <router-view v-if="$store.loaded"/>
      <div class="loading" v-if="!$store.loaded"></div>
  </div>
</template>

<script>
import Navbar from './components/Navbar'
import 'details-element-polyfill'
import 'dialog-polyfill'

export default {
  name: 'App',
  components: {
    Navbar
  }
}
</script>

<style>

</style>
