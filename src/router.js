import Vue from 'vue'
import Router from 'vue-router'
import HomeTag from './components/Index.vue'

import ListTags from './components/tagComponents/IndexTag'
import InputValuesTag from './components/tagComponents/InputTag'
import PrinterTags from './components/tagComponents/PrintTag'

import login from './components/login/Login'
Vue.use(Router)

export default new Router({
    mode:'history',
        //buscar como colocar nome em rotas
        //mesma rotas em iguais
        //nomeclarutra
    routes:[{    
        path:'/',
        component:ListTags
    },
    {
        path:'/etiqueta',
        component:HomeTag,
        name:"home",
        props:true,
        children:[
            {path:'', component:ListTags, name:"home"},
            {path:':id', component:InputValuesTag, props:true, name:"editValues"},
            {path:'imprimir/:id',component:PrinterTags,props:true, }
        ]
    },
    {
        path:'/login',
        component:login, name:"login",
    },
    {
        path:'/criar',
        component:InputValuesTag,props:true,
        name:"criarEtiqueta"
    }]
})