<template>
  <v-card flat class="book-now-container">
    <v-window
      :touch="false"
      direction="vertical"
      v-model="onboarding"
      class="window-container"
    >
      <v-window-item
        :key="`card-customer-details`"
        :value="0"
        class="window-container"
      >
        <CustomerDetails
          @storeCustomerDetails="storeCustomerDetails"
        ></CustomerDetails>
      </v-window-item>

      <v-window-item
        :key="`card-timeslots`"
        :value="1"
        class="window-container"
      >
        <TimeSlots
          @storeSelectedTimeSlotData="storeSelectedTimeSlotData"
        ></TimeSlots>
      </v-window-item>

      <v-window-item
        :key="`card-add-services`"
        :value="2"
        class="window-container"
      >
        <SelectService
          ref="selectServiceRef"
          :selectedDateTimeSlot="selectedDateTimeSlot"
          @storeSelectedServices="storeSelectedServices"
        ></SelectService>
      </v-window-item>
      <v-window-item
        :key="`review-booking`"
        :value="3"
        class="window-container"
      >
        <ReviewBooking
          @confirmDetails="confirmDetails"
          :selectedDateTimeSlot="selectedDateTimeSlot"
          :selectedServices="selectedServices"
          :customerInformation="customerInformation"
          ref="reviewBookingRef"
        ></ReviewBooking>
      </v-window-item>
      <v-window-item :key="`payment`" :value="4" class="window-container">
        <Payment
          :selectedDateTimeSlot="selectedDateTimeSlot"
          :selectedServices="selectedServices"
          :customerInformation="customerInformation"
          ref="paymentRef"
          @storePaymentDetails="storePaymentDetails"
        ></Payment>
      </v-window-item>
    </v-window>

    <v-card-actions class="justify-space-evenly">
      <v-item-group v-model="onboarding" class="text-center" mandatory>
        <v-item
          :key="`customer-details`"
          v-slot="{ isSelected, toggle }"
          :value="0"
        >
          <v-btn
            :variant="isSelected ? 'outlined' : 'text'"
            icon="mdi:mdi-account"
            @click="toggle"
          ></v-btn>
        </v-item>
        <v-item
          v-if="customerInformation"
          :key="`timeslots`"
          v-slot="{ isSelected, toggle }"
          :value="1"
        >
          <v-btn
            :variant="isSelected ? 'outlined' : 'text'"
            icon="mdi:mdi-calendar-clock"
            @click="toggle"
          ></v-btn>
        </v-item>
        <v-item
          v-if="selectedDateTimeSlot"
          :key="`services`"
          v-slot="{ isSelected, toggle }"
          :value="2"
        >
          <v-btn
            :variant="isSelected ? 'outlined' : 'text'"
            icon="mdi:mdi-briefcase-check"
            @click="toggle"
          ></v-btn>
        </v-item>
        <v-item
          v-if="selectedServices?.length > 0 && selectedServices"
          :key="`review`"
          v-slot="{ isSelected, toggle }"
          :value="3"
        >
          <v-btn
            :variant="isSelected ? 'outlined' : 'text'"
            icon="mdi:mdi-message-draw"
            @click="toggle"
          ></v-btn>
        </v-item>
        <v-item
          v-if="customerConfirmation"
          :key="`payment`"
          v-slot="{ isSelected, toggle }"
          :value="4"
        >
          <v-btn
            :variant="isSelected ? 'outlined' : 'text'"
            icon="mdi:mdi-credit-card-outline"
            @click="toggle"
          ></v-btn>
        </v-item>
      </v-item-group>
    </v-card-actions>
  </v-card>
</template>

<script>
import TimeSlots from "./TimeSlots.vue";
import SelectService from "./SelectService.vue";
import CustomerDetails from "./CustomerDetails.vue";
import ReviewBooking from "./ReviewBooking.vue";
import Payment from "./Payment.vue";
import { updateCustomerDetails } from "../../../services/api/customerService.js";
import { createBooking } from "../../../services/api/bookingService";

export default {
  name: "BookNow",
  data: () => ({
    selectedDate: null,
    onboarding: 0,
    selectedDateTimeSlot: null,
    selectedServices: [],
    customerInformation: null,
    customerConfirmation: false,
    paymentDetails: null,
  }),
  methods: {
    async storeCustomerDetails(customerDetails) {
      //are different to this.customerInformation
      if (
        JSON.stringify(this.customerInformation) !==
        JSON.stringify(customerDetails)
      ) {
        const orgId = this.$route.params.id;
        await updateCustomerDetails(customerDetails, orgId);
      }
      this.customerInformation = customerDetails;

      this.onboarding += 1;
    },

    storeSelectedTimeSlotData(bookingTimeSlotData) {
      this.selectedServices = [];
      if (this.$refs.selectServiceRef) {
        this.$refs.selectServiceRef.reset();
      }
      this.selectedDateTimeSlot = bookingTimeSlotData;
      this.onboarding += 1;
    },

    storeSelectedServices(selectedServices) {
      this.selectedServices = JSON.parse(selectedServices);
      this.onboarding += 1;
    },

    confirmDetails() {
      this.customerConfirmation = true;
      this.onboarding += 1;
    },

    storePaymentDetails(paymentDetails) {
      this.paymentDetails = paymentDetails;

      this.submitBooking();
    },

    async submitBooking() {
      const bookingData = {
        customerInformation: this.customerInformation,
        selectedDateTimeSlot: this.selectedDateTimeSlot,
        services: this.selectedServices,
        paymentDetails: this.paymentDetails,
      };

      // //todo later wait for response back from server
      const resp = await createBooking(bookingData, this.$route.params.id);
      console.log("resp", resp);
    },
  },
  mounted() {},
  computed: {},
  components: {
    Payment,
    TimeSlots,
    SelectService,
    CustomerDetails,
    ReviewBooking,
  },
};
</script>

<style lang="scss">
.date-input {
  border-radius: 5px;
  padding: 5px;
}
.book-now-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 90%;
  max-height: 700px;
  margin: 10px;
  margin-top: 20px;
  padding: 5px;
  overflow: auto;
}

.window-container {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.vc-day-content.vc-disabled {
  text-decoration: line-through;
  color: rgba(211, 211, 211, 0.721);
}
</style>
