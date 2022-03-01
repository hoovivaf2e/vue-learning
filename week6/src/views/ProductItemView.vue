<template>
  <div class="container">
    <div class="row my-3">
      <div class="col-md-6">
        <span class="badge bg-primary rounded-pill">
          {{ product.category }}
        </span>
        <p>商品描述：{{ product.description }}</p>
        <p>商品內容：{{ product.content }}</p>
        <div class="h5" v-if="!product.price">
          {{ product.origin_price }} 元
        </div>
        <del class="h6" v-if="product.price"
          >原價 {{ product.origin_price }} 元</del
        >
        <div class="h5" v-if="product.price">
          現在只要 {{ product.price }} 元
        </div>
        <div>
          <div class="input-group">
            <input
              type="number"
              class="form-control"
              v-model.number="qty"
              min="1"
            />
            <button
              type="button"
              class="btn btn-primary"
              @click="addToCart(product.id, qty)"
            >
              加入購物車
            </button>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <img class="img-fluid" :src="product.imageUrl"/>
        <span v-for="(image, id) in product.imagesUrl" v-bind:key="id">
          <img v-if="image" v-bind:src="image" class="images mt-2">
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import emitter from '../libs/emitter';

export default {
  data() {
    return {
      product: {},
      qty: 1,
    };
  },
  methods: {
    getProduct() {
      const { id } = this.$route.params;
      this.axios.get(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/product/${id}`)
        .then((res) => {
          this.product = res.data.product;
        })
        .catch((err) => {
          console.log(err.data.message);
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
          alert(res.data.message);
          this.isLoadingItem = '';
          // get-cart 觸發監聽行為
          emitter.emit('get-cart');
        });
    },
  },
  mounted() {
    this.getProduct();
  },
};
</script>

<style lang="scss" scoped>
img {
    object-fit: contain;
    max-width: 80%;
}
.images {
  height: 150px;
  margin-right: .5rem;
}
</style>
