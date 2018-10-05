<template>
  <nav>
    <ul>
      <li><router-link :to="{ name: 'Home' }">Home</router-link></li>
      <li><router-link :to="{ name: 'About' }">About</router-link></li>
      <li><router-link :to="{ name: 'Scoreboard' }">Scoreboard</router-link></li>
      <li v-if="$store.competition"><router-link :to="{ name: 'Challenges' }">Challenges</router-link></li>
      <span class="divider"></span>
      <li v-if="$store.competition"><span>{{ $store.competition.name }} <span class="darr">&#9660;</span></span>
        <ul>
          <li @click="updateCompetition(competition)" v-for="competition in $store.competitions" v-if="competition.id !== $store.competition.id">{{ competition.name }}</li>
        </ul>
      </li>
      <li v-if="$store.user.id"><router-link :to="{ name: 'Profile' }">Profile</router-link></li>
      <li v-if="$store.user.admin"><router-link :to="{ name: 'Admin' }">Admin</router-link></li>
      <li v-if="$store.competition && !$store.user.id"><router-link :to="{ name: 'Login' }">Login</router-link></li>
      <li v-if="$store.competition && !$store.user.id"><router-link :to="{ name: 'Signup' }">Signup</router-link></li>
      <li v-if="$store.user.id" @click="logout()"><span>Logout</span></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Navbar'
}
</script>

<style scoped lang="scss">
@import '../theme/navbar';
</style>
