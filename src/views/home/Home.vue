<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <scroll
      class="content"
      ref="scroll"
      :probety-type="3"
      :pull-up-load="true"
      @scroll="contentClick"

      >
      <home-swiper :banners="banners"></home-swiper>
      <home-recommend-view :recommends="recommends"></home-recommend-view>
      <home-feature-view/>
      <tab-control class="tab-control" :titles="['流行','新款','精选']" @tabClick="tabClick"/>
      <good-list :goods="showGoods" />
    </scroll>
    <back-top @click.native="scrollTop" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import TabControl from "components/content/tabControl/tabControl";
  import Scroll from "components/common/scroll/Scroll";
  import GoodList from "components/content/goods/GoodList";

  import HomeSwiper from "./childComps/HomeSwiper";
  import HomeRecommendView from "./childComps/HomeRecommendView";
  import HomeFeatureView from "./childComps/HomeFeatureView";


  import {getHomeMultidata, getHomeGoods} from "network/home";
  import BackTop from "../../components/content/backTop/BackTop";
  import {debounce} from "../../common/utils";

  export default {
    name: "Home",
    components: {
      BackTop,
      NavBar,
      TabControl,
      Scroll,
      GoodList,
      HomeSwiper,
      HomeRecommendView,
      HomeFeatureView

    },
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        currentType:'pop',
        isShowBackTop:false
      }
    },

    computed:{
      showGoods(){
        return this.goods[this.currentType].list
      }
  },
    methods: {

    /*事件监听方法*/
     tabClick(index){
        switch(index){
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
     },

      scrollTop(){
        this.$refs.scroll.scrollTo(0,0);
      },

      contentClick(position){
       this.isShowBackTop = -(position.y) > 1000 ;
      },

      loadMore(){
        this.getHomeGoods(this.currentType);

        this.$refs.scroll.scroll.refresh();
      },

      /*网络请求方法*/

      getHomeMultidata() {
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        });
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1;
        getHomeGoods(type, page).then(res => {
          this.goods[type].list.push(...res.data.list);
          this.goods[type].page += 1;

          // 完成加载加载更多,要调用方法重置 才能继续触发pullingUp事件
          // this.$refs.scroll.finishPullUp();
        })
      }

    },
    mounted(){
      const refresh =debounce(this.$refs.scroll.refresh,500);
      this.$bus.$on("imgFinishLoad",() =>{
          refresh();
      });
    },
    created() {
      this.getHomeMultidata();

      this.getHomeGoods('pop');
      this.getHomeGoods('new');
      this.getHomeGoods('sell');


    }
  }
</script>

<style scoped>
  #home {
    padding-top: 44px;
    height: 100vh;
    position: relative;
  }


  .home-nav {
    background-color: var(--color-tint);
    color: #fff;
    /*在使用浏览器原生滚动时, 为了让导航不跟随一起滚动*/
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
  }

  .tab-control {

    position: sticky;
    top: 40px;
    background-color: #fff;
  }
  /*两种方法 1.高度计算 2.绝对位置*/
  .content{
    position: absolute;
    top:44px;
    bottom:49px;
    left:0px;
    right:0px;
  }


  /*.content {*/
  /*height: calc(100% - 93px);*/
  /*overflow: hidden;*/
  /*margin-top: 44px;*/
  /*}*/
</style>
