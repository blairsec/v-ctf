<template>
<transition name="alert">
  <div v-if="show" class="alert" :class="{ success: type === 'success', failure: type === 'failure' }">
    <span class="alert-close" @click="close()"></span>
    <span class="alert-title">{{ title }}</span>
    <span class="alert-message">{{ message }}</span>
  </div>
</transition>
</template>

<script>
export default {
  props: [
    'id',
    'title',
    'message',
    'type',
    'duration'
  ],
  data () {
    return {
      show: true,
      timeout: null
    }
  },
  methods: {
    close () {
      console.log(this.id)
      this.$store.alerts.splice(this.id, 1)
      clearTimeout(this.timeout)
    },
    open () {
      this.show = true
    }
  },
  mounted () {
    this.timeout = setTimeout(this.close, this.duration === undefined ? 5000 : this.duration)
  }
}
</script>
