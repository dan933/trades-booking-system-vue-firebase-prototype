<template>
  <v-container>
    <h1>Review Booking</h1>
    <p>
      <strong>Date:</strong>
      {{ bookingDate }}
    </p>
    <p class="time-container">
      <strong>Booking Time:</strong>
      {{ bookingTime }}
    </p>
    <p>
      <strong>Address:</strong>
      {{
        customerInformation?.addressList?.length > 0
          ? customerInformation?.addressList[0]
          : ""
      }}
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
        <tr v-for="item in selectedServicesTable" :key="item.name">
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
        {{ hoursRequired }}
      </p>
      <p>
        <strong>Subtotal:</strong>
        $ {{ `${subtotal.toFixed(2)}` }}
      </p>
      <p>
        <strong>GST:</strong>
        $ {{ `${gst.toFixed(2)}` }}
      </p>
      <p>
        <strong>Total:</strong>
        $ {{ `${total.toFixed(2)}` }}
      </p>
    </div>
    <div class="action-container">
      <v-btn color="primary" @click="confirmBooking">Next</v-btn>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "ReviewBooking",
  props: ["selectedDateTimeSlot", "selectedServices", "customerInformation"],
  data: () => ({
    headers: [
      {
        title: "Service",
        align: "start",
        sortable: true,
        key: "service",
        value: "name",
      },
      {
        title: "Rate",
        align: "start",
        sortable: true,
        key: "rate",
        value: "rate",
      },
      {
        title: "Hours",
        align: "start",
        sortable: true,
        key: "hours",
        value: "hours",
      },
      {
        title: "Subtotal",
        align: "start",
        sortable: true,
        key: "subTotal",
        value: "subtotal",
      },
      //maybe gst later
      //maybe grand total later
    ],
  }),
  methods: {
    confirmBooking() {
      this.$emit("confirmDetails");
    },
  },
  computed: {
    subtotal() {
      let subTotal =
        this.selectedServices.reduce((acc, curr) => {
          return (acc += +curr.selection.rate * +curr.hours);
        }, 0) * 1.1;
      let roundedResult = parseFloat(subTotal.toFixed(2));
      return roundedResult;
    },
    gst() {
      let gst = this.subtotal * 0.1;
      let roundedResult = parseFloat(gst.toFixed(2));
      return roundedResult;
    },
    total() {
      let subTotal = this.subtotal + this.gst;
      let roundedResult = parseFloat(subTotal.toFixed(2));
      return roundedResult;
    },
    hoursRequired() {
      return this.selectedServices.reduce((acc, curr) => {
        return (acc += curr.hours);
      }, 0);
    },
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

      console.log("totalHours", totalHours);

      let startTime = this.selectedDateTimeSlot.date.toLocaleTimeString();
      let endTime = new Date(this.selectedDateTimeSlot?.date);
      endTime.setHours(this.selectedDateTimeSlot.date.getHours() + totalHours);
      endTime = endTime.toLocaleTimeString();

      return `${startTime} - ${endTime}`;
    },
    selectedServicesTable() {
      //Get the selected services calculate subtotal and return the array
      return this.selectedServices.map((item) => {
        return {
          ...item.selection,
          rate: `$ ${item.selection.rate}`,
          hours: item.hours,
          lineTotal: `$ ${+item.selection.rate * +item.hours}`,
        };
      });
    },
  },
};
</script>

<style lang="scss">
.time-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  column-gap: 4px;
}
</style>
