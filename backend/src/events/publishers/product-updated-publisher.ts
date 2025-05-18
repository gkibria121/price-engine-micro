import { ProudctUpdatedEvent, Publisher, Subject } from "@daynightprint/shared";

class ProductUpdatedPublisher extends Publisher<ProudctUpdatedEvent> {
  subject: Subject.productUpdated = Subject.productUpdated;
}
export default ProductUpdatedPublisher;
