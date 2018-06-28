<template>
  <div>
    <button @click="dialogOpen(true)" v-if="buttonText">{{ buttonText }}</button>
    <i class="action" @click="dialogOpen(true); typeof iconAction === 'function' ? iconAction() : null" :class="icon" v-if="icon"></i>
    <transition name="dialog">
      <dialog :open="open" v-if="open">
        <slot :open="dialogOpen"></slot>
      </dialog>
    </transition>
    <transition name="dialogbg">
      <div class="dialogbg" v-if="open" @click="dialogOpen(false)"></div>
    </transition>
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
      this.open = open
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
