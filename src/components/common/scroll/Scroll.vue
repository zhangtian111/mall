<template>
    <div class="wrapper" ref="wrapper">
      <div class="content">
        <slot></slot>
      </div>
    </div>
</template>

<script>

  import BScroll from 'better-scroll'



  export default {
    name: "Scroll",
    components:{
      BScroll
    },
    props:{
      probeType:{
        type:Number,
        default:0
      },
      pullUpLoad:{
        type:Boolean,
        default:false
      }
  },
    data(){
      return {
        scroll:null
      }
    },
    mounted() {

      this.scroll = new BScroll(this.$refs.wrapper,{
         // button元素不影响监听click，div监听click需要设置为true
         click:true,
         probeType:this.probeType,
         pullUpLoad:this.pullUpLoad
      })

      this.scroll.on("scroll",(position) => {
        // console.log(position);
        this.$emit("scroll",position);
      })

      this.scroll.on("pullingUp",() => {
        this.$emit("pullingUp");
      })
    },
    methods:{
      scrollTo(x,y,time=300){
        this.scroll.scrollTo(x,y,time);
      },
      finishPullUp(){
        this.scroll.finishPullUp();
      },
      refresh(){
        console.log("----");
        this.scroll.refresh();
      }
    }
  }
</script>

<style scoped>

</style>
