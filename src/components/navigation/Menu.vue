<template>
  <nav>
    <v-card>
      <v-tabs background-color="grey darken-4" height="5vh" active dark>
        <v-tab @click="goHome()">
          ETIQUETAS
        </v-tab>

        <v-tab @click="goLogin()">
          Login
        </v-tab>
      </v-tabs>      
    </v-card>
  </nav>
</template>

<script>
export default {
    data: () => ({
      drawer: false,
      group: null,
    }),

    methods: {
      goHome(){
        this.$router.push({name: 'home', params:{text: 'vim do menu'}})
      },
      goLogin(){
        this.$router.push({name: 'login'})
      }
    },

    watch: {
      group () {
        this.drawer = true
      }
    }
  }
</script>

<style>

</style>
