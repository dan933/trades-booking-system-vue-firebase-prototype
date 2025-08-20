const FailedBooking = () => Promist.resolve({
<template>
  <v-container class="d-flex justify-center align-center">
    <v-card class="failed-card">
      <h1>Booking Unavailable</h1>
      <p>
        We are sorry but the booking you chose has been booked by another
        customer. Please choose another timeslot.
      </p>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "FailedBooking",
  data() {
    return {};
  },
};
</script>

<style>
.failed-card {
  padding: 40px;
  row-gap: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 20px;
  height: 90%;
}
</style>
});
