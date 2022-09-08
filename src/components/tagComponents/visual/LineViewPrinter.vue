<template>
  <div>
    {{optionSelected()}}{{ fontType()}}
    <div style="display:table;position:absolute;font-family:" v-for="(breakLinesItens, k) in itenValue" :key="breakLinesItens" :style="lineFont + lineSpaceRight + lineSpaceTop">
      <div style="display:table;position:relative;font-family:	monospace;line-height: 60%;" :style="`margin-top:${lineProp.spaceLine*k}mm`">
        {{itenValue[k]}}
        
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: ["lineProp","i","slider","visualValue"],
  
  data() {
    return {
      itenValue: [],
      variavelTeste: "",
      tamanho: 0,
      teste: '',
      j: 0,
      partes: []
    };
  },

  computed:{
    lineTipe(){
      return this.lineProp.infoField
    },

    lineFont(){
      return `font-size:${(this.tamanho * this.slider) * (this.lineProp.sizeFont * this.slider)}pt;`
    },

    lineSpaceRight(){
      return `margin-left:${this.lineProp.spaceXtension * this.slider}mm;`
    },

    lineSpaceTop(){
      return `margin-top:${this.lineProp.spaceYard * this.slider}mm;`
    }, 
  },

  methods:{
    transformValue(valueLineBreak){
      
      if(this.lineProp.breakText != 0){
        let leters = valueLineBreak.length / this.lineProp.breakText 
        for(var leterIndex=0; leterIndex < this.itenValue.length; leterIndex++)
        {
          this.itenValue[leterIndex] = undefined
        }

        for( leterIndex=0; leterIndex < Math.ceil(leters); leterIndex++)
        {
          this.partes[leterIndex] = undefined
          this.partes[leterIndex] = ''
          for(var j=0; j < this.lineProp.breakText; j++){
            if(leterIndex > 0){
              if(valueLineBreak[j+(leterIndex * this.lineProp.breakText)])
              this.partes[leterIndex] += valueLineBreak[j + (leterIndex * this.lineProp.breakText)] 
            }
            else{
              this.partes[leterIndex] += valueLineBreak[j]
            }
          }  
          this.itenValue[leterIndex] = this.partes[leterIndex]
        }
      }

      else{

        for(leterIndex = 0 ; leterIndex < this.itenValue.length ; leterIndex++){
          this.itenValue[leterIndex] = undefined
        }
        this.itenValue[0] = valueLineBreak
      }
    },
    
    optionSelected(){
      if(this.lineProp.type == 'NOME_PROD'){
  
        this.transformValue(this.visualValue.name)
      }
      else if(this.lineProp.type == 'NOME_EMPRESA'){
        this.transformValue(this.visualValue.companyName)
      }
      else if(this.lineProp.type == 'EAN_13'){
        this.transformValue(this.visualValue.code)
      }else if(this.lineProp.type == 'VALOR'){

        this.transformValue(this.visualValue.unitary_value.toFixed(2))
      }
      else if(this.lineProp.type == 'PERSON_TEXT'){
        this.transformValue(this.lineProp.textEditable)
      }
      else if(this.lineProp.type == 'COD_PROD'){
        this.transformValue(this.visualValue.code)
      } 
      else if(this.lineProp.type == 'COD_NOME'){
        this.transformValue(this.visualValue.DisplayName)
      }
    },
   
    fontType(){
      if(this.lineProp.typeFont == '1'){
        this.tamanho = 6
      }
      else if(this.lineProp.typeFont == '2'){
        this.tamanho = 7
      }
      else if(this.lineProp.typeFont == '3'){
        this.tamanho = 10
      }
      else if(this.lineProp.typeFont == '4'){
        this.tamanho = 12
      }
      else if(this.lineProp.typeFont == '5'){
        this.tamanho = 24
      }
    }
  },

  created(){
    this.fontType()
  }
}
</script>

<style>

</style>
