import React from "react";

const DeliverySelection = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-lg font-medium mb-4">
        When would you like to receive your item?*
      </h2>

      <p className="text-sm text-gray-600 mb-4">
        To receive express same-day delivery, please continue to fill out the
        form and let us know your preferred delivery time in the comment section
      </p>

      <div className="space-y-3">
        <label className="flex items-center">
          <input type="radio" name="delivery" className="mr-2" />
          <span>Priority service tomorrow</span>
        </label>

        <label className="flex items-center">
          <input type="radio" name="delivery" className="mr-2" defaultChecked />
          <span>
            Super Express Same Day Delivery ( by 6 pm today) *£££ express
            charges may apply
          </span>
        </label>

        <label className="flex items-center">
          <input type="radio" name="delivery" className="mr-2" />
          <span>
            Super Express Night Delivery (by 11:59 pm today) *£££ express
            charges may apply
          </span>
        </label>

        <label className="flex items-center">
          <input type="radio" name="delivery" className="mr-2" />
          <span>
            Express Delivery Tomorrow by 10:30 am *£££ express charges may apply
          </span>
        </label>

        <label className="flex items-center">
          <input type="radio" name="delivery" className="mr-2" />
          <span>
            Express Delivery Tomorrow by 1 pm *£££ express charges may apply
          </span>
        </label>

        <label className="flex items-center">
          <input type="radio" name="delivery" className="mr-2" />
          <span>
            Express Delivery Tomorrow by 6 pm *££ express charges may apply
          </span>
        </label>

        <label className="flex items-center">
          <input type="radio" name="delivery" className="mr-2" />
          <span>Priority Delivery Tomorrow by 11:59 pm</span>
        </label>

        <label className="flex items-center">
          <input type="radio" name="delivery" className="mr-2" />
          <span>Standard 2 Working Days Delivery</span>
        </label>

        <label className="flex items-center">
          <input type="radio" name="delivery" className="mr-2" />
          <span>Standard 3 Working Days Delivery</span>
        </label>

        <label className="flex items-center">
          <input type="radio" name="delivery" className="mr-2" />
          <span>Other</span>
        </label>
      </div>
    </div>
  );
};

export default DeliverySelection;
