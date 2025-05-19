import {
  VendorProudctCreatedEvent,
  Publisher,
  Subject,
} from "@daynightprint/events";

class VendorProductCreatedPublisher extends Publisher<VendorProudctCreatedEvent> {
  subject: Subject.VendorProudctCreated = Subject.VendorProudctCreated;
}
export default VendorProductCreatedPublisher;
