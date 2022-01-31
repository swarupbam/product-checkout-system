# product-checkout-system

## Steps to run the project locally

1. To run in TS - `npm run run-ts`
2. To run in JavaScript - `npm run run-js`
3. To run the tests - `npm run test`

## Design Decisions

### Promo Code structure

Each promo code is considered as one of the following types -

1. Product - This type of promo code is applied to a particular product. For example, if the user buys Y product in X quantity
2. Total - This is the promo code that is applied irrespective of the products added. It is applied if the total amount exceeds X amount.
3. Combo - This is the promo code that gets applied if a certain combination of products is bought with the appropriate quantity.

To identify the type of promo code, an enum `PromoCodeType` is declared.
Also, the promo code applied can be in percentage or it can be flat off. This is identified by the enum `DiscountType`

### Why products are not stored in a simple array?

The promo codes are already stored in an array. Keeping products in an array as well would require two nested for loops to calculate the discount. One to iterate over the promo codes and one to iterate over the products respectively. Also, grouping the products by product group id gives the ability to retrieve the products very efficiently. Otherwise, `.find`/`.filter` would have to be used. This is especially useful when calculating the discount for Quantity based combo promo codes.

### Out of scope

1. This utility doesn't validate the **promo code**. Rather it is consumed as it is.
2. No logic is written to apply the coupon which yields the minimum discount.

### Enhancements

1. The `ProductScanner` class has some methods which can be moved to a static class. These methods are more in terms of calculating the discount and are not really a part of the class.
2. Test coverage can be improved by writing the tests cases that cover the edge cases.
3. Some of the code is redundant and can be taken into a function.
