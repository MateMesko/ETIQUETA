<template>
  <v-app>
      <MenuItens></MenuItens>
      <hr>
      <p></p>
      <router-view/>
  </v-app>
</template>

<script>
import MenuItens from './components/navigation/MenuItens.vue'

export default {
    components:{MenuItens}
};
</script>
