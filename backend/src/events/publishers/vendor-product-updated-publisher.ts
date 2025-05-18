import {
  VendorProudctUpdatedEvent,
  Publisher,
  Subject,
} from "@daynightprint/shared";

class VendorProductUpdatedPublisher extends Publisher<VendorProudctUpdatedEvent> {
  subject: Subject.VendorProudctUpdated = Subject.VendorProudctUpdated;
}
export default VendorProductUpdatedPublisher;
