<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" :to="{ name: 'admin'}">後台</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'product'}">前台</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'products'}">產品列表</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'coupon'}">優惠券</router-link>
          </li>
        </ul>
      </div>
      <div class="d-flex justify-content-end">
        <button class="btn btn-outline-primary" type="button" @click="logout">登出</button>
      </div>
    </div>
  </nav>
  <router-view v-if="checkSuccess"></router-view>
</template>

<script>
export default {
  data() {
    return {
      checkSuccess: false,
    };
  },
  methods: {
    checkLogin() {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)mainToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
      this.axios.defaults.headers.common.Authorization = token;

      this.axios.post(`${process.env.VUE_APP_API}/api/user/check`, { api_token: token })
        .then(() => {
          // 通過 check api 驗證後改為 true
          this.checkSuccess = true;
          // 成功後讀取產品列表
          alert('成功登入');
        })
        .catch(() => {
          alert('登入失敗，請重新登入');
          this.$router.push({ name: 'login' });
        });
    },
    logout() {
      this.axios.post(`${process.env.VUE_APP_API}/logout`)
        .then((res) => {
          alert(res.data.message);
          this.$router.push({ name: 'login' });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    this.checkLogin();
  },
};
</script>
