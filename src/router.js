import Vue from 'vue'
import Router from 'vue-router'
import HomeTag from './components/Index.vue'

import ListTags from './components/tagComponents/IndexTag'
import FormTagData from './components/tagComponents/FormTag'
import PrinterTags from './components/tagComponents/PrintTag'

import login from './components/login/Login'
Vue.use(Router)

export default new Router({
    mode:'history',

    routes:[{    
        path:'/',
        component:ListTags
    },

    {
        path:'/etiqueta',
        component:HomeTag,
        props:true,
        children:[
            {path:'', component:ListTags, name:"home"},
            {path:':id', component:FormTagData, props:true, name:"editValues"},
            {path:'imprimir/:id',component:PrinterTags,props:true}
        ]
    },
    
    {
        path:'/login',
        component:login, name:"login"
    },

    {
        path:'/criar',
        component:FormTagData,props:true,
        name:"criarEtiqueta"
    }]
})