<template>
  <nav>
    <ul>
      <li><router-link :to="{ name: 'Home' }">Home</router-link></li>
      <li><router-link :to="{ name: 'About' }">About</router-link></li>
      <li v-if="$store.competition"><router-link :to="{ name: 'Challenges' }">Challenges</router-link></li>
      <li v-if="$store.competition">{{ $store.competition.name }}
        <ul>
          <li @click="$store.competition = competition" v-for="competition in $store.competitions" v-if="competition.id !== $store.competition.id">{{ competition.name }}</li>
        </ul>
      </li>
      <li v-if="$store.competition"><router-link :to="{ name: 'Login' }">Login</router-link></li>
      <li v-if="$store.competition"><router-link :to="{ name: 'Signup' }">Signup</router-link></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Navbar'
}
</script>

<style scoped>

</style>
