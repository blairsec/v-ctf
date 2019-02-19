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
    'title',
    'message',
    'type',
    'duration',
    'id',
    'object'
  ],
  data () {
    return {
      show: true,
      timeout: null
    }
  },
  methods: {
    close () {
      this.show = false
      this.object.show = false
      clearTimeout(this.timeout)
    },
    open () {
      this.show = true
    }
  },
  mounted () {
    this.timeout = setTimeout(this.close, this.duration === undefined ? 5000 : this.duration)
  },
  beforeDestroy () {
    clearTimeout(this.timeout)
  }
}
</script>
