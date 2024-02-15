<template>
  <!-- display: none; -->
  <div>
    <nav
      @click="Warn = true"
      class="button is-rounded navbar is-fixed-bottom mb-4 ml-4"
      style="width: 120px; height: 55px; background-color: #edc7b7"
    >
      <span class="mt-2">รายการชำระเงิน</span>
    </nav>
    <div class="modal" :class="{ 'is-active': Warn }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <button
          class="modal-close is-large"
          aria-label="close"
          @click="Warn = false"
        ></button>

        <section class="modal-card-body">
          <p class="has-text-centered is-size-4">รายการ รอยืนยันการชำระเงิน</p>
          <div class="field">
            <div class="box" v-for="(box, index) in order" v-bind:key="index">
              <article class="media">
                <div class="media-left">
                  <figure>
                    <img
                      :src="'http://localhost:3000/' + box.order_image"
                      alt="Image"
                      style="object-fit: cover"
                      class="image is-64x64"
                    />
                  </figure>
                </div>
                <div class="media-content">
                  <div class="content">
                    <div>
                      <strong>ออเดอร์ที่ {{ box.order_id }}</strong>
                      <br />
                      รายการหนังสือ:
                      <span
                        v-for="(value, index) in orderlist"
                        v-bind:key="index"
                      >
                        <span v-if="value.order_id == box.order_id">
                          {{ value.title }}&nbsp;
                        </span>
                      </span>

                      <br />ราคาทั้งหมด: {{ box.total_price }}
                      <br />
                      สถานะออเดอร์: {{ box.statement }}
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success">บักทึก</button>
          <button class="button" @click="Warn = false">ยกเลิก</button>
        </footer>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["order", "orderlist"],
  name: "WarnPay",
  data() {
    return {
      Warn: false,
    };
  },
  mounted() {
    console.log(this.order);
  },
};
</script>