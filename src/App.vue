<template>
  <div id="wrapper">
    <bubbles></bubbles>
    <navbar v-if="$store.loaded"></navbar>
    <router-view v-if="$store.loaded"/>
    <div class="loading" v-if="!$store.loaded"></div>
  </div>
</template>

<script>
import Navbar from './components/Navbar'
import Bubbles from './components/Bubbles'
import 'details-element-polyfill'
import 'dialog-polyfill'

export default {
  name: 'App',
  components: {
    Navbar,
    Bubbles
  }
}
</script>

<style lang="scss">
@import 'themes/main.scss';
</style>
