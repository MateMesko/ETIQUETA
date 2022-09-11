<template>
    <div>
        <div v-if="retrieved!=undefined">
            {{requestValues()}}
        </div>
        <!-- input data infos-->
        <v-form v-model="tagPrinter.valid">
            <v-container>
                <v-row  >
                    <v-col cols="9" >
                        <v-text-field v-model="tagPrinter.name" :rules="nameRule" required label="Nome da etiqueta" />
                    </v-col>

                    <v-col cols="3">
                        <v-text-field v-model="tagPrinter.code" :rules="codeRule" required label="Codigo da etiqueta" />
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="3">
                        <v-text-field type="number" v-model.number="tagPrinter.numColumn" :rules="columnRule" required label="Numero de colunas" />
                    </v-col>

                    <v-col cols="3">
                        <v-text-field type="number" v-model.number="tagPrinter.spaceColumn" :rules="spaceColumnRule" required label="Espaçamento entre colunas" />
                    </v-col>

                    <v-col cols="3">
                        <v-text-field type="number" v-model.number="tagPrinter.heightTag" :rules="widthRule" required  label="Altura da etiqueta" />
                    </v-col>

                    <v-col cols="3">
                        <v-text-field type="number" v-model.number="tagPrinter.widthTag" :rules="heightRule" required label="Largura da etiqueta" />
                    </v-col>
                </v-row>
                        
                <v-row>
                    <v-col cols="3">
                        <v-text-field type="number" v-model.number="tagPrinter.spaceTop" required label="Espaçamento superior" />
                    </v-col>

                    <v-col cols="3">
                        <v-text-field type="number" v-model.number="tagPrinter.spaceRight" required label="Espaçamento esquerda" />
                    </v-col>

                    <v-col cols="3">
                        <v-select type="number" v-model.number="tagPrinter.orientation"  required label="Inicio a partir:" :items="optionOrientation"   />
                    </v-col>
                </v-row>
            </v-container>     
        </v-form>
    </div>
</template>

<script>


export default {
    props:['retrieved'],
    data() {
        return {
            nameRule: [v => !!v || 'Informe o nome'],
            codeRule: [v => !!v || 'Informe o codigo'],
            columnRule: [v => !!v || 'Informe quantidade de colunas'],
            spaceColumnRule: [v => !!v || 'Informe espaçamento entre colunas'],
            widthRule: [v => !!v || 'Informe a altura'],
            heightRule: [v => !!v || 'Informe a largura'],
            optionOrientation: ['FINAL DA PAGINA','INICIO DA PAGINA'],
            
            tagPrinter:{
                valid: true,
                name: '',
                code: '',
                heightTag: 30,
                widthTag: 30,
                numColumn:1
            }
        }
    },
    
    methods:{
        requestValues(){  
            this.tagPrinter = this.retrieved.dataPrint
        }
    },

    watch:{
		tagPrinter:{
			deep: true,

			handler(){
				this.$emit('receivedData', this.tagPrinter)
			}
		}
	},
}

</script>

<style>

</style>
