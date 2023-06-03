<template>
  <v-container class="border payment-page-container">
    <div class="payment-summary-container">
      <h1>Payment</h1>
      <p><strong>Amount Payable:</strong> ${{ amountPayable }}</p>
      <p><strong>Number of Hours:</strong> {{ hoursBooked }}</p>
    </div>

    <StripeElements
      v-show="stripeLoaded && !loading"
      v-slot="{ elements, instance }"
      ref="elms"
      :stripe-key="stripeKey"
      :instance-options="instanceOptions"
      :elements-options="elementsOptions"
    >
      <StripeElement ref="card" :elements="elements" :options="cardOptions" />
    </StripeElements>
    <p v-show="!loading" class="mt-3 text-red">{{ errorMessage }}</p>
    <v-btn
      v-show="stripeLoaded && !loading"
      color="primary"
      elevation="3"
      class="mt-4"
      width="150px"
      type="button"
      @click="submitForm"
      >Pay Now</v-btn
    >

    <v-container
      v-if="loading"
      class="d-flex justify-center align-center"
      style="height: 100%"
    >
      <v-progress-circular
        :width="10"
        :size="80"
        indeterminate
        color="blue"
      ></v-progress-circular>
    </v-container>
  </v-container>
</template>

<script>
import { StripeElements, StripeElement } from "vue-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { defineComponent, ref, onBeforeMount } from "vue";

export default defineComponent({
  name: "Payment",
  props: ["selectedDateTimeSlot", "selectedServices", "customerInformation"],
  components: {
    StripeElements,
    StripeElement,
  },
  computed: {
    amountPayable() {
      // First, calculate the subtotal in cents
      let subtotal = this.selectedServices.reduce((acc, curr) => {
        let serviceAmount = Math.round(curr.selection.rate * curr.hours * 100);
        return (acc += serviceAmount);
      }, 0);

      // Calculate GST in cents
      let gst = Math.round(subtotal * 0.1);

      // Calculate the total payable amount in cents
      let totalPayable = subtotal + gst;

      // Convert total payable amount back to dollars for the return value
      return totalPayable / 100;
    },
    hoursBooked() {
      return this.selectedServices.reduce((acc, curr) => {
        return (acc += curr.hours);
      }, 0);
    },
  },
  setup(props, { emit }) {
    const stripeKey = ref(import.meta.env.VITE_APP_STRIPE_TEST_PUBLISHABLE_KEY); // test key
    const instanceOptions = ref({
      // https://stripe.com/docs/js/initializing#init_stripe_js-options
    });
    const elementsOptions = ref({
      // https://stripe.com/docs/js/elements_object/create#stripe_elements-options
    });
    const cardOptions = ref({
      hidePostalCode: true,
      // https://stripe.com/docs/stripe.js#element-options
    });
    const stripeLoaded = ref(false);
    const card = ref();
    const elms = ref();
    let loading = ref(false);
    let errorMessage = ref("");

    onBeforeMount(() => {
      const stripePromise = loadStripe(stripeKey.value);
      stripePromise.then(() => {
        stripeLoaded.value = true;
      });
    });

    const toggleLoading = (loadingValue) => {
      console.log("run toggle loading");
      loading.value = loadingValue;
    };

    const updateErrorMessage = (message) => {
      errorMessage.value = message;
    };

    const submitForm = async () => {
      // Get stripe element
      const cardElement = card.value.stripeElement;

      loading.value = true;

      // Access instance methods, e.g. createToken()
      let stripeResponse = await elms.value.instance.createToken(cardElement);

      if (stripeResponse?.token) {
        emit("submitBooking", stripeResponse);
      } else {
        loading.value = false;
        console.log("stripeResponse", stripeResponse?.error?.message);
        errorMessage.value = stripeResponse?.error?.message;

        console.log("errorMessage", errorMessage);
      }
    };

    return {
      loading,
      errorMessage,
      stripeKey,
      stripeLoaded,
      instanceOptions,
      elementsOptions,
      cardOptions,
      card,
      elms,
      submitForm,
      toggleLoading,
      updateErrorMessage,
    };
  },
});
</script>

<style lang="scss">
/* Stripe Elements Styles */
.stripe-container {
  margin-left: auto;
  margin-right: auto;
  width: 90%;
}
.StripeElement {
  box-sizing: border-box;
  height: 40px;
  padding: 10px 12px;
  border: 1px solid transparent;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0 1px 3px 0 #e6ebf1;
  -webkit-transition: box-shadow 150ms ease;
  transition: box-shadow 150ms ease;
}

.StripeElement--focus {
  box-shadow: 0 1px 3px 0 #cfd7df;
}

.StripeElement--invalid {
  border-color: #fa755a;
}

.StripeElement--webkit-autofill {
  background-color: #fefde5 !important;
}
.payment-page-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.payment-summary-container {
  padding: 5px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  row-gap: 5px;
  margin-bottom: 6px;
}
.expiry-container {
  display: flex;
  flex-direction: row;
  column-gap: 5px;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
