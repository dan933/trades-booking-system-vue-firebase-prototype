const SuccessBooking = () => Promise.resolve({
<template>
  <v-card class="success-card">
    <v-container>
      <h1>Booked</h1>
      <p>
        Thank You for Booking with us we have sent you a confirmation email with
        booking details. Todo create a confirmation email template.
      </p>

      <v-table fixed-header max-height="300px">
        <thead>
          <tr>
            <th class="text-left">Service</th>
            <th class="text-left">Rate</th>
            <th class="text-left">Hours</th>
            <th class="text-left">lineTotal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in booking.selectedServices" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.rate }}</td>
            <td>{{ item.hours }}</td>
            <td>{{ item.lineTotal }}</td>
          </tr>
        </tbody>
      </v-table>
      <div class="total-container">
        <p>
          <strong>Hours Required:</strong>
          {{ booking.hoursRequired }}
        </p>
        <p>
          <strong>Subtotal:</strong>
          $ {{ `${booking.subtotal.toFixed(2)}` }}
        </p>
        <p>
          <strong>GST:</strong>
          $ {{ `${booking.gst.toFixed(2)}` }}
        </p>
        <p>
          <strong>Total:</strong>
          $ {{ `${booking.total.toFixed(2)}` }}
        </p>
      </div>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: "SuccessBooking",
  data() {
    return {};
  },
  computed: {
    booking() {
      return this.$store.state.booking;
    },
  },
  methods: {},
  mounted() {
    console.log("booking", this.booking);
  },
};
</script>

<style lang="scss">
.total-container {
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  row-gap: 3px;
}
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
