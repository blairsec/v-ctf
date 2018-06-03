<template>
  <div>
    <button @click="dialogOpen(true)" v-if="buttonText">{{ buttonText }}</button>
    <i class="action" @click="dialogOpen(true); typeof iconAction === 'function' ? iconAction() : null" :class="icon" v-if="icon"></i>
    <dialog :open="open" :class="{ finished: finished }">
      <slot :open="dialogOpen"></slot>
    </dialog>
    <div class="dialogbg" v-if="open" @click="dialogOpen(false)"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      open: false,
      finished: false
    }
  },
  props: [
    'buttonText',
    'icon',
    'iconAction'
  ],
  methods: {
    dialogOpen (open) {
      if (!open) {
        this.finished = false
        setTimeout(function () { this.open = false }.bind(this), 100)
      } else {
        this.open = true
        setTimeout(function () { this.finished = true }.bind(this), 10)
      }
    }
  }
}
</script>

<style>
dialog {
  z-index: 2;
}
.dialogbg {
  background-color: rgba(0, 0, 0, 0.8);
  height: 100%;
  width: 100%;
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;
}
i.action {
  cursor: pointer;
}
</style>
