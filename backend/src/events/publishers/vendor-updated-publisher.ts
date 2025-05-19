import { VendorUpdatedEvent, Publisher, Subject } from "@daynightprint/shared";

class VendorUpdatedPublisher extends Publisher<VendorUpdatedEvent> {
  subject: Subject.vendorUpdated = Subject.vendorUpdated;
}
export default VendorUpdatedPublisher;
