import { ProudctUpdatedEvent, Publisher, Subject } from "@daynightprint/events";

class ProductUpdatedPublisher extends Publisher<ProudctUpdatedEvent> {
  subject: Subject.productUpdated = Subject.productUpdated;
}
export default ProductUpdatedPublisher;
