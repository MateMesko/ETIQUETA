<template>
  <div >
    <v-card class="mx-auto "  max-width="98%">
      <v-flex class=" d-flex justify-space-between">
        <v-subheader  >
          ETIQUETAS:
        </v-subheader>
        <!-- create new tag -->
        <v-btn color="green mt-2 mr-2" dark @click="createTag">
          <v-icon class="ma-2" >
            mdi-plus
          </v-icon>NOVA ETIQUETA
        </v-btn>

      </v-flex>
      <v-simple-table  height="80vh" fixed-header>
        <!-- head table -->
        <template v-slot:default >
          <thead >
            <tr >
              <th class=" text-h7 text-left" >
                CODIGO
              </th>
              <th class=" text-h7 text-center" >
                NOME
              </th>
              <th class=" text-h7  text-center" >
                  NUMERO DE COLUNAS: ALTURA X LARGURA
              </th>
              <th class=" text-h7 text-end">
                AÇÕES
              </th>
            </tr>
          </thead>
          
          <tbody >
            <tr v-for="(values, i) in printerTag" :key="i"  >
              <!-- tags info -->
              <td class="text-left">{{values.dataPrint.code}}</td>
              <td class="text-center" >{{values.dataPrint.name}}</td>
              <td class="text-center">{{values.dataPrint.numColumn}}:{{values.dataPrint.heightTag}} X {{values.dataPrint.widthTag}}</td>
              <td class="text-end">
                <v-tooltip v-model="showEdit[i]" bottom  color="blue">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" :to="`${i}`" v-on="on" >
                      <v-icon color="blue">
                        mdi-pencil
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>EDITAR</span>
                </v-tooltip>  
                <!-- view tag button -->  
                <v-tooltip v-model="showView[i]" bottom  color="deep-purple accent-2">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon color="deep-purple accent-2" dark @click.stop="values.expand = true" v-bind="attrs" v-on="on" >
                      <v-icon  color="deep-purple accent-2">
                        mdi-eye
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>VIZUALIZAR</span>
                </v-tooltip>  
                
                <v-dialog scrollable v-model="values.expand" max-width="100%">
                  <v-card  class="view">
                   
                    <v-card-title  class="text-white text-h5 deep-purple">
                      ETIQUETA:{{values.dataPrint.name}}
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                      <v-radio-group  column>
                        <VisualPrinter class="text-center" :visualValue="option.product"  :viewDataReceived="printerTag[i]" />
                      </v-radio-group>
                    </v-card-text>
                    
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      
                      <v-btn color="deep-purple" text @click="voltar('delete')" >
                        voltar
                      </v-btn>
                    </v-card-actions>                  
                  </v-card>
                </v-dialog>

                <!-- printer tag button -->
                <v-tooltip v-model="showPrinter[i]" bottom  color="teal">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon  :to="`/etiqueta/imprimir/${i}`" :viewDataReceived="printerTag[i]" v-bind="attrs" v-on="on" >
                      <v-icon  color="teal">
                        mdi-printer
                      </v-icon>
                    </v-btn>
                  </template>

                  <span>IMPRIMIR</span>
                </v-tooltip> 
           
                <v-tooltip v-model="showDelete[i]" bottom  color="red">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon color="primary" dark @click.stop="values.dialog = true" v-bind="attrs" v-on="on" >
                      <v-icon  color="red">
                        mdi-delete
                      </v-icon>
                    </v-btn>
                  </template>

                  <span>DELETAR</span>
                </v-tooltip>  
                
                <v-dialog v-model="values.dialog" max-width="290">
                  <v-card>
                    <v-card-title class="text-white text-h5 red">
                      DELETAR ETIQUETA?
                    </v-card-title>
    
                    <v-card-text class="mt-5 text-h5">
                      AVISO: Apos exclusão não sera possivel recuperar etiqueta excluida, tem certeza que deseja excluir?
                    </v-card-text>
    
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      
                      <v-btn color="blue" text @click="cancelar('delete')" >
                        CANCELAR
                      </v-btn>

                      <v-btn color="red"  text  @click="deletar(values.id)" >
                        CONFIRMAR
                      </v-btn>
                    </v-card-actions>                  
                  </v-card>
                </v-dialog>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
    
    <v-snackbar v-model="snackbar" color="blue" :timeout="timeout">
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false" >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>

import VisualPrinter from './visual/VisualPrinter'

export default {
  components: {VisualPrinter},
 data(){
    return{
      //objects
      option:{
        product:{
          name:'nome do produto',
          companyName:'nome da empresa',
          DisplayName:'codigo+nome',
          code:'codigo',
          textEditable:'texto editado',
          unitary_value: 9.999 ,
          
        },
      },
      //feedback
      text: 'My timeout is set to 2000.',
      timeout: 2000,
      sheet: false,
      snackbar: false,
      //arrays
      dialog: [],
      expand: [],
      showEdit: [],
      showDelete: [],
      showPrinter: [],
      showView: [],
      printerTag: []
    }
  },
  
  created(){
    this.$http.get('printDB').then(res=>{
      this.printerTag = res.data
    })
    this.$router.push({name: "home"})
    
    if(localStorage.webSite == '/criar')
    {
      this.snackbar = true
      this.text = 'Salvo com sucesso'

      localStorage.setItem('webSite', location.pathname)
      this.$http.get('printDB').then(res => {
      this.printerTag=res.data})
    }
    else if(localStorage.webSite == 'editado')
    {
      this.snackbar = true
      this.text = 'Editado com sucesso'

      localStorage.setItem('webSite', location.pathname)
      this.$http.get('printDB').then( res => {
      this.printerTag=res.data})
    }
    
  },

  methods:{
    deletar(id){
      this.$http.delete(`/printDB/${id}`)
      this.delay(1)
      this.snackbar = true
      this.text = ("deletado com sucesso")
      
      this.$http.get('printDB').then(res=>{
        this.printerTag = res.data
      })


      this.$http.get('printDB').then(res=>{
        this.printerTag = res.data
      })
      
    },

    delay(n){
      return new Promise(function(resolve){
          setTimeout(resolve,n*1000);
      });
    },

    createTag(){
      this.$router.push({name:'criarEtiqueta'})
    },

    editTag(){
      this.$router.push({name:'editValues', params:{id : this.i}})
    },

    cancelar(){
      this.$http.get('printDB').then(res=>{
        this.printerTag = res.data
      })
      
    },
    
    voltar(){
      this.$http.get('printDB').then(res=>{
        this.printerTag = res.data
      })
    }
   
  },
};
</script>

<style>
  ::-webkit-scrollbar {
    width: 6px;
  }
  
  /* Track */
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px rgb(0, 171, 250); 
    border-radius: 10px;
  }
  .view ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px purple; 
    border-radius: 10px;
  }
  
  /* Handle */
  ::-webkit-scrollbar-thumb {
    
    background: #00abfa; 
    border-radius: 10px;
  }
  .view ::-webkit-scrollbar-thumb {
    
    background: #673ab7 ; 
    border-radius: 10px;
  }
  
  
  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #1682ca; 
  }
  .text-white{
    color:white !important; 
  }
</style>
