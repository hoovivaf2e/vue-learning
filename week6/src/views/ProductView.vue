<template>
  <div class="container">
    <h1>產品列表</h1>
    <div class="row row-cols-1 row-cols-lg-4 g-3">
      <div class="col" v-for="product in products" :key="product.id">
        <div class="card-group">
          <div class="card card-height">
            <div class="card-item-img">
              <img :src="product.imageUrl" class="card-img-top">
            </div>
            <div class="card-body">
              <h5 class="card-title">{{product.title}}</h5>
              <p class="card-text">{{product.description}}</p>
            </div>
            <div class="card-footer">
              <div class="d-flex justify-content-between">
                <router-link :to="{name: 'product-item', params: {id: product.id}}"
                class="btn btn-primary">
                查看更多
                </router-link>
                <button class="btn btn-danger" @click.prevent="addToCart(product.id)">加入購物車</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import emitter from '../libs/emitter';

export default {
  data() {
    return {
      products: [],
      isLoadingItem: '',
    };
  },
  methods: {
    getProducts() {
      this.axios.get(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/products/all`)
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addToCart(id, qty = 1) {
      const data = {
        product_id: id,
        qty,
      };
      this.isLoadingItem = id;
      this.axios.post(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart`, { data })
        .then((res) => {
          console.log(res.data.message);
          this.isLoadingItem = '';
          // get-cart 觸發監聽行為
          emitter.emit('get-cart');
        })
        .catch((err) => {
          console.log(err.data.message);
        });
    },
  },
  mounted() {
    this.getProducts();
  },
};
</script>

<style lang="scss" scoped>
.card-height {
  height: 320px;
}
.card-item-img {
  height: 200px;
  overflow: hidden;
  img {
    margin-top: 0%;
  }
}
</style>
