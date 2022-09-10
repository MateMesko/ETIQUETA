<template>
  <div>
    <v-card class="mx-auto" max-width="98%" min-height="98%" >
      <v-subheader>IMPRIMIR:</v-subheader>
      <!-- options printer -->
      <v-row >
        <v-btn class="ma-5 text-white" :disabled="!awesome" color="primary" v-on:click="adicionarLinha()">
          <v-icon  >
            mdi-plus
          </v-icon>

          ADICIONAR LINHA
        </v-btn>

        <v-btn class="ma-5 text-white"  :disabled="!awesome" color="green" v-on:click="imprimir()">
          <v-icon  >
            mdi-printer
          </v-icon>

          imprimir
        </v-btn>
        
        <v-btn class="ma-5 text-white" :disabled="!awesome" color="purple" @click="viewPrinter = !viewPrinter">
          <v-icon  >
            mdi-eye
          </v-icon>
          vizualizar
        </v-btn>
      </v-row>
      
      <!-- product select -->
      <v-row class="ma-1" v-for="(option, i) in options" :key="i">
        <v-col cols="12" v-if="!awesome">
          <div >
            <v-progress-linear
              indeterminate
              color="primary"
            
            ></v-progress-linear>
          </div>
        </v-col>

        <v-col v-if="productsData.length>0"  cols="4">
          <v-autocomplete  v-model="option.product" :items="productsData" return-object item-text="DisplayName" label="Selecione o produto"/> 
        </v-col>

        <v-col cols="2" >
          <v-text-field v-if="awesome" v-model="option.amount" type="number" label="Quantidade"/>
        </v-col>
        
        <v-col v-if="awesome" cols="1" class="mt-3" >
          <v-btn icon color="red" @click="options.splice(i,1)">
            <v-icon  >
              mdi-delete
            </v-icon>
          </v-btn>
        </v-col>
        
        <VisualPrinter v-if="viewPrinter" :visualValue="option.product" :viewDataReceived="printerTag[id]" />
      
      </v-row>
    </v-card>  
  </div>
</template>

<script>
import axios from './../../axios.js'
import VisualPrinter from './visual/VisualPrinter'
export default {
  props: ['id'],
  components:{VisualPrinter},
  data() {
    return{
      productsData: [],
      optionReceivedsAimprimir: {},
      awesome:false,
      viewPrinter:false,
      printerTag: [{
        dataPrint:'',

        dataField:[{
          line:''
        }]
      }],

      printData:
      {
        company: 'nome teste empresa',
        product: undefined,
        codProduct: '5',
        codEAN13: '7060312949605'
      },

      options: [{
        product: '',
        amount: 0
      }],

      productsNames: [],
      valuePrinter: '',
      linePrinter: [],
      headerPrinter: `M100,80,10\nN\nQ192,24\nq880\nS2\nD4\nZB\n`
    }
  },

  methods:{
    adicionarLinha(){this.options.push({})},

    printerPPLB(){
      this.itemPPLB()
      this.valuePrinter = this.valuePrinter+'P2'
    },

    itemPPLB(){
      for(this.f=0; this.f<this.options.length; this.f++)
      {
        this.linePrinter[this.f] = ''
        
        this.linePrinter[this.f] = this.headerPrinter

        this.linesValues = this.printerTag[this.id].dataField.line

        for(this.i=0; this.i < this.linesValues.length; this.i++){
          
          if(this.printerTag[this.id].dataField.line[this.i].infoField == 'EAN13'){
            this.linePrinter[this.f] = this.linePrinter[this.f] + `B${this.linesValues[this.i].spaceXtension * 8},${this.linesValues[this.i].spaceYard * 8},0,E30,${this.linesValues[this.i].sizeFont * 8},${this.linesValues[this.i].typeFont * 8},${this.linesValues[this.i].spaceLine},N,"${this.printData.codEAN13}"\n`
          }
          else{
            if(this.linesValues[this.i].infoField == 'EMPRESA'){
              this.linePrinter[this.f] = this.linePrinter[this.f]+`A${this.linesValues[this.i].spaceXtension * 8},${this.linesValues[this.i].spaceYard * 8},0,${this.linesValues[this.i].typeFont},${this.linesValues[this.i].sizeFont},${this.linesValues[this.i].sizeFont},N,"${this.printData.company}"\n`
            }
            else  if(this.linesValues[this.i].infoField == 'PROD'){
              this.linePrinter[this.f] = this.linePrinter[this.f]+`A${this.linesValues[this.i].spaceXtension * 8},${this.linesValues[this.i].spaceYard * 8},0,${this.linesValues[this.i].typeFont},${this.linesValues[this.i].sizeFont},${this.linesValues[this.i].sizeFont},N,"${this.options[this.f].product}"\n`
            }else  if(this.linesValues[this.i].infoField == 'personalizado'){
              this.linePrinter[this.f] = this.linePrinter[this.f]+`A${this.linesValues[this.i].spaceXtension * 8},${this.linesValues[this.i].spaceYard * 8},0,${this.linesValues[this.i].typeFont},${this.linesValues[this.i].sizeFont},${this.linesValues[this.i].sizeFont},N,"${this.linesValues[this.i].textEditable}"\n`
            }
          } 
        }
        
        for(this.q=0; this.q < this.options[this.f].amount; this.q++){
           this.valuePrinter = this.valuePrinter + this.linePrinter[this.f] + `P1\n`
        }
        
      }
    },

    imprimir(){
      this.printerPPLB()

      var file = new Blob([this.valuePrinter], {type:"text"})  
      var anchor = document.createElement("a");
      anchor.href = URL.createObjectURL(file);
      anchor.download = "save.txt"
      anchor.click()

      this.valuePrinter = ''
    },
  
    
    async products(){
    
      const productos = await axios.get('/product',{  
       
        headers:{
          "Authorization": localStorage.hash,
          "Device-ID": localStorage.ID,
          "Content-Type": "application/json"
        },  
        data:{}        
      });
      const generalData = await axios.get('/general-settings',{  
       
        headers:{
          "Authorization": localStorage.hash,
          "Device-ID": localStorage.ID,
          "Content-Type": 'application/json'
        },  
        data:{}        
      });

      var dataConfig = generalData.data.data.company.config.company_name
       //retorno da api
       
      this.productsData = productos.data.data.map(dadosProd=>{
        let valuesReceived = dadosProd.properties
        valuesReceived.id = dadosProd.id
        valuesReceived.DisplayName = valuesReceived.code+" "+valuesReceived.name
        valuesReceived.companyName = dataConfig
        return valuesReceived
      })
      this.awesome = true     
      }, 
  },

  created(){
    this.$http.get('printDB').then(res => {this.printerTag = res.data})
    this.$http.get('dataPrinter').then(res => {this.optionReceivedsAimprimir = res.data})
    this.products()
  },
}
</script>

<style>
  .text-white{
    color:white !important; 
  }
</style>
