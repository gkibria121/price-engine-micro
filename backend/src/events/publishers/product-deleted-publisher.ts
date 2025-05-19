import { ProudctDeletedEvent, Publisher, Subject } from "@daynightprint/shared";

class ProductDeletedPublisher extends Publisher<ProudctDeletedEvent> {
  subject: Subject.productDeleted = Subject.productDeleted;
}
export default ProductDeletedPublisher;
