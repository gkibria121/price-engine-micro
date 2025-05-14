import mongoose from "mongoose";
import VendorProductModel from "../models/VendorProductModel";
import { DeliverySlot } from "../type";

export async function getVendorProductListByProductAndDelivery(
  productId: string,
  deliveryMethod: DeliverySlot,
  currentTime: Date | string | number,
  limit: number = 10,
  sortBy: string = "rating",
  sortOrder: "asc" | "desc" = "desc"
) {
  try {
    // Ensure currentTime is a Date object for proper comparison
    const currentTimeDate =
      typeof currentTime === "string" || typeof currentTime === "number"
        ? new Date(currentTime)
        : currentTime;

    // Get current time components for time comparison
    const currentHour = currentTimeDate.getUTCHours();
    const currentMinute = currentTimeDate.getUTCMinutes();

    const pipeline = [
      {
        $match: {
          product: new mongoose.Types.ObjectId(productId),
        },
      },
      {
        $lookup: {
          from: "pricingrules",
          localField: "pricingRules",
          foreignField: "_id",
          as: "pricingRulesData",
        },
      },
      {
        $lookup: {
          from: "pricingrulemetas",
          localField: "pricingRuleMetas",
          foreignField: "_id",
          as: "pricingRuleMetasData",
        },
      },
      {
        $lookup: {
          from: "deliveryslots",
          localField: "deliverySlots",
          foreignField: "_id",
          as: "deliverySlotsData",
        },
      },
      {
        $lookup: {
          from: "quantitypricings",
          localField: "quantityPricings",
          foreignField: "_id",
          as: "quantityPricingsData",
        },
      },
      {
        $lookup: {
          from: "vendors",
          localField: "vendor",
          foreignField: "_id",
          as: "vendorData",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productData",
        },
      },
      {
        $unwind: "$vendorData",
      },
      {
        $unwind: "$productData",
      },
      {
        $addFields: {
          deliverySlotsWithTime: {
            $map: {
              input: "$deliverySlotsData",
              as: "slot",
              in: {
                $mergeObjects: [
                  "$$slot",
                  {
                    cutoffTimeHour: {
                      $toInt: { $substr: ["$$slot.cutoffTime", 0, 2] },
                    },
                    cutoffTimeMinute: {
                      $toInt: { $substr: ["$$slot.cutoffTime", 3, 2] },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $match: {
          deliverySlotsWithTime: {
            $elemMatch: {
              deliveryTimeStartDate: deliveryMethod.deliveryTimeStartDate,
              deliveryTimeEndDate: deliveryMethod.deliveryTimeEndDate,
              deliveryTimeEndTime: deliveryMethod.deliveryTimeEndTime,
              $or: [
                { cutoffTimeHour: { $gt: currentHour } },
                {
                  $and: [
                    { cutoffTimeHour: currentHour },
                    { cutoffTimeMinute: { $gt: currentMinute } },
                  ],
                },
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          vendor: "$vendorData",
          pricingRules: "$pricingRulesData",
          deliverySlots: "$deliverySlotsWithTime",
          pricingRuleMetas: "$pricingRuleMetasData",
          quantityPricings: "$quantityPricingsData",
          product: "$productData",
          stockQuantity: 1,
          rating: 1,
          price: 1,
        },
      },
    ];

    // Build dynamic sort object

    // Apply sorting and limit
    const vendors = await VendorProductModel.aggregate([
      ...pipeline,
      {
        $sort: {
          rating: sortOrder === "asc" ? 1 : -1,
        },
      },
      {
        $limit: limit,
      },
    ]);

    return vendors;
  } catch (error) {
    console.error("Error fetching vendor list:", error);
    return [];
  }
}
