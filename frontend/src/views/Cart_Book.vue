<template>
  <div>
    <NavBar />
    <div class="hero-body hero is-fullheight">
      <div class="container has-text-centered">
        <div class="column">
          <p class="is-size-3" style="color: #ac3b61">
            <i class="fa fa-book" aria-hidden="true"> </i>
            &nbsp;รายชื่อหนังสือใน ตะกร้า
          </p>
          <br />
          <div class="divider is-info" style="color: #123c69">
            Books in the cart
          </div>
        </div>
        <div v-if="Cart_item.length > 0">
          <div
            class="box"
            v-for="(cart, index) in Cart_item"
            v-bind:key="cart.id"
          >
            <article class="media">
              <div class="media-left">
                <img
                  :src="'http://localhost:3000/' + cart.image"
                  alt="Image"
                  style="object-fit: cover"
                  class="image is-128x128"
                />
              </div>
              <div class="media-content" style="margin-left: 900px">
                <div class="content">
                  <p>
                    <strong>ชื่อหนังสือ: {{ cart.title }}</strong>
                    <br />
                    <small>ราคา: {{ cart.price }}</small>
                  </p>
                </div>
                <div class="level-right">
                  <a class="level-item">
                    <span class="icon is-small" @click="dropbook(cart, index)">
                      <i class="fa fa-trash" style="color: #ac3b61"></i>
                    </span>
                  </a>
                </div>
              </div>
            </article>
          </div>
        </div>

        <div class="divider is-info is-size-6" style="color: #123c69">
          <router-link to="/" style="color: #123c69"
            >กลับไปเลือกซื้อหนังสือเพิ่ม</router-link
          >
        </div>
      </div>
      <div class="container hero-body">
        <div class="columns is-multiline box">
          <div class="column is-12">
            <h1 class="title has-text-centered section-title is-size-4">
              ยอดชำระเงิน : {{ totalprice }} บาท
            </h1>
          </div>
          <div class="column is-10 has-text-centered is-offset-1">
            <h2 class="subtitle">
              จำนวนหนังสือซื้อที่ซื้อ : {{ Cart_item.length }} เล่ม
            </h2>
            <router-link
              :to="`/CheckoutPage/${Cart_item[0].cart_id}`"
              style="color: #123c69"
              v-if="Cart_item.length > 0"
            >
              <button class="button">
                ไปหน้าชำระเงิน&emsp;<i
                  class="fa fa-arrow-circle-right"
                  aria-hidden="true"
                ></i>
              </button>
            </router-link>
            <div>
              <button class="button" disabled v-if="Cart_item.length == 0">
                ไปหน้าชำระเงิน&emsp;<i
                  class="fa fa-arrow-circle-right"
                  aria-hidden="true"
                ></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import axios from "@/plugins/axios";
export default {
  name: "Cart_Book",
  components: {
    NavBar,
  },
  data() {
    return {
      Cart_item: {
        0: {},
      },
      totalprice: 0,
    };
  },
  async mounted() {
    await this.getItems();
  },
  methods: {
    async getItems() {
      await axios
        .get("http://localhost:3000/getCartItem", {
          params: {
            search: this.search,
          },
        })
        .then((response) => {
          this.Cart_item = response.data;
          this.totalprice = response.data[0].total_price;
          console.log(this.Cart_item[0]);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async dropbook(arraycart, index) {
      await axios
        .delete(`http://localhost:3000/dropbook/${arraycart.item_no}`)
        .then(() => {
          this.Cart_item.splice(index, 1);
        })
        .catch((error) => {
          alert(error.response.data.message);
        });

      await axios
        .put(`http://localhost:3000/droptotalprice`, {
          cart_id: arraycart.cart_id,
          price: arraycart.price,
        })
        .then(() => {
          this.totalprice -= arraycart.price;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style >
@import "~@creativebulma/bulma-divider";
</style>