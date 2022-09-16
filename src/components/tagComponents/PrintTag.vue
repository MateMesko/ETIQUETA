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

        <v-btn class="ma-5 text-white" :disabled="!awesome" color="green" v-on:click="imprimir()">
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
          <v-text-field min="1" v-if="awesome" v-model="option.amount" type="number" label="Quantidade"/>
        </v-col>
        
        <v-col v-if="awesome" cols="1" class="mt-3" >
          <v-btn icon color="red" @click="options.splice(i,1)">
            <v-icon  >
              mdi-delete
            </v-icon>
          </v-btn>
        </v-col>
        
        <VisualPrinter v-if="viewPrinter" :visualValue="option.product" :viewDataReceived="printerTag[id]"  @receivedData="itenRequestLine[i] = $event"/>
	  </v-row>
    </v-card>  
  </div>
</template>

<script>
import axios from './../../axios.js'
import VisualPrinter from './drawn/DrawnDimensions'
export default {
	props: ['id'],
	components:{VisualPrinter},
	data() {
		return{
			productsData: [],
			optionReceivedsAimprimir: {},
			awesome:false,
			viewPrinter:false,
			valueTagLines:'',
			itenRequestLine:[],
			printerTag: [{
				dataPrint:'',

				dataField:[{
					line:''
				}]
			}],

			printData:{
				company: 'nome teste empresa',
				product: undefined,
				codProduct: '5',
				codEAN13: '7060312949605'
			},

			options: [{
				product: '',
				amount: 1
			}],

			productsNames: [],
			valuePrinter: '',
			linePrinter: [],
			headerPrinter: 'M100,80,10\nN\nQ192,24\nq880\nS2\nD4\nZB\n'
		}
	},

	methods:{
		adicionarLinha(){this.options.push({amount:1})},

		printerPPLB(){
			this.itemPPLB()
			this.valuePrinter = this.valuePrinter+'P2'
		},

		itemPPLB(){
			for(let numberOfTag=0; numberOfTag<this.options.length; numberOfTag++){
				this.linePrinter[numberOfTag] = ''
				this.linePrinter[numberOfTag] = this.headerPrinter
				this.linesValues = this.printerTag[this.id].dataField.line
				
				for(let numberOfLine=0; numberOfLine < this.linesValues.length; numberOfLine++){
					let lengthRequest = this.itenRequestLine[numberOfTag][numberOfLine].length
					let spaceXtension = this.linesValues[numberOfLine].spaceXtension * 8
					let spaceYard = this.linesValues[numberOfLine].spaceYard * 8
					let spaceLine = this.linesValues[numberOfLine].spaceLine * 8

					for(let infoIndex=0; infoIndex < lengthRequest; infoIndex++){
						let configLine = this.itenRequestLine[numberOfTag][numberOfLine][infoIndex]
						let positionLine
						if(this.printerTag[this.id].dataField.line[numberOfLine].infoField == 'EAN13'){
							positionLine=`B`
						}
						else{
							positionLine= `A`
						}
						positionLine+=`${spaceXtension},${spaceYard+(spaceLine*infoIndex)}`
						let linePrinter = `${positionLine},${configLine}`

						this.linePrinter[numberOfTag] = this.linePrinter[numberOfTag]+linePrinter
					}	
				}

				for(this.q=0; this.q < this.options[numberOfTag].amount; this.q++){
					this.valuePrinter = this.valuePrinter + this.linePrinter[numberOfTag] + 'P1\n'
				}
			}
		},

		imprimir(){
			this.printerPPLB()

			var file = new Blob([this.valuePrinter], {type:'text'})  
			var anchor = document.createElement('a')
			anchor.href = URL.createObjectURL(file)
			anchor.download = 'save.txt'
			anchor.click()

			this.valuePrinter = ''
		},
  
    
		async products(){
    
			const productos = await axios.get('/product',{  
       
				headers:{
					'Authorization': localStorage.hash,
					'Device-ID': localStorage.ID,
					'Content-Type': 'application/json'
				},  
				data:{}        
			})
			const generalData = await axios.get('/general-settings',{  
       
				headers:{
					'Authorization': localStorage.hash,
					'Device-ID': localStorage.ID,
					'Content-Type': 'application/json'
				},  
				data:{}        
			})

			var dataConfig = generalData.data.data.company.config.company_name
			//retorno da api
       
			this.productsData = productos.data.data.map(dadosProd=>{
				let valuesReceived = dadosProd.properties
				valuesReceived.id = dadosProd.id
				valuesReceived.DisplayName = valuesReceived.code+' '+valuesReceived.name
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
