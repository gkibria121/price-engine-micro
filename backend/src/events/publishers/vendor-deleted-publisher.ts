import { VendorDeletedEvent, Publisher, Subject } from "@daynightprint/shared";

class VendorDeletedPublisher extends Publisher<VendorDeletedEvent> {
  subject: Subject.vendorDeleted = Subject.vendorDeleted;
}
export default VendorDeletedPublisher;
