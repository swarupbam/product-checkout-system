export enum DiscountType {
  Percent = "Percent",
  Number = "Number",
}

export enum PromoCodeType {
  Quantity = "Quantity",
  Total = "Total",
  PerProductByTotal = "PerProductByTotal",
  PerProductByQuantity = "PerProductByQuantity",
}

export interface PromoCodeDetailsByProductByTotal {
  readonly [key: string]: {
    readonly minimumQuantity: number;
  };
}

export interface PromoCodeDetailsByProduct {
  readonly [key: string]: {
    readonly minimumQuantity: number;
    readonly discountInPricePerProduct: number;
  };
}

export interface PromoCodeConstraintsForTotal {
  readonly discount: number; // in percentage,
  readonly minimum: number;
}

export interface ProductCombinationForTotal {
  readonly discount: number;
}

export interface PromoCodeDetailsForPerProductByTotal {
  readonly discountType: DiscountType;
  readonly type: PromoCodeType.PerProductByTotal;
  readonly discount: number;
  readonly productCombination: PromoCodeDetailsByProductByTotal;
}

export interface PromoCodeDetailsForPerProductByQuantity {
  readonly discountType: DiscountType;
  readonly type: PromoCodeType.PerProductByQuantity;
  readonly productCombination: PromoCodeDetailsByProduct;
}

export interface PromoCodeDetailsForTotal {
  readonly type: PromoCodeType.Total;
  readonly discountType: DiscountType;
  readonly promoCodeDetails: PromoCodeConstraintsForTotal;
}

export interface PromoCodeDetailsForQuantity {
  readonly type: PromoCodeType.Quantity;
  readonly discountType: DiscountType;
  readonly promoCodeDetails: PromoCodeDetailsByProduct;
}

export type PromoCode =
  | PromoCodeDetailsForQuantity
  | PromoCodeDetailsForTotal
  | PromoCodeDetailsForPerProductByQuantity
  | PromoCodeDetailsForPerProductByTotal;

// Product

export interface Product {
  readonly name: string;
  readonly price: number;
  readonly productCode: string;
  readonly productId: string;
}

export interface ProductAggregator {
  [key: string]: Product[];
}
