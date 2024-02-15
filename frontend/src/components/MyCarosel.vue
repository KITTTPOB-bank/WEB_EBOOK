<template >
  <div class="mt-6">
    <Carousel :items-to-show="1" :autoplay="3500" :wrap-around="true">
      <Slide v-for="slide in promotion" :key="slide">
        <div class="carousel__item">
          <router-link :to="`/DetailPromotion/${slide.promotion_id}`">
            <img
              :src="slide.promotionimage"
              style="width: 850px; height: 470px"
            />
          </router-link>
        </div>
      </Slide>

      <template #addons="{ slidesCount }">
        <Pagination v-if="slidesCount > 1" />
      </template>
    </Carousel>
  </div>
</template>
<script>
import { Carousel, Pagination, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";
import axios from "axios";
export default {
  name: "CaroUse",
  components: {
    Carousel,
    Slide,
    Pagination,
  },
  data() {
    return {
      promotion: [],
    };
  },
  mounted() {
    this.getPromotion();
  },
  methods: {
    getPromotion() {
      axios
        .get(`http://localhost:3000/promotion_image`)
        .then((response) => {
          this.promotion = response.data;
        })
        .catch((error) => {
          this.error = error.response.data.message;
        });
    },
  },
};
</script>