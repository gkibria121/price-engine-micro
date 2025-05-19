import { VendorCreatedEvent, Publisher, Subject } from "@daynightprint/shared";

class VendorCreatedPublisher extends Publisher<VendorCreatedEvent> {
  subject: Subject.vendorCreated = Subject.vendorCreated;
}
export default VendorCreatedPublisher;
