<template>
  <div id="wrapper">
    <background></background>
    <navbar v-if="$store.competitionLoaded"></navbar>
    <div class="alerts">
      <alert v-for="(alert, index) in $store.alerts.slice().reverse()" :id="$store.alerts.length - index - 1" :key="index" :title="alert.title" :type="alert.type" :message="alert.message" :duration="alert.duration"></alert>
    </div>
    <router-view v-if="$store.competitionLoaded" v-show="$store.loaded"/>
    <main class="loading" v-if="!$store.loaded">
      <div class="load-symbol-container">
        <div class="load-symbol"></div>
      </div>
    </main>
  </div>
</template>

<script>
import Navbar from './components/Navbar'
import 'details-element-polyfill'
import 'dialog-polyfill'
import Background from './theme/Background'
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
@import 'theme/main.scss';

html, body {
  margin: 0;
  padding: 0;
}
</style>
