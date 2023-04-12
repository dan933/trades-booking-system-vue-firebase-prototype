<template>
  <v-card flat rounded="0" class="book-now-card">
    <h3>Add Services</h3>
    <div>
      <p>
        <strong>Date:</strong>
        {{
          `${selectedDateTimeSlot?.date
            .getDate()
            .toString()
            .padStart(2, "0")}/${selectedDateTimeSlot?.date
            .getMonth()
            .toString()
            .padStart(2, "0")}/${selectedDateTimeSlot?.date.getFullYear()}`
        }}
      </p>
      <p>
        <strong>Time:</strong>
        {{ `${selectedDateTimeSlot.timeslot.time}` }}
      </p>
      <p>
        <strong>Remaining Hours Available:</strong>
        {{ remainingHoursAvailable }}
      </p>
    </div>
    <v-container>
      <v-form
        @submit.prevent="storeSelectedServices()"
        class="d-flex flex-column"
        v-model="serviceForm"
      >
        <!-- add v-for that adds input field -->
        <v-container
          v-for="(service, index) in selectedServices"
          class="mb-3 border"
        >
          <div class="service-item-container">
            <v-autocomplete
              v-model="service.selection"
              style="width: 200px; height: 50px"
              label="Service"
              :items="services"
              :item-title="
                (item) => {
                  return item?.name ? `${item.name}` : '';
                }
              "
              :item-value="(item) => item"
              :rules="[(v) => !!v || 'service required']"
            ></v-autocomplete>
            <v-text-field
              v-model="service.hours"
              style="width: 130px"
              type="number"
              label="Hours"
              hide-details="auto"
              :rules="[
                (v) =>
                  remainingHoursAvailable >= 0 || 'Hours Available Exceeded',
                (v) => !!v || 'Hours Required',
              ]"
            ></v-text-field>
          </div>
          <div class="d-flex align-center mt-6 flex-wrap">
            <p class="mr-5">
              Price: ${{
                service?.selection?.rate && +service?.hours
                  ? service.selection.rate * +service?.hours
                  : 0
              }}
            </p>
            <v-btn color="warning" @click="() => removeServiceItem(index)"
              >Remove</v-btn
            >
          </div>
        </v-container>
        <v-btn class="mt-5" @click="addInput">Add Service</v-btn>
        <v-btn
          v-if="atLeastOneValidService"
          elevation="4"
          color="primary"
          class="mt-5"
          type="submit"
          >Enter Details</v-btn
        >
      </v-form>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: "selectServices",
  data: () => ({
    serviceForm: false,
    services: [
      { name: "Cleaning", rate: 25 },
      { name: "Roofing", rate: 50 },
      { name: "Gardening", rate: 33 },
    ],
    selectedServices: [],
  }),
  props: ["selectedDateTimeSlot"],
  methods: {
    addInput() {
      this.selectedServices.push({});
    },
    storeSelectedServices() {
      if (this.serviceForm) {
        this.$emit("storeSelectedServices", this.selectedServices);
      }
    },
    removeServiceItem(index) {
      console.log("index", index);
      this.selectedServices.splice(index, 1);
      console.log(this.selectedServices);
    },
  },
  mounted() {},
  computed: {
    remainingHoursAvailable() {
      let remainingHoursAvailable =
        this.selectedDateTimeSlot.timeslot.availableHours;

      let totalHoursSelected = this.selectedServices.reduce((prev, curr) => {
        if (+curr.hours) {
          return prev + +curr.hours;
        } else {
          return prev;
        }
      }, 0);

      remainingHoursAvailable = remainingHoursAvailable - totalHoursSelected;

      return remainingHoursAvailable;
    },
    atLeastOneValidService() {
      //if selected service has at least one valid service
      //show review button
      if (
        this.selectedServices?.length > 0 &&
        this.selectedServices[0]?.selection?.name &&
        +this.selectedServices[0]?.hours > 0
      ) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style lang="scss">
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
