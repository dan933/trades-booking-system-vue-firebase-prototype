const Appointments = () => Promise.resolve({
<template>
  <section class="book-section">
    <h1>You currently have no appointments</h1>
  </section>
</template>

<script>
export default {
  name: "Appointments",
  data() {
    return {
      carouselImages: [
        "https://source.unsplash.com/TRCJ-87Yoh0/700x200",
        "https://source.unsplash.com/AQl-J19ocWE/700x200",
      ],
    };
  },
  methods: {},
  mounted() {},
  computed: {},
};
</script>

<style lang="scss" scoped>
.book-section {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 800px;
  width: 90%;
  height: 90%;
}

.card {
  width: 100%;
  height: 100%;
  margin-top: 5px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.carousel-image {
  width: 100%;
  border-radius: 5px;
}

.carousel-container {
  display: flex;
  max-width: 90vw;
  width: 700px;
  min-height: 200px;
}
</style>

})
