<template>
  <div id="app" class="demo">
    <h3>Api object structure</h3>
    <p v-html="JSON.stringify($api, null, 2).replace(/ /g, '&nbsp; ').replace(/\n/g, '<br>').replace(/{}/g, 'RequestFunction')"></p>
    <button @click="request01">human</button>
    <br />
    <br />
    <button @click="request02">annimal.dog.golden</button>
    <h3>Results</h3>
    <p v-html="JSON.stringify(results, null, 2).replace(/ /g, '&nbsp; ').replace(/\n/g, '<br>').replace(/{}/g, 'RequestFunction')"></p>
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
      return {
        loading: false,
        results: [],
        num: 0,
      }
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {},
    beforeDestroy() {},
    methods: {
      async request01() {
        try {
          this.loading = true
          let { data } = await this.$api.human.request({})
          this.results.splice(0, 0, {
            num: ++this.num,
            time: new Date(),
            result: data,
          })
        } catch (e) {
          console.error(e)
        } finally {
          this.loading = false
        }
      },
      async request02() {
        try {
          this.loading = true
          let { data } = await this.$api.annimal.dog.golden.request({})
          this.results.splice(0, 0, {
            num: ++this.num,
            time: new Date(),
            result: data,
          })
        } catch (e) {
          console.error(e)
        } finally {
          this.loading = false
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
