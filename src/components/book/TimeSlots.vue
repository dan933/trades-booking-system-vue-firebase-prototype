<template>
  <v-card flat rounded="0" class="book-now-card">
    <h3>Pick a date</h3>
    <VDatePicker
      v-model="selectedDate"
      :disabled-dates="disabledDates"
      @dayclick="onCalendarClick"
    >
      <template #default="{ togglePopover }">
        <div class="date-input">
          <v-btn
            class="text-none text-subtitle-1"
            color="primary"
            variant="elevated"
            @click="togglePopover"
          >
            Choose Date
          </v-btn>
        </div>
      </template>
    </VDatePicker>
    {{ availabilityMessage }}
    <v-container v-if="IsAvailableDate" class="timeslot-container">
      <h3>Pick A Timeslot</h3>
      <v-autocomplete
        v-model="selectedTimeSlot"
        :items="availableTimeSlots"
        :item-title="
          (item) => {
            return item?.time
              ? `${item.time} (available hours ${item.availableHours})`
              : '';
          }
        "
        :item-value="(item) => item"
        label="Select a time slot"
        style="width: 245px"
      ></v-autocomplete>
      <p>
        This time slot currently has
        {{ selectedTimeSlot?.availableHours }} hours available.
      </p>
      <v-btn
        v-if="selectedTimeSlot"
        class="text-none text-subtitle-1"
        color="primary"
        variant="elevated"
        @click="storeSelectedTimeSlotData"
      >
        Select Services
      </v-btn>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: "TimeSlots",
  data: () => ({
    selectedDate: null,
    availabilityMessage: "",
    IsAvailableDate: false,
    selectedTimeSlot: {},
    availableTimeSlots: [
      { time: "15:00", availableHours: 3 },
      { time: "14:00", availableHours: 5 },
      { time: "13:00", availableHours: 2 },
    ],
  }),
  methods: {
    getOrdinalSuffix(day) {
      if (day >= 11 && day <= 13) {
        return "th";
      }
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    },
    onCalendarClick(context) {
      this.selectedTimeSlot = "";
      const clickedDate = new Date(context.date);
      const day = clickedDate.getDate();
      const suffix = this.getOrdinalSuffix(day);
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const month = monthNames[clickedDate.getMonth()];
      const year = clickedDate.getFullYear();

      this.IsAvailableDate = !context.isDisabled;
      if (context.isDisabled) {
        this.availabilityMessage = `No bookings available for ${day}${suffix} ${month} ${year}`;
      } else {
        this.availabilityMessage = `${day}${suffix} ${month} ${year}`;
      }
    },
    storeSelectedTimeSlotData() {
      console.log(this.selectedDate);
      console.log(this.selectedTimeSlot);
      //todo organise data

      let bookingTimeSlotData = {
        date: this.selectedDate,
        timeslot: this.selectedTimeSlot,
      };

      this.$emit("storeSelectedTimeSlotData", bookingTimeSlotData);
    },
    goToSelectServices() {
      //todo check if timeslot is still availbale
      this.getDateTimeslotData();

      //todo emit
    },
  },
  mounted() {},
  computed: {
    disabledDates() {
      // create a new Date object
      let today = new Date();

      // subtract 1 day from today's date
      let yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      let disabledDates = [{ start: null, end: null }];
      disabledDates[0].end = yesterday;

      disabledDates[1] = {
        start: new Date("2023-04-23"),
        end: new Date("2023-04-23"),
      };

      return disabledDates;
    },
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
}
.book-now-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 15px;
  height: 90%;
  width: 100%;
  padding: 10px;
  overflow: auto;
}

.timeslot-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 15px;
}
.window-container {
  width: 100%;
  height: 100%;
}
.vc-day-content.vc-disabled {
  text-decoration: line-through;
  color: rgba(211, 211, 211, 0.721);
}
</style>
