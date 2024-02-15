<template>
  <div>
    <NavBar />
    <div class="container is-max-desktop">
      <textarea
        class="hero textarea mt-6 mb-6 has-background-light is-fullheight"
        v-model="content"
      ></textarea>
      <nav
        class="pagination is-centered"
        role="navigation"
        aria-label="pagination"
      >
      <div v-if="this.$route.params.pageId != 1" >
        <a :href="`/WriteBook/${this.$route.params.bookId}/${parseInt(this.$route.params.pageId) - 1}`" class="pagination-previous">Previous</a>
      </div>
      <a ></a>
      <a :href="`/WriteBook/${this.$route.params.bookId}/${parseInt(this.$route.params.pageId) + 1}`" class="pagination-next" @click="getContent">Next page</a>
      </nav>
    </div>
    <div class="level-right mr-3 mt-6">
      <div class="level-item">
        <button class="button is-white" @click="submitPage">บันทึก</button>
      </div>
      <div class="level-item">
        <button class="button is-white">ออกจากหน้าเขียน</button>
      </div>
    </div>
    <br />
  </div>
</template>


<script>
import NavBar from "@/components/NavBar";
import axios from "@/plugins/axios";
export default {
  name: "WriteBook",
  props: ["user1"],
  components: {
    NavBar,
  },
  data() {
    return {
      bookContent: {
        0: { image: "" },
      },
      content: "",
    };
  },
  mounted() {
    this.getContent(this.$route.params.bookId, this.$route.params.pageId);
    console.log(this.$route.params.bookId);
    console.log(this.$route.params.pageId);
  },

  methods: {
    async getContent(id, pageId) {
      await axios
        .get(`http://localhost:3000/getContent/${id}/${pageId}`)
        .then((response) => {
          this.bookContent = response.data;
          this.content = this.bookContent[0].content;
        })
        .catch((error) => {
          this.error = error.response.data.message;
        });
    },
    submitPage() {
      axios
        .post(
          `http://localhost:3000/createPage/${this.$route.params.bookId}/${this.$route.params.pageId}/${this.content}`,
        )
        .then(() => this.$router.push({ name: "WriteBook" }))
        .catch((e) => console.log(e.response.data));
    },

  },
};
</script>
<style lang="">
</style>