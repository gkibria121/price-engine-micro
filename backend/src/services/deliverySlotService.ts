import { DeliverySlot } from "../type";

// Sort delivery slots by how soon the deliveryEndTime is from now
function sortByDeliveryEndTimeProximity(slots: DeliverySlot[]): DeliverySlot[] {
  const now = new Date();
  const nowTotalMinutes = now.getTime();

  return slots.sort((a, b) => {
    const aEnd = new Date(now);
    aEnd.setDate(now.getDate() + a.deliveryTimeEndDate);
    const [aEndH, aEndM] = a.deliveryTimeEndTime.split(":").map(Number);
    aEnd.setHours(aEndH, aEndM, 0, 0);

    const bEnd = new Date(now);
    bEnd.setDate(now.getDate() + b.deliveryTimeEndDate);
    const [bEndH, bEndM] = b.deliveryTimeEndTime.split(":").map(Number);
    bEnd.setHours(bEndH, bEndM, 0, 0);

    const aDiff = aEnd.getTime() - nowTotalMinutes;
    const bDiff = bEnd.getTime() - nowTotalMinutes;

    return aDiff - bDiff;
  });
}

export function filterDeliverySlots(
  deliverySlots: DeliverySlot[]
): DeliverySlot[] {
  const now = new Date();

  // Step 1: Filter out slots with passed cutoff time
  const validSlots = deliverySlots.filter((slot) => {
    const [hours, minutes] = slot.cutoffTime.split(":").map(Number);
    const cutoffTime = new Date(now);
    cutoffTime.setHours(hours, minutes, 0, 0);
    return cutoffTime > now;
  });

  // Step 2: Remove duplicates based on label
  const uniqueSlots = validSlots.reduce((acc, curr) => {
    const exists = acc.find((el) => el.label === curr.label);
    return exists ? acc : [...acc, curr];
  }, [] as DeliverySlot[]);

  // Step 3: Sort by delivery duration
  return sortByDeliveryEndTimeProximity(uniqueSlots);
}
