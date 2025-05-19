import { VendorUpdatedEvent, Publisher, Subject } from "@daynightprint/events";

class VendorUpdatedPublisher extends Publisher<VendorUpdatedEvent> {
  subject: Subject.vendorUpdated = Subject.vendorUpdated;
}
export default VendorUpdatedPublisher;
