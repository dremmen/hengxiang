<template>
  <div>
    <tabbar>
      <tabbar-item @click.native = "tagsChanges(index)" v-for="(item, index) in listFoot" :key="index" :link="item.url">
        <img slot="icon" :src="item.url2" v-if="indexs == index">
        <img slot="icon" :src="item.url1" v-else>
        <span slot="label" :class="{'active' : indexs == index}">{{item.name}}</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
  import { Tabbar, TabbarItem } from 'vux'
  import { baseURL } from '../api/api'
  const list = [
    {
      name: '首页',
      url: 'designBase',
      url1: require('../assets/img/index-icon.png'),
      url2: require('../assets/img/index-icon2.png')
    },
    {
      name: '设计师',
      url: 'designList',
      url1: require('../assets/img/designer-icon.png'),
      url2: require('../assets/img/designer-icon2.png')
    },
    {
      name: '图集',
      url: 'atlasList',
      url1: require('../assets/img/images-icon.png'),
      url2: require('../assets/img/images-icon2.png')
    },
    {
      name: '发标大厅',
      url: 'ordersHall',
      url1: require('../assets/img/bidding-icon.png'),
      url2: require('../assets/img/bidding-icon2.png')
    },
    {
      name: '个人中心',
      url: baseURL+'/weixin/personer.html',
      url1: require('../assets/img/person-icon.png'),
      url2: require('../assets/img/person-icon2.png')
    }
  ]

  export default {
    components: {
      Tabbar,
      TabbarItem
    },
    data () {
      return {
        indexs: 5,
        listFoot: list
      }
    },
    created () {
      for(var i in this.listFoot){
        if(this.$route.path === '/'+this.listFoot[i].url ){
          this.indexs = i
        }
      }
    },
    methods: {
      tagsChanges (i) {
        this.indexs = i
      }
    }
  }
</script>

<style type="text/css" scoped>
  #app .weui-tabbar{height: 5rem;position: fixed;}
  .weui-tabbar .weui-tabbar__icon{width: 2rem;height: 2rem;}
  .weui-tabbar .weui-tabbar__label{line-height: 2.5rem;font-size: 1rem;}
  .weui-tabbar__item.weui-bar__item_on .weui-tabbar__label,.weui-tabbar__label .active{color: #36c3bf!important;}
  .weui-tabbar__item{text-decoration: none;}
</style>
