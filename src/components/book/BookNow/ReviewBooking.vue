<template>
  <v-container>
    <p>
      <strong>Date:</strong>
      {{ bookingDate }}
    </p>
    <p>
      <strong>Booking Time:</strong>
      {{ bookingTime }}
    </p>
    <div>{{ selectedServices }}</div>
    {{ selectedDateTimeSlot }}
  </v-container>
</template>

<script>
export default {
  name: "ReviewBooking",
  props: ["selectedDateTimeSlot", "selectedServices", "customerInformation"],
  methods: {
    confirmBooking() {
      return true;
    },
  },
  computed: {
    bookingDate() {
      return `${this.selectedDateTimeSlot?.date
        .getDate()
        .toString()
        .padStart(2, "0")}/${this.selectedDateTimeSlot?.date
        .getMonth()
        .toString()
        .padStart(2, "0")}/${this.selectedDateTimeSlot?.date.getFullYear()}`;
    },
    name() {
      return `${this.customerInformation?.firstName} ${this.customerInformation?.lastName}`;
    },
    bookingTime() {
      let totalHours = this.selectedServices.reduce((acc, curr) => {
        return (acc += curr.hours);
      }, 0);

      let startTime = this.selectedDateTimeSlot.date.toLocaleTimeString();
      let endTime = new Date(this.selectedDateTimeSlot?.date);
      endTime.setHours(this.selectedDateTimeSlot.date.getHours() + totalHours);
      endTime = endTime.toLocaleTimeString();

      return `${startTime} - ${endTime}`;
    },
  },
};
</script>

<style lang="scss"></style>
