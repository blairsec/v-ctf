<template>
  <main class="chat">
    <p>Join the <a :href="chat_url">competition chat</a> for support!</p>
  </main>
</template>

<style scoped lang="scss">
@import '../theme/colors.scss';
.irc {
  flex: 1 0;
  border: 0.2em solid transparentize($primary, 0.5);
}
.chat {
  display: flex;
  flex-direction: column;
}
</style>

<script>
export default {
  name: 'chat',
  computed: {
    chat_url () {
      return process.env.VUE_APP_CHAT_URL
    }
  }
}
</script>
