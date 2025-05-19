import {
  VendorProudctDeletedEvent,
  Publisher,
  Subject,
} from "@daynightprint/events";

class VendorProductDeletedPublisher extends Publisher<VendorProudctDeletedEvent> {
  subject: Subject.VendorProudctDeleted = Subject.VendorProudctDeleted;
}
export default VendorProductDeletedPublisher;
