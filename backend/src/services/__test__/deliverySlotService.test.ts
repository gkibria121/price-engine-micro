// __tests__/deliverySlots.test.ts
import { filterDeliverySlots } from "../deliverySlotService";
import { DeliverySlot } from "../../type";

// Import the sort function for direct testing.
import { sortByDeliveryEndTimeProximity } from "../deliverySlotService";
import { combineArrayProcessors } from "@daynightprint/shared";

describe("Delivery Slot Functions", () => {
  // Use a fixed date for tests.
  // Note: Choose a fixed date, here we pick May 15, 2025, at 12:00:00.
  const fixedNow = new Date("2025-05-15T12:00:00");
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(fixedNow);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("sortByDeliveryEndTimeProximity", () => {
    it("sorts slots by the proximity of their delivery end time relative to now", () => {
      // For testing sort, we use deliveryTimeEndDate values as offsets in days.
      // Use offset 0 to mean "today" so we can control the deliveryTimeEndTime.
      const slots: DeliverySlot[] = [
        {
          label: "Slot A",
          price: 10,
          deliveryTimeStartDate: 0,
          deliveryTimeStartTime: "10:00",
          deliveryTimeEndDate: 0, // same day
          deliveryTimeEndTime: "14:00", // ends in 2 hours from fixedNow (12:00 => 14:00)
          cutoffTime: "11:00", // cutoff - not used in sort
        },
        {
          label: "Slot B",
          price: 12,
          deliveryTimeStartDate: 0,
          deliveryTimeStartTime: "11:00",
          deliveryTimeEndDate: 0, // same day
          deliveryTimeEndTime: "13:00", // ends in 1 hour from fixedNow
          cutoffTime: "12:30",
        },
      ];

      const sorted = sortByDeliveryEndTimeProximity(slots);

      // Expect "Slot B" (ends at 13:00) to come before "Slot A" (ends at 14:00).
      expect(sorted[0].label).toBe("Slot B");
      expect(sorted[1].label).toBe("Slot A");
    });

    it("handles slots for a future date correctly", () => {
      // Here, we simulate slots that end on the next day.
      const slots: DeliverySlot[] = [
        {
          label: "Tomorrow Late",
          price: 15,
          deliveryTimeStartDate: 0,
          deliveryTimeStartTime: "18:00",
          deliveryTimeEndDate: 1, // tomorrow
          deliveryTimeEndTime: "16:00", // 4 PM tomorrow
          cutoffTime: "15:00",
        },
        {
          label: "Tomorrow Early",
          price: 15,
          deliveryTimeStartDate: 0,
          deliveryTimeStartTime: "18:00",
          deliveryTimeEndDate: 1, // tomorrow
          deliveryTimeEndTime: "10:00", // 10 AM tomorrow
          cutoffTime: "09:30",
        },
      ];

      const sorted = sortByDeliveryEndTimeProximity(slots);

      // Expect "Tomorrow Early" to have a smaller time difference from fixedNow than "Tomorrow Late"
      expect(sorted[0].label).toBe("Tomorrow Early");
      expect(sorted[1].label).toBe("Tomorrow Late");
    });
  });

  describe("filterDeliverySlots", () => {
    it("filters out slots where the cutoff time has already passed", () => {
      const slots: DeliverySlot[] = [
        {
          label: "Morning",
          price: 5,
          deliveryTimeStartDate: 0,
          deliveryTimeStartTime: "08:00",
          deliveryTimeEndDate: 0,
          deliveryTimeEndTime: "10:00",
          cutoffTime: "11:00", // cutoff at 11:00, which is before fixedNow 12:00
        },
        {
          label: "Afternoon",
          price: 6,
          deliveryTimeStartDate: 0,
          deliveryTimeStartTime: "12:00",
          deliveryTimeEndDate: 0,
          deliveryTimeEndTime: "14:00",
          cutoffTime: "13:00", // cutoff at 13:00, valid
        },
      ];

      const filtered = filterDeliverySlots(fixedNow, slots);

      // Only the "Afternoon" slot should remain.
      expect(filtered.length).toBe(1);
      expect(filtered[0].label).toBe("Afternoon");
    });

    it("removes duplicate labels", () => {
      const slots: DeliverySlot[] = [
        {
          label: "Evening",
          price: 7,
          deliveryTimeStartDate: 0,
          deliveryTimeStartTime: "17:00",
          deliveryTimeEndDate: 0,
          deliveryTimeEndTime: "19:00",
          cutoffTime: "16:00", // valid cutoff (fixedNow is 12:00)
        },
        {
          label: "Evening", // duplicate label
          price: 8,
          deliveryTimeStartDate: 0,
          deliveryTimeStartTime: "17:00",
          deliveryTimeEndDate: 0,
          deliveryTimeEndTime: "19:00",
          cutoffTime: "16:00",
        },
        {
          label: "Night",
          price: 9,
          deliveryTimeStartDate: 0,
          deliveryTimeStartTime: "20:00",
          deliveryTimeEndDate: 0,
          deliveryTimeEndTime: "22:00",
          cutoffTime: "19:00",
        },
      ];

      const filtered = filterDeliverySlots(fixedNow, slots);

      // Duplicates based on label removed. We expect only one "Evening" and one "Night".
      const labels = filtered.map((slot) => slot.label);
      expect(labels).toEqual(expect.arrayContaining(["Evening", "Night"]));
      expect(labels.length).toBe(2);
    });

    it("sorts the remaining slots by delivery end time proximity", () => {
      // Create slots with valid cutoff times.
      const slots: DeliverySlot[] = [
        {
          label: "Slot 1",
          price: 10,
          deliveryTimeStartDate: 0,
          deliveryTimeStartTime: "09:00",
          deliveryTimeEndDate: 0,
          deliveryTimeEndTime: "15:00", // ends 3h after fixedNow (at 15:00)
          cutoffTime: "12:30", // valid
        },
        {
          label: "Slot 2",
          price: 11,
          deliveryTimeStartDate: 0,
          deliveryTimeStartTime: "10:00",
          deliveryTimeEndDate: 0,
          deliveryTimeEndTime: "13:00", // ends 1h after fixedNow (at 13:00)
          cutoffTime: "12:30", // valid
        },
        {
          label: "Slot 3",
          price: 12,
          deliveryTimeStartDate: 0,
          deliveryTimeStartTime: "11:00",
          deliveryTimeEndDate: 0,
          deliveryTimeEndTime: "17:00", // ends 5h after fixedNow (at 17:00)
          cutoffTime: "12:30", // valid
        },
      ];
      const processedDeliverySlots = combineArrayProcessors<DeliverySlot>(
        filterDeliverySlots.bind(null, fixedNow),
        sortByDeliveryEndTimeProximity
      );

      const filtered = processedDeliverySlots(slots);

      // According to our sort function, the slot ending sooner should come first.
      // The expected order is: Slot 2 (13:00), Slot 1 (15:00), Slot 3 (17:00).
      expect(filtered[0].label).toBe("Slot 2");
      expect(filtered[1].label).toBe("Slot 1");
      expect(filtered[2].label).toBe("Slot 3");
    });
  });
});
