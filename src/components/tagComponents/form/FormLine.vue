<template>
    <div >
        <div v-if="retrieved!=undefined">
        {{etiquetaRecebe()}}
        </div>

        <v-data-table :headers="headers" :items="dataField.line" hide-default-footer fixed-header height="43vh" >
            <template  v-slot:top>
                <v-toolbar  flat >
                    <v-spacer ></v-spacer>
                    <v-dialog v-model="dialog" persistent max-width="100vh" max-height="50vh">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="blue " small dark class="mb-2" v-bind="attrs" v-on="on" @click="createdItem()">
                                <v-icon small class="mr-2" @click="editItem(item)">
                                mdi-note-plus
                                </v-icon>
                                Adicionar
                            </v-btn>
                        </template>

                        <v-card>
                            <v-card-title  class="text-h4 blue">
                                <v-icon x-large color="white" class="mr-2">
                                mdi-pencil
                                </v-icon>
                                
                                <span class="text-white">{{ formTitle }}</span>
                            </v-card-title>
        
                        
                            <v-form  v-model="valid">
                                <v-container >
                                    <v-row >
                                        <v-col md="12" class="ma-0">
                                        <v-select v-model="editedItem.infoField" :items="productsData" return-object :rules="infoRule" label="Campo" required/>     
                                        </v-col>
                                    </v-row>
                                
                                    <v-row >
                                        <v-col v-if="editedItem.infoField=='TEXTO PERSONALIZADO'" md="12" class="ma-0">
                                        <v-text-field v-model="editedItem.textEditable" label="Texto personalizado" required/>     
                                        </v-col>
                                    </v-row>

                                    <div >
                                        <v-row>
                                            <v-col md="6" >
                                                <v-select v-if="editedItem.infoField!='EAN13'" type="number" v-model.number="editedItem.typeFont" :items="fonte" :rules="typeFontRule" label="tipo de fonte"/>
                                                <v-select v-else  type="number" v-model.number="editedItem.typeFont" :items="ean13tamanhos"  label="largura barra grossa"/>
                                            </v-col>

                                            <v-col md="6" >
                                                <v-select v-if="editedItem.infoField!='EAN13'" type="number"  v-model.number="editedItem.sizeFont" :items="tamanhos" :rules="sizeFontRule" label="tamanho da fonte"/>
                                                <v-select v-else type="number"  v-model.number="editedItem.sizeFont" :items="ean13tamanhos" label="largura barra fina"/>
                                            </v-col>
                                        </v-row>

                                        <v-row>
                                            <v-col md="6" >
                                                <v-text-field v-if="editedItem.infoField!='EAN13'" type="number" v-model.number="editedItem.breakText" label="quebra texto (LETRAS ATÉ PULAR A LINHA)"/>
                                                <v-select v-else type="text" v-model="editedItem.breakText" :items="optionsEAN13on" label="exibir codigo?"/>
                                            </v-col>

                                            <v-col md="6" >
                                                <v-text-field v-if="editedItem.infoField!='EAN13'" type="number" v-model.number="editedItem.spaceLine" label="espaçamento entre linha(mm)"/>
                                                <v-text-field v-else type="number" v-model.number="editedItem.spaceLine" label="Altura"/>
                                            </v-col>
                                        </v-row>
                                    </div>

                                    <v-row>
                                        <v-col md="6" >
                                            <v-text-field type="number" v-model.number="editedItem.spaceYard" label="espacamento superior(mm)"/>
                                        </v-col>
                                        
                                        <v-col md="6" >
                                            <v-text-field type="number" v-model.number="editedItem.spaceXtension" label="Espaçamento a esquerda(mm)"/>
                                        </v-col>
                                    </v-row>
									<VisualPrinter class="centerText" :visualValue="visualValue" :viewDataReceived="viewDataReceived" />
                                </v-container>
                            </v-form>
        
                            <v-card-actions >
                                <v-spacer></v-spacer>
                                
                                <v-btn color="red darken-1" text @click="closeModal()">
                                fechar
                                </v-btn>

                                <v-btn :disabled="!valid" color="green darken-1" text @click="save">
                                CONFIRMAR
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <v-dialog v-model="dialogDelete" max-width="500px">
                        <v-card>
                            <v-card-title class="text-h5">Deseja remover esse item?</v-card-title>

                            <v-card-actions>
                                <v-spacer></v-spacer>

                                <v-btn color="blue darken-1" text @click="close">CANCELAR</v-btn>

                                <v-btn color="blue darken-1" text @click="deleteItemConfirm">DELETAR</v-btn>

                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>

            <template v-slot:item.actions="{ item }">
                <v-tooltip bottom color="blue darken-1">
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon color="blue darken-1" v-bind="attrs" v-on="on" @click="editItem(item)">
                        mdi-pencil
                        </v-icon>
                    </template>

                    <span>
                        EDITAR
                    </span>
                </v-tooltip>

                <v-tooltip bottom color="red lighten-1">
                    <template  v-slot:activator="{ on, attrs }">
                        <v-icon  color="red lighten-1" v-bind="attrs" v-on="on" @click="deleteItem(item)">
                        mdi-delete
                        </v-icon>
                    </template>

                    <span>
                        DELETAR
                    </span>
                </v-tooltip>
            </template>
            
            <template v-slot:no-data>
                <v-alert color="orange" class="mt-6" dense type="info">
                Clicke em <strong>ADICIONAR</strong> para criar uma linha
                </v-alert>
            </template>
        </v-data-table>
    </div>
</template>

<script>
import VisualPrinter from '../drawn/DrawnDimensions'

export default {
	props: ['retrieved','viewDataReceived', 'visualValue'],
   	components: {VisualPrinter},

	data: () => ({
		infoRule:[v => !!v || 'Informe o campo'],
		typeFontRule:[v => !!v || 'Informe a fonte'],
		sizeFontRule:[v => !!v || 'Informe tamanho de fonte'],
		valid:false,
		productsData: ['NOME DA EMPRESA', 'CODIGO DO PRODUTO', 'NOME DO PRODUTO', 'CODIGO+NOME DO PRODUTO', 'VALOR', 'EAN13', 'TEXTO PERSONALIZADO'],
		fonte: [ 1, 2, 3, 4, 5, 6, 7, 8, 9],
		tamanhos: [1, 2, 3, 4, 5, 6, 7, 8, 9],
		ean13tamanhos: [0,1, 2, 3, 4, 5, 6, 7, 8, 9],
		optionsEAN13on:['sim','não'],
		dialog: false,
		dialogDelete: false,
		createdValue:false,
		headers: [{
			text: 'INFORMAÇÃO EM LINHA',
			align: 'start',
			sortable: false,
			value: 'infoField',
		},
    
		{ text: 'FONTE', value: 'typeFont' },
		{ text: 'TAMANHO', value: 'sizeFont' },
		{ text: 'ESPAÇAMENTO INFERIOR', value: 'spaceYard' },
		{ text: 'ESPAÇAMENTO ESQUERDA', value: 'spaceXtension' },
		{ text: 'AÇÕES', value: 'actions', sortable: false },
		],
    
		dataField:{
			line: [],
		},
  
		editedIndex: -1,
        tempValue:false,
		editedItem: {
			infoField: '',
			textEditable:'',
			typeFont: 0,
			sizeFont: 1,
			breakText: 0,
			spaceLine: 0,
			spaceYard: 0,
			spaceXtension: 0,
			secao: 0,
		},
      
		defaultItem: {
			infoField: 'NOME DA EMPRESA',
			textEditable:'',
			typeFont: 0,
			sizeFont: 0,
			breakText: 0,
			spaceLine: 0,
			spaceYard: 0,
			spaceXtension: 0,
			secao: 0,
		},
	}),
  
	computed: {
		formTitle () {
			return this.editedIndex === -1 ? 'NOVA LINHA' : 'EDITAR LINHA'
		},
	},
  
	watch: {
		dialog (val) {
			val || this.close()
		},

		dialogDelete (val) {
			val || this.closeDelete()
		},
    
		dataField:{
			deep:true,
			handler(){
				this.$emit('receivedField', this.dataField)
			}
		},

		editedItem:{
			deep:true,
			handler(){

				this.uploadData()
				this.$emit('receivedField', this.dataField)
			}
		}
	},
  
	created () {
		this.initialize()
	},
  
	methods: {
		initialize () {
			this.dataField.line = []
		},
  
		editItem (item) {
			this.editedIndex = this.dataField.line.indexOf(item)
			this.editedItem = Object.assign({}, item)
			this.dialog = true
		},
		createdItem(){

			this.createdValue=true

		}
		,
		deleteItem (item) {
			this.editedIndex = this.dataField.line.indexOf(item)
			this.editedItem = Object.assign({}, item)
			this.dialogDelete = true
		},
  
		deleteItemConfirm () {
			this.dataField.line.splice(this.editedIndex, 1)
			this.closeDelete()
		},
  
		close () {
			this.dialog = false
			this.$nextTick(() => {
				this.editedItem = Object.assign({}, this.defaultItem)
				this.editedIndex = -1
			})
		},
  
		closeDelete () {
			this.dialogDelete = false
			this.$nextTick(() => {
				this.editedItem = Object.assign({}, this.defaultItem)
				this.editedIndex = -1
			})
		},
		closeModal(){
			if(this.tempValue==true)
			{	
				this.tempValue=false
				this.dataField.line.pop(this.editedItem)
			}
			this.close()
		}
		,
		save () {	
			this.tempValue=false
            this.close()
		},
		uploadData(){
			const convertToValueAPI = typeSelected=>{
				const valuesAPI={
					'NOME DA EMPRESA' : 'NOME_EMPRESA',
					'CODIGO DO PRODUTO' : 'COD_PROD',
					'NOME DO PRODUTO' :'NOME_PROD',
					'CODIGO+NOME DO PRODUTO' : 'COD_NOME',
					'VALOR' : 'VALOR',
					'EAN13' : 'EAN_13',
					'TEXTO PERSONALIZADO' : 'PERSON_TEXT'
				}

				return valuesAPI[typeSelected]
			}
			if(this.createdValue == true && this.dialog == true){
				this.dataField.line.push(this.editedItem)
				this.createdValue = false
				this.tempValue=true
			}

			this.editedItem.type=convertToValueAPI(this.editedItem.infoField)
        

			if (this.editedIndex > -1) {
				Object.assign(this.dataField.line[this.editedIndex], this.editedItem)
			}
			
		},
		etiquetaRecebe(){
			this.dataField = this.retrieved.dataField
		},
	},
  
}
</script>

<style>
.text-white{
    color:white !important; 
  }
</style>
