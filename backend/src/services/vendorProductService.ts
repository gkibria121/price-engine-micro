import mongoose from "mongoose";
import VendorProductModel from "../models/VendorProductModel";
import { DeliverySlot } from "../type";

export async function getVendorsByProductAndDelivery(
  productId: string,
  deliveryMethod: DeliverySlot,
  limit: number = 10
) {
  try {
    const pipeline = [
      {
        $match: {
          product: new mongoose.Types.ObjectId(productId),
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
              cutoffTime: deliveryMethod.cutoffTime,
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          vendor: 1,
          rating: 1,
        },
      },
    ];

    // Apply sorting and limit
    const vendorProducts = await VendorProductModel.aggregate([
      ...pipeline,
      {
        $sort: {
          rating: -1,
        },
      },
      {
        $limit: limit,
      },
    ]);
    const vendorIds = vendorProducts.map((vp) => vp.vendor);
    return vendorIds;
  } catch (error) {
    console.error("Error fetching vendor list:", error);
    return [];
  }
}
