<template>
  <v-app>
      <Menu></Menu>
      <hr>
      <p></p>
      <router-view/>
  </v-app>
</template>

<script>
import Menu from './components/navigation/Menu.vue'

export default {
    components:{Menu}
};
</script>
