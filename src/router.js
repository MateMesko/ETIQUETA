import Vue from 'vue'
import Router from 'vue-router'
import home from './components/tagComponents/ListTags'

import HomeTag from './components/tagComponents/HomeTag'
import ListTags from './components/tagComponents/ListTags'
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
        component:home
    },
    {
        path:'/etiqueta',
        component:HomeTag,
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