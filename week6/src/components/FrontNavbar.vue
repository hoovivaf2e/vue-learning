<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" :to="{ name: 'home'}">前台</router-link>
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
            <router-link class="nav-link" :to="{ name: 'admin'}">後台</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'product'}">產品列表</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'cart'}">購物車</router-link>
          </li>
        </ul>
      </div>
      <button type="button" class="btn btn-primary" @click="goTo('cart')">
        結帳
        <span class="badge rounded-pill bg-danger">{{cartData.carts.length}}</span>
      </button>
    </div>
  </nav>
</template>

<script>
import emitter from '../libs/emitter';

export default {
  data() {
    return {
      cartData: {
        carts: [],
      },
    };
  },
  methods: {
    getCart() {
      this.axios.get(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart`)
        .then((res) => {
          this.cartData = res.data.data;
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    goTo(name) {
      this.$router.push({ name });
    },
  },
  mounted() {
    this.getCart();
    // 使用 mitt 監聽，當事件觸發的時候會做以下的事：getCart()
    emitter.on('get-cart', () => {
      this.getCart();
    });
  },
};
</script>
