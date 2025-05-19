import { VendorCreatedEvent, Publisher, Subject } from "@daynightprint/events";

class VendorCreatedPublisher extends Publisher<VendorCreatedEvent> {
  subject: Subject.vendorCreated = Subject.vendorCreated;
}
export default VendorCreatedPublisher;
