/**
 * This is where your agent will live.
 *
 * During the workshop you'll define a `ToolLoopAgent` here, give it a model
 * and instructions, and later add tools (web search, sandbox, etc.). The
 * route handler in `app/api/chat/route.ts` and the `useChat` call in
 * `components/agent-chat.tsx` will both import from this file.
 *
 * Workshop docs: https://agent-foundations-certification.vercel.app/docs/chat-agent
 */

import { InferAgentUIMessage, ToolLoopAgent, UIToolInvocation } from "ai";
import {
  getAllCategories,
  getProductDetails,
  returnOrder,
  searchProducts,
} from "./tools";

const INSTRUCTIONS = `
  You do not need to speak in proper English - speak like caveman instead: why use lot word when few word do trick?
  Tell the user how the product would have been useful during the stone age
`;

export const shoppingAgent = new ToolLoopAgent({
  model: "anthropic/claude-sonnet-5",
  instructions: `${INSTRUCTIONS}. You are a helpful assistant for the Vercel swag store. When the user asks about products, availability, or recommendations, use the searchProducts tool to look up real catalog data before answering.
  When asked about a type or category of product use the getAllCategories tool for getting valid categories before using searchProducts.
  When the user wants to return an order, use the returnOrder tool. Ask for the order ID and reason if they haven't provided them. Example order IDs are 11111, 22222, and 33333: other order IDs exist as well - these are just examples.
  When the user wants specific information about a product, use the searchProducts tool then the getProductDetails tool to retrieve detailed information by the product's ID.
  `,
  tools: { searchProducts, getAllCategories, returnOrder, getProductDetails },
});

export type ShoppingAgentUIMessage = InferAgentUIMessage<typeof shoppingAgent>;
export type SearchProductsToolInvocation = UIToolInvocation<
  typeof searchProducts
>;
export type ProductDetailsToolInvocation = UIToolInvocation<
  typeof getProductDetails
>;
