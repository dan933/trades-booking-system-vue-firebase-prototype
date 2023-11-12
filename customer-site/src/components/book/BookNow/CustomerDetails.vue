<template>
  <v-card flat rounded="0" class="service-card">
    <h3>Your Details</h3>
    <v-container style="height: 100%">
      <v-form
        v-model="valid"
        @submit.prevent="storeCustomerDetails"
        ref="customerDetailsFormRef"
        v-if="!loading"
      >
        <v-container class="detail-container">
          <v-text-field
            style="width: 150px"
            v-model="firstName"
            label="First name"
            :rules="[(v) => !!v || 'First name is required']"
          ></v-text-field>
          <v-text-field
            style="width: 150px"
            v-model="lastName"
            label="Last name"
            :rules="[(v) => !!v || 'Last name is required']"
          ></v-text-field>
        </v-container>
        <v-text-field
          v-model="phoneNumber"
          label="Phone number"
          type="tel"
          :rules="[(v) => !!v || 'Phone number is required']"
        ></v-text-field>
        <v-text-field
          v-if="IsGuest"
          v-model="email"
          label="Email"
          type="email"
          :rules="emailRules"
        ></v-text-field>
        <!-- new address format -->
        <!-- seperate inputs for street address, suburb, state and postcode -->
        <v-container fluid style="padding: 0px">
          <v-textarea
            name="input-2-1"
            rows="1"
            variant="filled"
            :model-value="address"
            label="Street Address"
            autocomplete="street-address"
            :rules="[(v) => !!v || 'Street Address is required']"
            auto-grow
          ></v-textarea>
        </v-container>
        <v-container class="detail-container">
          <v-text-field
            style="width: 150px"
            label="Suburb"
            type="suburb"
            :rules="[(v) => !!v || 'Suburb is required']"
          ></v-text-field>
          <v-autocomplete
            style="width: 200px; height: 50px"
            label="State"
            autocomplete="country-name"
            :items="['VIC', 'NSW', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']"
          ></v-autocomplete>
        </v-container>
        <v-text-field
          style="width: 150px; margin-top: 20px"
          label="Postcode"
          autocomplete="postal-code"
          :rules="[(v) => !!v || 'Postcode is required']"
        ></v-text-field>
        <!-- <v-textarea
          v-model="address"
          label="Address"
          :rules="[(v) => !!v || 'Address is required']"
        ></v-textarea> -->
        <v-btn color="primary mt-4" type="submit">Next</v-btn>
      </v-form>
      <v-container
        v-else
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
  </v-card>
</template>

<script>
import { getCustomerDetails } from "../../../services/api/customerService.js";
import { getAuth } from "firebase/auth";
export default {
  name: "CustomerDetails",
  data() {
    return {
      loading: false,
      valid: true,
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      email: "",
      emailRules: [
        (v) => !!v || "Email is required",
        (v) =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || "Email must be valid",
      ],
    };
  },
  props: ["selectedDateTimeSlot"],
  watch: {
    firstName() {
      this.validateForm();
    },
    lastName() {
      this.validateForm();
    },
    phoneNumber() {
      this.validateForm();
    },
    address() {
      this.validateForm();
    },
  },
  methods: {
    validateForm() {
      this.$nextTick(() => {
        this.valid = !!this.$refs.customerDetailsFormRef.validate();
      });
    },
    //function to control loading
    toggleLoading(Isloading) {
      this.loading = Isloading;
    },
    storeCustomerDetails() {
      // Store the customers details
      if (this.valid) {
        let customerDetails = {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email || this.currentUser?.email,
          phoneNumber: this.phoneNumber,
          addressList: [this.address],
        };

        console.log("line 120", customerDetails);
        this.$emit("storeCustomerDetails", customerDetails);
      }
    },
    async getCustomer() {
      if (this.IsGuest) return null;

      return await getCustomerDetails(this.orgId);
    },
    async init() {
      //check if the customers details are in the database

      this.loading = true;

      let customer = await this.getCustomer();

      console.log(customer, "customer details");

      //if the details exist populate the form
      if (customer) {
        this.firstName = customer?.firstName || "";
        this.lastName = customer?.lastName || "";
        this.phoneNumber = customer?.phoneNumber || "";
        this.address =
          customer?.addressList?.length > 0 ? customer.addressList[0] : "";

        this.valid = this.validateForm();
      }

      this.loading = false;
    },
  },
  computed: {
    orgId() {
      return this.$route.params.id;
    },
    IsGuest() {
      return this.$store.state.IsGuest;
    },
    currentUser() {
      let user = getAuth().currentUser;
      console.log(user, "user");
      return user;
    },
  },
  async mounted() {
    await this.init();
  },
};
</script>

<style lang="scss">
.detail-container {
  display: flex;
  flex-wrap: wrap;
  column-gap: 3px;
  padding: 0px;
  margin: 0px;
}
.service-card {
  overflow: auto;
  height: 100%;
  max-height: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.service-form-container {
  overflow: auto;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 5px;
  overflow: auto;
}
.border {
  border: black solid 2px !important;
  border-radius: 5px;
}
.service-item-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  column-gap: 10px;
  row-gap: 30px;
  margin-bottom: 10px;
}
</style>
