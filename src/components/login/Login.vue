<template>
    <section >
        <v-form v-model="loginData">
            <v-row justify="center">
                <v-col cols="6" sm="10" md="8" lg="6">
                    <v-card ref="form">
                        
                        <v-card-text class="text-h4 text-center">LOGIN:</v-card-text>

                        <v-card-text>
                            <v-text-field v-model="login_code" :rules="[() => !!login_code || 'informe o codigo de login']" label="CODIGO DE LOGIN" placeholder="CODIGO DE LOGIN" required></v-text-field>

                            <v-text-field v-model="pin_code" :rules="[() => !!pin_code || 'informe o PIN']" label="CODIGO PIN" placeholder="CODIGO PIN" required></v-text-field>
                        </v-card-text>

                        <v-card-actions >
                            <v-btn :disabled="!loginData" block class="my-5 mb-10 hover-acess" color="primary" @click="handleSubmit()">ACESSAR</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-form>
    </section>
</template>

<script>
import axios from './../../axios.js'

export default {
    data(){
        return{
            loginData:false,
            login_code: '',
            pin_code: '',
            productsData: [],
            pass1: "",
            pass2: "",
            pass3: "",
            pass4: "",
            pass5: "",
        }
    },
    methods:{
       
        async handleSubmit(){
            const response = await axios.post('/auth',{
                
                login_code: this.login_code,
                pin: this.pin_code,
                
                device_id: `50`,
                app_type: 'DESKTOP',

                info: {
                    model: 'API TAG'
                }
            })
            window.alert("logado com sucesso")
            localStorage.setItem('hash', response.data.data.hash)
            localStorage.setItem('ID', `50`)
            this.$router.push({path:'/'})
        },
    }        
}
</script>

<style/>

