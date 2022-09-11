<template>
  <div>
    <v-stepper class="mx-auto" max-width="98%" height="88vh" v-model="e13" vertical editable>
      <v-stepper-step  color="blue lighten-1" elevation="2" colored-border step="1" complete>
        CONFIGURAÇÃO DE ETIQUETA:
      </v-stepper-step>
      
      <!-- tag features -->
      <v-stepper-content step="1" >
        <v-card class="mx-auto" outlined>
          <printerData  :retrieved="printerTag[id]"  @receivedData="valueReceived.dataPrint = $event"/>
        </v-card>
        
        <v-btn class="ma-3" :disabled="!valueReceived.dataPrint.valid"  color="primary" small @click="e13=2">
          <v-icon small>
            mdi-skip-next-circle
          </v-icon>

          continuar
        </v-btn>

        
        <v-btn class="ma-5"  color="deep-purple accent-2" dark small  @click="dialog = true" >
          <v-icon small class="mr-2" >
            mdi-eye
          </v-icon>
          Vizualizar
        </v-btn>
      </v-stepper-content>
      
      
            
      <v-stepper-step  color="blue lighten-1" elevation="2" colored-border step="2" complete>
        INFORMAÇÕES EXIBIDAS EM ETIQUETA:
      </v-stepper-step>
      
      <!-- line features -->
      <v-stepper-content step="2">
        <v-card class="mx-auto" outlined>
          <InputtagInfo  :retrieved="printerTag[id]"   @receivedField="valueReceived.dataField = $event"/>
          
          <v-btn class="ma-2" small color="deep-orange accent-4" dark @click="e13 = 1">
            <v-icon small class="mr-2">
              mdi-backspace
            </v-icon>
            VOLTAR
          </v-btn>
                      
          <v-btn class="ma-2" color="light-green accent-4" dark small @click="sendValue">
            <v-icon small class="mr-2" @click="e13 = 1">
              mdi-content-save-edit
            </v-icon>
            
            SALVAR
          </v-btn>

          
            <template>
              <v-btn class="ma-2"  color="deep-purple accent-2" dark small @click="dialog = true" >
                <v-icon small class="mr-2" >
                  mdi-eye
                </v-icon>

                Vizualizar
              </v-btn>
            </template>
          <v-dialog v-model="dialog" >
            <v-card>
              <VisualPrinter class="centerText" :visualValue="option.product" 
                :viewDataReceived="valueReceived" />
                
              <v-divider></v-divider>
        
              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn color="deep-orange accent-4" text @click="dialog = false" >
                  FECHAR
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>      
        </v-card>        
      </v-stepper-content>
    </v-stepper>     
    
    <v-snackbar v-model="snackbar" color="blue" :timeout="timeout">
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false" >
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
  </div>   
</template>

<script>
import InputtagInfo from './inputs/InputLine'
import PrinterData from './inputs/InputDimensions'
import VisualPrinter from './drawn/DrawnDimensions'

export default {
    props: ['id'],
    components: {InputtagInfo, PrinterData, VisualPrinter},

   data() {
    return{
      option:{
        product:{
          name: 'nome do produto',
          companyName: 'nome da empresa',
          DisplayName: 'codigo+nome',
          code: 'codigo',
          textEditable: 'texto editado',
          unitary_value: 9.999 ,
        },
      },
      e13: 2,
      visualizar: false,
      sheet: false,
      dialog: false,
      snackbar: false,
      text: 'My timeout is set to 2000.',
      timeout: 2000,
      printerTag: [],
      valueReceived: {
       dataPrint: [],
       dataField: []
      }
    }
  },

  methods:{
    gotoStart(){
      this.$router.push({path:'/etiqueta'})
    },
    
    sendValue() {
      //verificar como utilizar isso em todo o codigo
      // let etiqueta = this.printerTag.find(x => x.id == this.id)
      // console.log(etiqueta)
      this.snackbar = true

      if(this.printerTag[this.id] == undefined){
        localStorage.setItem('webSite', location.pathname)
        this.$http.post('printDB', this.valueReceived)
        this.$router.push({name:"home"}) 
      }

      else{
        this.$router.push({name:"home"}) 
        localStorage.setItem('webSite', 'editado')
        const metodo = this.printerTag[this.id].id ? 'patch' : 'post'
        const finalUrl = this.printerTag[this.id].id ? `/${this.printerTag[this.id].id}` : ''
        this.$http[metodo](`/printDB/${finalUrl}`,this.valueReceived)
      }
    },
  },
  
  created(){
    this.$http.get('printDB').then(res=>{
      this.printerTag=res.data
    })
  }
}
</script>

<style>
.centerText{
  text-align: center
}
</style>
