<template>
    <div>
        <div class="ma-5" style="display:inline-table; ">
            <div :style="dimensions">
                <div style="display:table;" :style="position">
                    <div v-for="(lines,i) in viewDataReceived.dataField.line" :key="i">
                        <lineViewPrinter :visualValue="visualValue" :lineProp="lines" :slider="slider" :i="i"></lineViewPrinter>
                    </div>
                </div>      
            </div>
        </div>
    </div>
</template>

<script>

import lineViewPrinter from './DrawnLine.vue'

export default {
    components: { lineViewPrinter },
    props: ["viewDataReceived", "visualValue"],

    data() {
        return {
            tagArea: this.viewDataReceived.dataPrint,
            slider:1.5
        };
    },

    computed: {
        dimensions() {
            return `width:${this.viewDataReceived.dataPrint.widthTag * this.slider}mm; height:${this.viewDataReceived.dataPrint.heightTag * this.slider}mm; border-radius: 7px; border: 1px inset black;`;
        },
        position() {
            return `margin-left:${this.viewDataReceived.dataPrint.spaceRight * this.slider}mm; margin-top:${this.viewDataReceived.dataPrint.spaceTop * this.slider}mm`;
        }
    }
}
</script>

<style>
    
</style>
