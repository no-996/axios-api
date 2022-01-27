<template>
  <div id="app" class="demo">
    <el-button type="primary" @click="cancelCurrent">Cancel current</el-button>
    <el-button type="primary" @click="cancelPrevious">Cancel previous</el-button>
    <el-button type="primary" @click="cache">Cache</el-button>
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
      // this.$api.posts.request
      // this.$api.posts.comments.request
    },
    beforeDestroy() {},
    methods: {
      async cancelCurrent() {
        try {
          let res = await this.$api.todos.request()
          console.log(res)
        } catch (e) {
          console.error(e)
        } finally {
        }
      },
      async cancelPrevious() {
        try {
          let res = await this.$api.users.request()
          console.log(res)
        } catch (e) {
          console.error(e)
        } finally {
        }
      },
      async cache() {
        try {
          console.log(`request: ${Date.now()}`)
          let res = await this.$api.photos.request()
          console.log(res)
        } catch (e) {
          console.error(e)
        } finally {
        }
      },
    },
    provide() {
      return {}
    },
  }
</script>

<style lang="less">
  .demo {
  }
</style>
