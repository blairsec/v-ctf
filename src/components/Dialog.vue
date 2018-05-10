<template>
  <div>
    <button @click="dialogOpen(true)">Create Competition</button>
    <dialog :open="open">
      <slot :open="dialogOpen"></slot>
    </dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      open: false
    }
  },
  methods: {
    dialogOpen(open) {
      this.open = open ? true : false
    }
  }
}
</script>

<style>

</style>
