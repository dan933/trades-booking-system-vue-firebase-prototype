const Book = () => Promise.resolve({
<template>
  <section class="book-section">
    <v-card elevation="3" class="card">
      <v-toolbar color="white" :elevation="7">
        <v-btn
          @click="
            () => {
              navigate('/book/appointments');
            }
          "
          class="menu-button"
          >Appointments</v-btn
        >
        <v-btn
          @click="
            () => {
              navigate('/book/book-now');
            }
          "
          class="menu-button"
          >Book Now</v-btn
        >
      </v-toolbar>
      <router-view class="router"></router-view>
    </v-card>
  </section>
</template>

<script>
export default {
  name: "Book",
  data() {
    return {
      carouselImages: [
        "https://source.unsplash.com/TRCJ-87Yoh0/700x200",
        "https://source.unsplash.com/AQl-J19ocWE/700x200",
      ],
    };
  },
  methods: {
    navigate(route) {
      this.$router.push(route);
    },
  },
  mounted() {},
  computed: {},
};
</script>

<style lang="scss" scoped>
.menu-button {
  width: 50%;
}
.book-section {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 800px;
  width: 90%;
  height: 90%;
  max-height: 700px;
}

.card {
  width: 100%;
  height: 100%;
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.router {
  height: 100%;
  max-height: 700px;
}
</style>

})
