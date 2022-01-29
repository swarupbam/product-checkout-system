import { ProductScanner } from "./productScanner";
import { DiscountType, Product, PromoCode, PromoCodeType } from "./types";
import { enableAllPlugins } from "immer";
enableAllPlugins();

const PROMO_CODES: PromoCode[] = [
  {
    discountType: DiscountType.Number,
    details: {
      type: PromoCodeType.Quantity,
      promoCodeDetails: {
        product_code_1: {
          discountInPricePerProduct: 2,
          minimumQuantity: 3,
        },
      },
    },
  },
  {
    discountType: DiscountType.Number,
    details: {
      type: PromoCodeType.Total,
      promoCodeDetails: {
        discount: 7,
        minimum: 15,
      },
    },
  },
  {
    discountType: DiscountType.Percent,
    details: {
      type: PromoCodeType.Total,
      promoCodeDetails: {
        discount: 10,
        minimum: 50,
      },
    },
  },
  {
    discountType: DiscountType.Number,
    details: {
      type: PromoCodeType.PerProduct,
      productCombination: {
        product_1: {
          discountInPricePerProduct: 5,
          minimumQuantity: 2,
        },
        product_2: {
          discountInPricePerProduct: 3.5,
          minimumQuantity: 2,
        },
      },
    },
  },
];

const PRODUCTS: Product[] = [
  {
    name: "Pizza",
    price: 20.5,
    productCode: "product_code_1",
    productId: "100",
  },
  {
    name: "Pizza",
    price: 20.5,
    productCode: "product_code_1",
    productId: "101",
  },
  {
    name: "Pizza",
    price: 20.5,
    productCode: "product_code_1",
    productId: "102",
  },
];

const productScanner = new ProductScanner(PROMO_CODES);

PRODUCTS.forEach((product) => productScanner.addProduct(product));

console.log(productScanner.getTotal());