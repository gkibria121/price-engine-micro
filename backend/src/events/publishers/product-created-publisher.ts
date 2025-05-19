import { ProudctCreatedEvent, Publisher, Subject } from "@daynightprint/events";

class ProductCreatedPublisher extends Publisher<ProudctCreatedEvent> {
  subject: Subject.productCreated = Subject.productCreated;
}
export default ProductCreatedPublisher;
