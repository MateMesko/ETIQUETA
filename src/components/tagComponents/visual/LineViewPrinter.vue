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
      partes: [],
      testes: ''
    };
  },

  computed:{
    
    lineTipe(){
      return this.lineProp.infoField
    },

    lineFont(){
      this.fontType()
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
        for(var leterIndex=0; leterIndex < this.itenValue.length; leterIndex++){
          this.itenValue[leterIndex] = undefined
        }

        for( leterIndex=0; leterIndex < Math.ceil(leters); leterIndex++){

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
      if(this.visualValue){
        const convertToPTS = typeSelected=>{
          const fontPTS={
            NOME_PROD:this.visualValue.name,
            NOME_EMPRESA:this.visualValue.companyName,
            EAN_13:this.visualValue.code,
            VALOR:this.visualValue.unitary_value.toFixed(2),
            PERSON_TEXT:this.lineProp.textEditable,
            COD_PROD:this.visualValue.code,
            COD_NOME:this.visualValue.DisplayName
          }
          return fontPTS[typeSelected]
        }
        this.transformValue(convertToPTS(this.lineProp.type))
      } 
    },
   
    fontType(){
      const convertToPTS = fontSelected=>{
        const fontPTS={
          1:6,
          2:7,
          3:10,
          4:12,
          5:24
        }
        return fontPTS[fontSelected]
      }
      this.tamanho=convertToPTS(this.lineProp.typeFont)
    }
  },

  created(){
    this.fontType()
  }
}
</script>

<style>

</style>
