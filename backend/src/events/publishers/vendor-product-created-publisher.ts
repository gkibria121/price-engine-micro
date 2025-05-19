import {
  VendorProudctCreatedEvent,
  Publisher,
  Subject,
} from "@daynightprint/shared";

class VendorProductCreatedPublisher extends Publisher<VendorProudctCreatedEvent> {
  subject: Subject.VendorProudctCreated = Subject.VendorProudctCreated;
}
export default VendorProductCreatedPublisher;
