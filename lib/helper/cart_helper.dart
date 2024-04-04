import 'package:flutter_grocery/common/models/cart_model.dart';
import 'package:flutter_grocery/common/models/product_model.dart';
import 'package:flutter_grocery/helper/price_converter_helper.dart';

class CartHelper {
  static CartModel? getCartModel(Product product, {List<int>? variationIndexList, int? quantity}){
    CartModel? cartModel;
    Variations? variation;

    int? stock = 0;
    List variationList = [];

    double? price = product.price;
    stock = product.totalStock;
    double? categoryDiscountAmount;
    double? priceWithDiscount;

    for(int index = 0; index < (product.choiceOptions?.length ?? 0); index++) {
      if(product.choiceOptions?[index].options?.isNotEmpty ?? false) {

        if((product.choiceOptions?[index].options?.length ?? 0) > index) {
          if(variationIndexList != null) {
            variationList.add(product.choiceOptions?[index].options?[variationIndexList[index]].replaceAll(' ', ''));

          }else{
            variationList.add(product.choiceOptions?[index].options?[index].replaceAll(' ', ''));
          }
        }
      }
    }

    String variationType = '';
    bool isFirst = true;
    for (var variation in variationList) {
      if(isFirst) {
        variationType = '$variationType$variation';
        isFirst = false;

      }else {
        variationType = '$variationType-$variation';

      }
    }

    for(Variations variationValue in product.variations ?? []) {
      if(variationValue.type == variationType) {
        price = variationValue.price;
        variation = variationValue;
        stock = variationValue.stock;
        break;
      }
    }

    priceWithDiscount = PriceConverterHelper.convertWithDiscount(price, product.discount, product.discountType);

    if(product.categoryDiscount != null) {

      categoryDiscountAmount = PriceConverterHelper.convertWithDiscount(
        price, product.categoryDiscount?.discountAmount, product.categoryDiscount?.discountType,
        maxDiscount: product.categoryDiscount?.maximumAmount,
      );
    }

    if((categoryDiscountAmount ?? 0) > 0 && (categoryDiscountAmount ?? 0)  < (priceWithDiscount ?? 0)) {
      priceWithDiscount = categoryDiscountAmount;
    }

    cartModel = CartModel(
      product.id,
      (product.image?.isNotEmpty ?? false) ? product.image![0] : '',
      product.name,  price,
      priceWithDiscount,
      quantity, variation,
      (price! - priceWithDiscount!),
      (price- PriceConverterHelper.convertWithDiscount(price, product.tax, product.taxType)!),
      product.capacity, product.unit, stock, product,
    );


    return cartModel;
  }
}