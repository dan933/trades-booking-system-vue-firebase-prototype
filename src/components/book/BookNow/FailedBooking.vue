const FailedBooking = () => Promist.resolve({
<template>
  <v-card class="success-card">
    <h1>Booking Unavailable</h1>
    <p>
      We are sorry but the booking you chose is not available. Please choose
      another timeslot.
    </p>
  </v-card>
</template>

<script>
export default {
  name: "FailedBooking",
  data() {
    return {};
  },
};
</script>

<style lang="scss">
.failed-card {
  padding: 40px;
  row-gap: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  margin: 20px;
  height: 100%;
}
</style>
});
