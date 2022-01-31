import { ProductScanner } from "../src/productScanner";
import {
  DiscountType,
  ProductCode,
  PromoCode,
  PromoCodeType,
} from "../src/types";

describe("Product scanner tests", () => {
  test("Should apply Quantity promo code", () => {
    const products = [
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
    ];

    const codes: PromoCode[] = [
      {
        type: PromoCodeType.Quantity,
        discountType: DiscountType.Number,
        promoCodeDetails: {
          [ProductCode.ProductCode1]: {
            discountInPricePerProduct: 2,
            minimumQuantity: 2,
          },
        },
      },
    ];
    const scanner = new ProductScanner(codes);
    products.forEach((product) => scanner.addProduct(product));
    expect(scanner.getTotal()).toBe(37);
  });

  test("Should not apply Quantity promo code", () => {
    const products = [
      {
        name: "Pizza",
        price: 20.5,
        productCode: ProductCode.ProductCode1,
        productId: "100",
      },
    ];

    const codes: PromoCode[] = [
      {
        type: PromoCodeType.Quantity,
        discountType: DiscountType.Number,
        promoCodeDetails: {
          [ProductCode.ProductCode1]: {
            discountInPricePerProduct: 2,
            minimumQuantity: 2,
          },
        },
      },
    ];
    const scanner = new ProductScanner(codes);
    products.forEach((product) => scanner.addProduct(product));
    expect(scanner.getTotal()).toBe(20.5);
  });

  test("Should calculate % off appropriately", () => {
    const products = [
      {
        name: "Pizza",
        price: 20,
        productCode: ProductCode.ProductCode1,
        productId: "100",
      },
      {
        name: "Pizza",
        price: 20,
        productCode: ProductCode.ProductCode1,
        productId: "101",
      },
      {
        name: "Pizza",
        price: 20,
        productCode: ProductCode.ProductCode1,
        productId: "102",
      },
    ];

    const codes: PromoCode[] = [
      {
        type: PromoCodeType.Total,
        discountType: DiscountType.Percent,
        promoCodeDetails: {
          discount: 5,
          minimum: 50,
        },
      },
    ];
    const scanner = new ProductScanner(codes);
    products.forEach((product) => scanner.addProduct(product));
    expect(scanner.getTotal()).toBe(57);
  });

  test("Should not apply per product promo when one of the products is missing from the cart", () => {
    const products = [
      {
        name: "Pizza",
        price: 20,
        productCode: ProductCode.ProductCode1,
        productId: "100",
      },
      {
        name: "Pizza",
        price: 20,
        productCode: ProductCode.ProductCode1,
        productId: "101",
      },
    ];

    const codes: PromoCode[] = [
      {
        type: PromoCodeType.PerProductByQuantity,
        discountType: DiscountType.Number,
        productCombination: {
          [ProductCode.ProductCode1]: {
            discountInPricePerProduct: 2,
            minimumQuantity: 1,
          },
          [ProductCode.ProductCode2]: {
            discountInPricePerProduct: 0.5,
            minimumQuantity: 1,
          },
        },
      },
    ];
    const scanner = new ProductScanner(codes);
    products.forEach((product) => scanner.addProduct(product));
    expect(scanner.getTotal()).toBe(40);
  });

  test("Should not apply per product promo product quantity is not sufficient", () => {
    const products = [
      {
        name: "Pizza",
        price: 20,
        productCode: ProductCode.ProductCode1,
        productId: "100",
      },
      {
        name: "Pizza",
        price: 20,
        productCode: ProductCode.ProductCode1,
        productId: "101",
      },
      {
        name: "Coke",
        price: 5.5,
        productCode: ProductCode.ProductCode2,
        productId: "101",
      },
    ];

    const codes: PromoCode[] = [
      {
        type: PromoCodeType.PerProductByQuantity,
        discountType: DiscountType.Number,
        productCombination: {
          [ProductCode.ProductCode1]: {
            discountInPricePerProduct: 2,
            minimumQuantity: 1,
          },
          [ProductCode.ProductCode2]: {
            discountInPricePerProduct: 0.5,
            minimumQuantity: 2,
          },
        },
      },
    ];
    const scanner = new ProductScanner(codes);
    products.forEach((product) => scanner.addProduct(product));
    expect(scanner.getTotal()).toBe(45.5);
  });

  test("Should apply appropriate promo codes", () => {
    const products = [
      {
        name: "Pizza",
        price: 20,
        productCode: ProductCode.ProductCode1,
        productId: "100",
      },
      {
        name: "Pizza",
        price: 20,
        productCode: ProductCode.ProductCode1,
        productId: "101",
      },
      {
        name: "Coke",
        price: 5.5,
        productCode: ProductCode.ProductCode2,
        productId: "102",
      },
      {
        name: "Coke",
        price: 5.5,
        productCode: ProductCode.ProductCode2,
        productId: "103",
      },
      {
        name: "Fries",
        price: 7.5,
        productCode: ProductCode.ProductCode3,
        productId: "104",
      },
      {
        name: "Fries",
        price: 7.5,
        productCode: ProductCode.ProductCode3,
        productId: "105",
      },
    ];

    const codes: PromoCode[] = [
      {
        type: PromoCodeType.PerProductByTotal,
        discountType: DiscountType.Number,
        discount: 5,
        productCombination: {
          [ProductCode.ProductCode1]: {
            minimumQuantity: 1,
          },
          [ProductCode.ProductCode3]: {
            minimumQuantity: 1,
          },
        },
      },
      {
        discountType: DiscountType.Percent,
        type: PromoCodeType.Total,
        promoCodeDetails: {
          discount: 10,
          minimum: 25,
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
          [ProductCode.ProductCode3]: {
            discountInPricePerProduct: 2.5,
            minimumQuantity: 1,
          },
        },
      },
    ];
    const scanner = new ProductScanner(codes);
    products.forEach((product) => scanner.addProduct(product));
    expect(scanner.getTotal()).toBe(39.4);
  });
});
