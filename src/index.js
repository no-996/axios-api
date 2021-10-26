import Vue from 'vue'
import App from '@/App.vue'

/**
 * 开发调试console
 * @param {string} msg
 * @param {object} option {color:string,fontSize:number,filename:string,detail:any}
 */
Vue.prototype.log = (msg = '', option = {}) => {
  if (process.env.NODE_ENV === 'development') {
    let opts = {
      ...{
        color: 'rgb(70,160,252)',
        fontSize: 20,
        filename: '',
        detail: '',
      },
      ...option,
    }

    if (opts.filename || opts.detail) {
      console.log('%c-------------------->', 'color:gray')
      console.log(`%c${msg}`, `color:${opts.color};font-size:${opts.fontSize}px;`)
      if (opts.filename) {
        console.log('%cfilename: ', `color:green;font-size:${opts.fontSize - 2}px;`)
        console.log(`%c${opts.filename.replace(/\?.*$/, '')}`, `color:gray;14px;`)
      }
      if (opts.detail) {
        console.log('%cdetail: ', `color:green;font-size:${opts.fontSize - 2}px;`)
        // console.log(
        //   `%c${typeof opts.detail === 'string' ? opts.detail : JSON.stringify(opts.detail, null, 2)}`,
        //   `color:gray;14px;font-size:${opts.fontSize - 4}px;`
        // )
        console.log(opts.detail)
      }

      console.log('%c<--------------------', 'color:gray')
    } else {
      console.log(`%c${msg}`, `color:${opts.color};font-size:${opts.fontSize}px;`)
    }
  }
}

new Vue({
  el: '#app',
  render: (h) => h(App),
})
