<template>
  <scroller class="about_al"  
        :on-refresh="refresh"
        :on-infinite="infinite"
        ref="my_scroller">          
    <div class="about_li" v-for="(atlas, index) in atlasItems" :key="index">
      <router-link :to="{ path: 'atlasDetails', query: { 'atlas_id': atlas.atlas_id, 'designer_id': atlas.designer_id }}">     
        <img v-if="atlas.atlas_img_path" :src="baseURL+'/'+atlas.atlas_img_path[0]">
        <img v-else src="">
        <div class="about_tags">
          <span>{{atlas.atlas_style}}</span>
        </div>
        <p>{{atlas.atlas_introduction}}</p>
      </router-link>
    </div>
  </scroller>
</template>

<script>
  import { LoadMore, AlertModule } from 'vux'
  import { baseURL, atlasLists } from '../../api/api'

  export default {

    data() {
      return {
        items: [],
        baseURL,
        atlasItems: [],
        curpage: 1,
        page_total: 11111,
        is_bool: false,
      }
    },
    mounted () {
      this._atlasLists(this.curpage)   
    },

    methods: {
      refresh: function (done) {
        setTimeout(function () {
          done();
        }, 1500)
      },

      infinite: function (done) {
        var _this = this
        if(_this.curpage >= _this.page_total) {
          this.$refs.my_scroller.finishInfinite(true)
          return
        }
        setTimeout(function () {
          if(!_this.is_bool){
            _this.is_bool = true
          }else{
            _this.curpage++
            _this._atlasLists(_this.curpage)
            _this.$refs.my_scroller.resize();              
          }
          done();
        }, 1500)
      },

      _atlasLists (curpage) {
        atlasLists(curpage).then((res) => {
          this.is_bool = false
          this.page_total = res.data.page_total
          for(var i in res.data.items){
            this.atlasItems.push(res.data.items[i])
          }          
        })
      },
    }
  }
</script>


<style scoped>
  *{text-decoration-line: none;}
  .about_al{background-color: #f0f0f0;padding: 1rem 1.2rem;overflow: hidden;padding-bottom: 0;box-sizing: border-box;height: calc(100vh - 5rem)!important;position: relative!important;}
  .about_al .about_li{width: 49%;margin-right: 2%;background-color: #fff;margin-bottom: 2%;display: inline-block;}
  .about_al .about_li img{height: 17rem;}
  .about_al .about_li:nth-child(2n+1){margin-right: 0;}
  .about_al .about_li span{padding: 0 1rem;height: 1.9rem;display: inline-block;color: #fff;background-color: #fdb926;line-height: 1.9rem;border-radius: 10000px;margin-bottom: .5rem;font-size: 1.2rem;margin-top: .8rem;text-align: center;}
  .about_al .about_li div{padding-left: .25rem;}
  .about_al .about_li p{line-height: 2.0rem;font-size: 1.4rem;color: #000;padding-left: .25rem;width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;}
  .vux-loadmore{margin: 0 auto;}
  .about_al>a{width: 100%;height: 4.3rem;float: left;line-height: 4.3rem;text-align: center;color: #fff;font-size: 1.8rem;background-color: #12c098;border-radius: 10000px;}
</style>