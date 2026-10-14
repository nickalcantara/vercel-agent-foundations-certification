// Place your return workflow here!

import { fetch } from "workflow";
import {
  createReturn,
  getOrder,
  notifyReturnInProcess,
  preauthorizeRefund,
} from "../api";
import { Order, Return } from "../types";

export async function returnFlow(orderId: string, reason: string) {
  "use workflow";
  globalThis.fetch = fetch;

  // runs once; cached
  const order = await getOrderStep(orderId);
  await notifyReturnInProcessStep(orderId);
  // runs once; pre-auth happens a single time
  await preauthorizeRefund(orderId);
  // filing fails 2x, then succeeds - the earlier steps don't repeat
  const filed = await createReturnStep(order, reason);

  return { orderId, returnId: filed.id };
}

async function getOrderStep(orderId: string): Promise<Order> {
  "use step";
  return getOrder(orderId);
}

async function notifyReturnInProcessStep(orderId: string): Promise<void> {
  "use step";
  await notifyReturnInProcess(orderId);
}

async function createReturnStep(order: Order, reason: string): Promise<Return> {
  "use step";

  return createReturn({
    reason,
    orderId: order.id,
    items: order.items.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
    })),
  });
}

/**
 * Break apart into discrete "use step" functions instead:
 */
// async function fileReturn(orderId: string, reason: string) {
//   "use step";

//   const order = await getOrder(orderId);

//   // runs 3 times - see console logs
//   await notifyReturnInProcess(orderId);
//   await preauthorizeRefund(orderId);

//   const filed = await createReturn({
//     reason,
//     orderId: order.id,
//     items: order.items.map(({ productId, quantity }) => ({
//       productId,
//       quantity,
//     })),
//   });

//   return { orderId, returnId: filed.id };
// }
