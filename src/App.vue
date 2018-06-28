<template>
  <div id="wrapper" :class="$store.theme">
    <background></background>
    <navbar v-if="$store.competitionLoaded"></navbar>
    <div class="alerts">
      <alert v-for="alert in $store.alerts" :title="alert.title" :type="alert.type" :message="alert.message" :duration="alert.duration"></alert>
    </div>
    <router-view v-if="$store.competitionLoaded" v-show="$store.loaded"/>
    <main class="loading" v-if="!$store.loaded">
      <div class="load-symbol"></div>
    </main>
  </div>
</template>

<script>
import Navbar from './components/Navbar'
import 'details-element-polyfill'
import 'dialog-polyfill'
import Background from './themes/angstromctf/Background'
import Alert from './components/Alert'

export default {
  name: 'App',
  components: {
    Navbar,
    Alert,
    Background
  }
}
</script>

<style lang="scss">
@import 'themes/angstromctf/main.scss';

html, body {
  margin: 0;
  padding: 0;
}
</style>
