<template>
  <div id="app" class="demo">
    <span class="test">app</span>
  </div>
</template>

<script>
  import Vue from 'vue'

  import ElementUI from 'element-ui'
  import 'element-ui/lib/theme-chalk/index.css'

  Vue.use(ElementUI)

  export default {
    mixins: [],
    components: {},
    data() {
      return {}
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {
      // console.log(JSON.stringify(this.api, null, 2))
    },
    beforeDestroy() {},
    methods: {},
    provide() {
      return {}
    },
  }
</script>

<style lang="less">
  .demo {
    .test {
      color: red;
    }
  }
</style>
