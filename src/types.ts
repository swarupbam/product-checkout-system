export enum DiscountType {
  Percent = "Percent",
  Number = "Number",
}

export enum PromoCodeType {
  Quantity = "Quantity",
  Total = "Total",
  PerProduct = "PerProduct",
}

export interface PromoCodeDetailsByProduct {
  readonly [key: string]: {
    readonly minimumQuantity: number;
    readonly discountInPrice: number;
  };
}

export interface PromoCodeConstraintsForTotal {
  readonly discount: number; // in percentage,
  readonly minimum: number;
}

export interface ProductCombination {
  readonly productCombination: PromoCodeDetailsByProduct;
}

export interface PromoCodeDetailsForPerProduct extends ProductCombination {
  readonly type: PromoCodeType.PerProduct;
}

export interface PromoCodeDetailsForTotal {
  readonly type: PromoCodeType.Total;
  readonly promoCodeDetails: PromoCodeConstraintsForTotal;
}

export interface PromoCodeDetailsForQuantity {
  readonly type: PromoCodeType.Quantity;
  readonly promoCodeDetails: PromoCodeDetailsByProduct;
}

export interface PromoCode {
  readonly discountType: DiscountType;
  readonly details:
    | PromoCodeDetailsForQuantity
    | PromoCodeDetailsForTotal
    | PromoCodeDetailsForPerProduct;
}

// Product

export interface Product {
  readonly name: string;
  readonly price: number;
  readonly productCode: string;
  readonly productId: string;
}

export interface ProductAggregator {
  readonly byProductId: {
    [key: string]: Product;
  };
  readonly productIds: string[];
}
