const SuccessBooking = () => Promise.resolve({
<template>
  <v-card class="success-card">
    <h1>Booking Success</h1>
    <p>
      Thank You for Booking with us we have sent you a confirmation email with
      booking details. Todo create a confirmation email template
    </p>
  </v-card>
</template>

<script>
export default {
  name: "SuccessBooking",
  data() {
    return {};
  },
};
</script>

<style lang="scss">
.success-card {
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
} });
