<template>
    <div>
        <h2>INICIO</h2>
        <br>
        <v-btn @click="irParaInicio" color="green">
            Ir para configurador de etiquetas
        </v-btn>
    </div>
</template>

<script>
export default {
    methods:{
        irParaInicio(){
            this.$router.push({path:'/etiqueta'})
        }
    },
   
}
</script>

<style>

</style>
