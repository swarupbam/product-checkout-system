import {
  DiscountType,
  Product,
  ProductAggregator,
  ProductCombination,
  PromoCode,
  PromoCodeDetailsByProduct,
  PromoCodeType,
} from "./types";
import produce from "immer";

export class ProductScanner {
  private products: ProductAggregator = {};
  private promoCodes: PromoCode[] = [];
  private totalProductsValue: number = 0;

  public constructor(availablePromoCodes: PromoCode[]) {
    this.promoCodes = availablePromoCodes;
  }

  private calculateDiscountForQuantityPromoCode(
    promoCodeDetails: PromoCodeDetailsByProduct
  ): number {
    for (const productCode in promoCodeDetails) {
      if (
        this.products[productCode] &&
        promoCodeDetails[productCode].minimumQuantity <=
          this.products[productCode].length
      ) {
        return (
          promoCodeDetails[productCode].discountInPricePerProduct *
          this.products[productCode].length
        );
      }
    }
    return 0;
  }

  private isPromoCodeOfTypePercentage(promoCode: PromoCode) {
    return promoCode.discountType === DiscountType.Percent;
  }

  private calculateDiscountInPercentage(discountInPercentage: number): number {
    return (this.totalProductsValue * discountInPercentage) / 100;
  }

  private calculateDiscountForTotalPromoCode(promoCode: PromoCode): number {
    if (
      promoCode.details.type === PromoCodeType.Total &&
      promoCode.details.promoCodeDetails.minimum <= this.totalProductsValue
    ) {
      return this.isPromoCodeOfTypePercentage(promoCode)
        ? this.calculateDiscountInPercentage(
            promoCode.details.promoCodeDetails.discount
          )
        : promoCode.details.promoCodeDetails.discount;
    }
    return 0;
  }

  private isPerProductPromoApplicable(
    productCombination: PromoCodeDetailsByProduct
  ) {
    let isEveryProductPresentInCart = true;

    for (const productGroupId in productCombination) {
      if (!this.products[productGroupId]) {
        return false;
      }
    }
    return isEveryProductPresentInCart;
  }

  private calculateDiscountForPerProductPromoCode(
    productCodeDetails: PromoCodeDetailsByProduct
  ): number {
    let totalDiscount = 0;
    for (const productCode in productCodeDetails) {
      if (
        this.products[productCode] &&
        productCodeDetails[productCode].minimumQuantity <=
          this.products[productCode].length
      ) {
        totalDiscount +=
          this.products[productCode].length *
          productCodeDetails[productCode].discountInPricePerProduct;
      } else {
        totalDiscount = 0;
      }
    }
    return totalDiscount;
  }

  private getDiscountByPromoCodeType(promoCode: PromoCode): number {
    switch (promoCode.details.type) {
      case PromoCodeType.Quantity:
        return this.calculateDiscountForQuantityPromoCode(
          promoCode.details.promoCodeDetails
        );
      case PromoCodeType.Total:
        return this.calculateDiscountForTotalPromoCode(promoCode);
      case PromoCodeType.PerProduct:
        return this.calculateDiscountForPerProductPromoCode(
          promoCode.details.productCombination
        );
    }
  }

  private getTotalDiscount(): number {
    let totalDiscount = 0;
    for (const promoCode of this.promoCodes) {
      totalDiscount += this.getDiscountByPromoCodeType(promoCode);
    }
    return totalDiscount;
  }

  public addProduct(product: Product): void {
    const newProductsState = produce(this.products, (draft) => {
      if (draft[product.productCode]) {
        draft[product.productCode] = draft[product.productCode].concat(product);
      } else {
        draft[product.productCode] = [product];
      }
    });
    this.totalProductsValue += product.price;
    this.products = newProductsState;
  }

  public getTotal(): number {
    const totalDiscount = this.getTotalDiscount();
    return this.totalProductsValue - totalDiscount;
  }
}
