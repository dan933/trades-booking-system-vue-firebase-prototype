<template>
  <v-card flat class="book-now-container">
    <v-window
      direction="vertical"
      v-model="onboarding"
      class="window-container"
    >
      <v-window-item
        :key="`card-timeslots`"
        :value="0"
        class="window-container"
      >
        <TimeSlots
          @storeSelectedTimeSlotData="storeSelectedTimeSlotData"
        ></TimeSlots>
      </v-window-item>
      <v-window-item
        :key="`card-add-services`"
        :value="1"
        class="window-container"
      >
        <SelectService
          :selectedDateTimeSlot="selectedDateTimeSlot"
        ></SelectService>
      </v-window-item>
    </v-window>

    <v-card-actions class="justify-space-evenly">
      <v-item-group v-model="onboarding" class="text-center" mandatory>
        <v-item
          :key="`btn-timeslots`"
          v-slot="{ isSelected, toggle }"
          :value="0"
        >
          <v-btn
            :variant="isSelected ? 'outlined' : 'text'"
            icon="mdi:mdi-record"
            @click="toggle"
          ></v-btn>
        </v-item>
        <v-item
          v-if="selectedDateTimeSlot"
          :key="`btn-services`"
          v-slot="{ isSelected, toggle }"
          :value="1"
        >
          <v-btn
            :variant="isSelected ? 'outlined' : 'text'"
            icon="mdi:mdi-record"
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
export default {
  name: "BookNow",
  data: () => ({
    selectedDate: null,
    onboarding: 0,
    selectedDateTimeSlot: null,
  }),
  methods: {
    storeSelectedTimeSlotData(bookingTimeSlotData) {
      console.log(bookingTimeSlotData, "line 66");
      this.selectedDateTimeSlot = bookingTimeSlotData;
      this.onboarding += 1;
    },
  },
  mounted() {},
  computed: {},
  components: { TimeSlots, SelectService },
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
