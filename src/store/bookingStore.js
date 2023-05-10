import { createStore } from "vuex";

export default createStore({
  state: {
    booking: {
      bookingDate: "",
      timeRange: "",
      address: "",
      selectedServices: [],
      hoursRequired: 0,
      subtotal: 0,
      gst: 0,
      total: 0,
    },
  },
  mutations: {
    updateBooking(state, payload) {
      state.booking.bookingDate = payload.bookingDate;
      state.booking.timeRange = payload.time;
      state.booking.address = payload.address;
      state.booking.selectedServices = payload.selectedServices;
      state.booking.hoursRequired = payload.hoursRequired;
      state.booking.subtotal = payload.subtotal;
      state.booking.gst = payload.gst;
      state.booking.total = payload.total;
    },
  },
  actions: {
    // Your action functions here
  },
  getters: {
    // Your getter functions here
  },
});
