import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

createApp({
    data() {
      return {
        apiUrl: 'https://vue3-course-api.hexschool.io/v2/api',
        apiPath: 'megan_api',
        isActive: false,
        itemDetails: [],
        products: []
      }
    },
    methods: {
      checkLogin() {
        // 取出 token 並將 token 的 name 去除只留 value
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)mainToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        axios.defaults.headers.common['Authorization'] = token;
        
        axios.post(`${this.apiUrl}/user/check`)
        .then(() => {
            this.getProductList();
        })
        .catch((err) => {
          console.log('checkLogin: ', err.data.message);
          alert('登入失敗，請重新登入');
          window.location = 'login.html';
        })
      },
      isEnabled(item, is_enabled) {
        // 這裡的啟用似乎沒有改到資料庫裡的資料，是否有能修改資料的api呢？
        is_enabled ? item.is_enabled = 0 : item.is_enabled = 1;
      },
      viewDetails(item) {
        this.itemDetails = item
      },
      getProductList() {
        axios.get(`${this.apiUrl}/${this.apiPath}/admin/products`)
        .then(response => {
          // 陣列的最後有兩筆測試資料，不想讓測試資料顯示，又找不到刪除測試資料的辦法
          this.products = response.data.products.splice(0,3);
        })
        .catch((error) => {
            console.log('getProductList: ', error.response);
            alert('抓取資料失敗');
        })
      }
    },
    created() { // 用 mounted 和 created 的差別是什麼？
        this.checkLogin();
    }
}).mount('#app');