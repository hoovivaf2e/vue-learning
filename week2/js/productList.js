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
          alert('checkLogin: ', err.data.message);
          window.location = 'login.html';
        })
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
            alert('getProductList: ', error.response);
        })
      }
    },
    created() { // 用 mounted 和 created 的差別是什麼？
        this.checkLogin();
    }
}).mount('#app');