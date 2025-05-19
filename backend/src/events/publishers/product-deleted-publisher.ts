import { ProudctDeletedEvent, Publisher, Subject } from "@daynightprint/events";

class ProductDeletedPublisher extends Publisher<ProudctDeletedEvent> {
  subject: Subject.productDeleted = Subject.productDeleted;
}
export default ProductDeletedPublisher;
