<template>
  <div id="wrapper">
    <background></background>
    <navbar v-if="$store.competitionLoaded"></navbar>
    <div class="alerts">
      <alert v-for="alert in $store.alerts.slice().reverse()" :key="alert.id" :object="alert" v-if="alert.show !== false" :title="alert.title" :type="alert.type" :message="alert.message" :duration="alert.duration"></alert>
    </div>
    <router-view ref="view" v-if="$store.competitionLoaded" v-show="$store.loaded"/>
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
