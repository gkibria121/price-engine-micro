import pytest 
from unittest.mock import AsyncMock, MagicMock
from app.events.product_deleted_listener import ProductDeletedListener

@pytest.mark.asyncio
async def test_product_deleted_listener_deletes_vendor_product():
    # Mock message data (simulate JSON string from NATS)
    product_id = "663d8991f31e8f38a8eacb99"
    mock_msg_data = {
        "id": product_id
    }

    # Create a mock message with ack() and term() methods
    mock_msg = MagicMock()
    mock_msg.data = str.encode(str(mock_msg_data).replace("'", '"'))  # Simulate .data as bytes
    mock_msg.ack = AsyncMock()
    mock_msg.term = AsyncMock()

    # Create a mock vendor product
    mock_vendor_product = MagicMock()

    # Mock engine with find and delete methods
    mock_engine = MagicMock()
    mock_engine.find = AsyncMock(return_value=[mock_vendor_product])
    mock_engine.delete = AsyncMock()

    # Create the listener instance
    js = MagicMock()  # Mock JetStream (not used directly here)
    listener = ProductDeletedListener(js=js, engine=mock_engine)

    # Act
    await listener.on_message(mock_msg, mock_msg_data)

    # Assert
    from app.models import VendorProduct

    mock_engine.find.assert_awaited_once_with(
        VendorProduct, {"product.id": product_id}
    )

    mock_engine.delete.assert_awaited_once_with(mock_vendor_product)
    mock_msg.ack.assert_awaited_once()
    mock_msg.term.assert_not_called()
