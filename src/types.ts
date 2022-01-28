enum DiscountType {
  Percent = "Percent",
  Number = "Number",
}

enum PromoCodeType {
  Quantity = "Quantity",
  Total = "Total",
  PerProduct = "PerProduct",
}

interface ProductPromo {
  readonly [key: string]: {
    readonly minimumQuantity: number;
    readonly discountInPrice: number;
  };
}

interface ProductPromoForTotal {
  readonly discount: number; // in percentage,
  readonly minimum: number;
}

interface PromoCodeForQuantity {
  readonly type: PromoCodeType.Quantity;
  readonly promoCodeInfo: ProductPromo;
}

interface ProductCombination {
  readonly productCombination: ProductPromo;
}

interface PromoCodeForPerProduct extends ProductCombination {
  readonly type: PromoCodeType.PerProduct;
}

interface PromoCodeForTotal {
  readonly type: PromoCodeType.Total;
  readonly promoCodeInfo: ProductPromoForTotal;
}

interface PromoCode {
  readonly discountType: DiscountType;
  readonly details:
    | PromoCodeForQuantity
    | PromoCodeForTotal
    | PromoCodeForPerProduct;
}
