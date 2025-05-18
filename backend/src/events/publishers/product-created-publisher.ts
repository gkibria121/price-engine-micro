import { ProudctCreatedEvent, Publisher, Subject } from "@daynightprint/shared";

class ProductCreatedPublisher extends Publisher<ProudctCreatedEvent> {
  subject: Subject.productCreated = Subject.productCreated;
}
export default ProductCreatedPublisher;
