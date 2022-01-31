import produce from "immer";
import {
  DiscountType,
  Product,
  ProductAggregator,
  PromoCode,
  PromoCodeDetailsByProduct,
  PromoCodeDetailsForPerProductByTotal,
  PromoCodeType,
} from "./types";

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
      promoCode.type === PromoCodeType.Total &&
      promoCode.promoCodeDetails.minimum <= this.totalProductsValue
    ) {
      return this.isPromoCodeOfTypePercentage(promoCode)
        ? this.calculateDiscountInPercentage(
            promoCode.promoCodeDetails.discount
          )
        : promoCode.promoCodeDetails.discount;
    }
    return 0;
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

  private calculateDiscountForPerProductByToalPromoCode(
    promoCode: PromoCodeDetailsForPerProductByTotal
  ): number {
    let totalDiscount = 0;
    const isApplicable = Object.keys(promoCode.productCombination).every(
      (productCode) => {
        return (
          this.products[productCode] &&
          promoCode.productCombination[productCode].minimumQuantity <=
            this.products[productCode].length
        );
      }
    );
    if (isApplicable) {
      return this.isPromoCodeOfTypePercentage(promoCode)
        ? this.calculateDiscountInPercentage(promoCode.discount)
        : promoCode.discount;
    }
    return totalDiscount;
  }

  private getDiscountByPromoCodeType(promoCode: PromoCode): number {
    switch (promoCode.type) {
      case PromoCodeType.Quantity:
        return this.calculateDiscountForQuantityPromoCode(
          promoCode.promoCodeDetails
        );
      case PromoCodeType.Total:
        return this.calculateDiscountForTotalPromoCode(promoCode);
      case PromoCodeType.PerProductByQuantity:
        return this.calculateDiscountForPerProductPromoCode(
          promoCode.productCombination
        );
      case PromoCodeType.PerProductByTotal:
        return this.calculateDiscountForPerProductByToalPromoCode(promoCode);
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
