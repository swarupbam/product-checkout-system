import { Product, ProductAggregator, PromoCode, PromoCodeType } from "./types";
import produce from "immer";

export class ProductScanner {
  private products: ProductAggregator = {};
  private promoCodes: PromoCode[] = [];
  private totalProductsValue: number = 0;

  public constructor(availablePromoCodes: PromoCode[]) {
    this.promoCodes = availablePromoCodes;
  }

  private calculateDiscountForQuantityPromoCode(
    promoCode: PromoCode,
    productId: string
  ): number {
    if (
      promoCode.details.type === PromoCodeType.Quantity &&
      promoCode.details.promoCodeDetails[productId] &&
      promoCode.details.promoCodeDetails[productId].minimumQuantity ===
        this.products[productId].length
    ) {
      return (
        promoCode.details.promoCodeDetails[productId]
          .discountInPricePerProduct * this.products[productId].length
      );
    }
    return 0;
  }

  private getDiscountByPromoCodeType(
    promoCode: PromoCode,
    productId: string
  ): number {
    switch (promoCode.details.type) {
      case PromoCodeType.Quantity:
        return this.calculateDiscountForQuantityPromoCode(promoCode, productId);
      case PromoCodeType.Total:
        return 0;
      case PromoCodeType.PerProduct:
        return 0;
    }
  }

  private getTotalDiscount(): number {
    let totalDiscount = 0;
    console.log(this.products);
    for (const productId in this.products) {
      for (const promoCode of this.promoCodes) {
        totalDiscount += this.getDiscountByPromoCodeType(promoCode, productId);
      }
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
