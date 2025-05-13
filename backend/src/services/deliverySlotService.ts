import DeliveryRule from "../lib/product/DeliveryRule";
import { DeliverySlot } from "../type";

// Convert "HH:MM" to minutes
function toMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

// Sort delivery slots by total delivery duration
function sortByDeliveryDuration(slots: DeliverySlot[]): DeliverySlot[] {
  return slots.sort((a, b) => {
    const aStart =
      a.deliveryTimeStartDate * 24 * 60 + toMinutes(a.deliveryTimeStartTime);
    const aEnd =
      a.deliveryTimeEndDate * 24 * 60 + toMinutes(a.deliveryTimeEndTime);
    const bStart =
      b.deliveryTimeStartDate * 24 * 60 + toMinutes(b.deliveryTimeStartTime);
    const bEnd =
      b.deliveryTimeEndDate * 24 * 60 + toMinutes(b.deliveryTimeEndTime);

    const aDuration = aEnd - aStart;
    const bDuration = bEnd - bStart;

    return aDuration - bDuration;
  });
}

export function filterDeliverySlots(
  deliverySlots: DeliverySlot[]
): DeliverySlot[] {
  const uniqueSlots = deliverySlots.reduce((acc, curr) => {
    const exists = acc.find((el) => el.label === curr.label);
    return exists ? acc : [...acc, curr];
  }, [] as DeliverySlot[]);

  return sortByDeliveryDuration(uniqueSlots);
}
