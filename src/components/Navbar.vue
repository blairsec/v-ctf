<template>
  <nav>
    <ul>
      <li><router-link :to="{ name: 'Home' }">Home</router-link></li>
      <li><router-link :to="{ name: 'About' }">About</router-link></li>
      <li><a :href="chat_url">Chat</a></li>
      <li><router-link :to="{ name: 'Scoreboard' }">Scoreboard</router-link></li>
      <li v-if="$store.competition.id"><router-link :to="{ name: 'Challenges' }">Challenges</router-link></li>
      <li v-if="$store.competition.id && $store.user.id && $store.user.team && $store.user.team.id"><router-link :to="{ name: 'Shell' }">Shell</router-link></li>
      <span class="divider"></span>
      <li v-if="$store.competition"><span>{{ $store.competition.name }} <span class="darr">&#9660;</span></span>
        <ul>
          <li @click="updateCompetition(competition)" v-for="competition in $store.competitions" :key="competition.id" v-if="competition.id !== $store.competition.id && !subdomains">{{ competition.name }}</li>
          <a :href="'//' + competition.name + '.' + root" v-for="competition in $store.competitions" :key="competition.id" v-if="competition.id !== $store.competition.id && subdomains"><li>{{ competition.name }}</li></a>
        </ul>
      </li>
      <li v-if="$store.user.id"><router-link :to="{ name: 'Profile' }">Profile</router-link></li>
      <li v-if="$store.user.admin"><router-link :to="{ name: 'Admin' }">Admin</router-link></li>
      <li v-if="$store.competition.id && !$store.user.id"><router-link :to="{ name: 'Login' }">Login</router-link></li>
      <li v-if="$store.competition.id && !$store.user.id"><router-link :to="{ name: 'Signup' }">Signup</router-link></li>
      <li v-if="$store.user.id" @click="logout()"><span>Logout</span></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  computed: {
    chat_url () { return process.env.VUE_APP_CHAT_URL }
    subdomains () { return process.env.VUE_APP_COMPETITION_SUBDOMAINS },
    root () { return location.host.split('.').slice(1).join('.') }
  }
}
</script>

<style scoped lang="scss">
@import '../theme/navbar';
</style>
