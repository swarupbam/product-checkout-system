import { ProductScanner } from "./productScanner";
import { DiscountType, Product, PromoCode, PromoCodeType } from "./types";

enum ProductCode {
  ProductCode1 = "ProductCode1",
  ProductCode2 = "ProductCode2",
  ProductCode3 = "ProductCode3",
  ProductCode4 = "ProductCode4",
  ProductCode5 = "ProductCode5",
}

const PROMO_CODES: PromoCode[] = [
  {
    type: PromoCodeType.Quantity,
    discountType: DiscountType.Number,
    promoCodeDetails: {
      [ProductCode.ProductCode1]: {
        discountInPricePerProduct: 2,
        minimumQuantity: 3,
      },
    },
  },
  {
    type: PromoCodeType.Total,
    discountType: DiscountType.Number,
    promoCodeDetails: {
      discount: 7,
      minimum: 15,
    },
  },
  {
    discountType: DiscountType.Percent,
    type: PromoCodeType.Total,
    promoCodeDetails: {
      discount: 10,
      minimum: 50,
    },
  },
  {
    discountType: DiscountType.Number,
    type: PromoCodeType.PerProductByQuantity,
    productCombination: {
      [ProductCode.ProductCode1]: {
        discountInPricePerProduct: 5,
        minimumQuantity: 2,
      },
      [ProductCode.ProductCode2]: {
        discountInPricePerProduct: 1,
        minimumQuantity: 2,
      },
    },
  },
  // {
  //   discountType: DiscountType.Percent,
  //   type: PromoCodeType.PerProductByTotal,
  //   productCombination: {
  //     [ProductCode.ProductCode1]: {
  //       minimumQuantity: 2,
  //     },
  //     [ProductCode.ProductCode2]: {
  //       minimumQuantity: 2,
  //     },
  //   },
  //   discount: 5,
  // },
  // {
  //   discountType: DiscountType.Number,
  //   type: PromoCodeType.PerProductByTotal,
  //   discount: 15,
  //   productCombination: {
  //     [ProductCode.ProductCode1]: {
  //       minimumQuantity: 2,
  //     },
  //     [ProductCode.ProductCode2]: {
  //       minimumQuantity: 2,
  //     },
  //   },
  // },
];

const PRODUCTS: Product[] = [
  {
    name: "Pizza",
    price: 20.5,
    productCode: ProductCode.ProductCode1,
    productId: "100",
  },
  {
    name: "Pizza",
    price: 20.5,
    productCode: ProductCode.ProductCode1,
    productId: "101",
  },
  {
    name: "Pizza",
    price: 20.5,
    productCode: ProductCode.ProductCode1,
    productId: "102",
  },
  {
    name: "Coke",
    price: 7.5,
    productCode: ProductCode.ProductCode2,
    productId: "103",
  },
  {
    name: "Coke",
    price: 7.5,
    productCode: ProductCode.ProductCode2,
    productId: "104",
  },
];

const productScanner = new ProductScanner(PROMO_CODES);

PRODUCTS.forEach((product) => productScanner.addProduct(product));

console.log(productScanner.getTotal());
