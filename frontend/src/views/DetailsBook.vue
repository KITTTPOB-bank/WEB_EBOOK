<template>
  <div>
    <NavBar />
    <div>
      <div class="hero-body hero is-fullheight mt-6">
        <div class="container has-text-centered">
          <div class="columns is-vcentered">
            <div class="column is-4">
              <figure class="image is-1by1">
                <img :src="'http://localhost:3000/' + book[0].image" />
              </figure>
            </div>
            <div class="column is-6 is-offset-1">
              <p class="title is-3">
                {{ book[0].title }}
              </p>
              <br />
              <p class="subtitle is-5">
                {{ book[0].desc }}
              </p>
              <p class="subtitle is-6">เขียนโดย : {{ book[0].penname }}</p>
              <p class="subtitle is-6">
                ประเภท :
                <span v-for="(value, index) in book[0].type" :key="index">
                  {{ value }}
                </span>
              </p>
              <p class="subtitle is-6" v-if="book[0].publish_date != null">
                วันที่วางขาย :
                {{ new Date(book[0].publish_date).toLocaleString() }}
              </p>
              <p class="subtitle is-6">ราคา : {{ book[0].price }} บาท</p>

              <br />
              <div
                v-show="
                  this.checkadmin.length == 0 &&
                  this.book[0].status == 'succeed'
                "
              >
                <div
                  class="level-centere"
                  v-if="
                    this.totalBook.find((x) => x.book_id == book[0].id) ===
                    undefined
                  "
                >
                  <a
                    class="button is-medium is-info is-outlined"
                    @click="cardpush(book[0])"
                  >
                    เพิ่มลงในตะกร้า
                  </a>
                </div>
                <div class="level-centere" v-else>
                  <a class="button is-medium is-info is-outlined" disabled>
                    มีหนังสือเล่มนี้แล้ว
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="divider is-info is-size-6" style="color: #123c69">
          <router-link to="/" style="color: #123c69"
            >กลับไปเลือกซื้อหนังสือเพิ่ม</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import NavBar from "@/components/NavBar";
import axios from "@/plugins/axios";
export default defineComponent({
  name: "DetailsBook",
  components: {
    NavBar,
  },
  data() {
    return {
      book: {
        0: { image: "" },
      },
      cart: [],
      cart_item: [],
      pay: {},
      mybook: [],
      totalBook: [],
      checkadmin: [],
    };
  },
  async mounted() {
    await this.getBookDetail(this.$route.params.id);
    await this.getcheck();
    this.totalBook = [...this.cart_item, ...this.mybook];
  },

  methods: {
    async getBookDetail(id) {
      await axios
        .get(`http://localhost:3000/DetailsBook/${id}`)
        .then((response) => {
          this.book = response.data;
        })
        .catch((error) => {
          this.error = error.response.data.message;
        });

      await axios
        .get(`http://localhost:3000/admindcheck`)
        .then((response) => {
          this.checkadmin = response.data;

          console.log(this.checkadmin);
        })
        .catch((error) => {
          this.error = error.response.data.message;
        });
    },
    async getcheck() {
      await axios
        .get(`http://localhost:3000/cart_check`)
        .then((response) => {
          this.cart = response.data.cart;
          this.pay = response.data.payment;
          this.mybook = response.data.mybook;
        })
        .catch((err) => {
          console.log(err);
        });
      await axios
        .get(
          `http://localhost:3000/cartitem/${
            this.cart[this.cart.length - 1].cart_id
          }`
        )
        .then((response) => {
          this.cart_item = response.data;
          this.numbookincart = this.cart_item.length;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async cardpush(book) {
      await axios
        .post(`http://localhost:3000/addbook/${book.id}`, {
          price: book.price,
        })
        .then((response) => {
          this.totalBook = [...this.totalBook, response.data[0]];
          this.cart_item = [...this.cart_item, response.data[0]];
          this.numbookincart = this.cart_item.length;
        })

        .catch((err) => {
          console.log(err);
        });
      await axios
        .put(`http://localhost:3000/totalprice`, {
          price: book.price,
        })
        .then(() => {})
        .catch((err) => {
          console.log(err);
        });
    },
  },
});
</script>
<style lang="">
</style>