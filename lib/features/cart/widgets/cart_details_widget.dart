import 'package:flutter/material.dart';
import 'package:flutter_grocery/common/widgets/price_item_widget.dart';
import 'package:flutter_grocery/features/cart/widgets/coupon_widget.dart';
import 'package:flutter_grocery/features/cart/widgets/delivery_option_widget.dart';
import 'package:flutter_grocery/features/coupon/providers/coupon_provider.dart';
import 'package:flutter_grocery/features/splash/providers/splash_provider.dart';
import 'package:flutter_grocery/helper/price_converter_helper.dart';
import 'package:flutter_grocery/localization/language_constraints.dart';
import 'package:flutter_grocery/utill/dimensions.dart';
import 'package:flutter_grocery/utill/styles.dart';
import 'package:provider/provider.dart';

class CartDetailsWidget extends StatelessWidget {
  const CartDetailsWidget({
    Key? key,
    required TextEditingController couponController,
    required double total,
    required bool isSelfPickupActive,
    required bool kmWiseCharge,
    required bool isFreeDelivery,
    required double itemPrice,
    required double tax,
    required double discount,
    required this.deliveryCharge,
  }) : _couponController = couponController, _total = total, _isSelfPickupActive = isSelfPickupActive, _kmWiseCharge = kmWiseCharge, _isFreeDelivery = isFreeDelivery, _itemPrice = itemPrice, _tax = tax, _discount = discount, super(key: key);

  final TextEditingController _couponController;
  final double _total;
  final bool _isSelfPickupActive;
  final bool _kmWiseCharge;
  final bool _isFreeDelivery;
  final double _itemPrice;
  final double _tax;
  final double _discount;
  final double deliveryCharge;

  @override
  Widget build(BuildContext context) {
    final configModel = Provider.of<SplashProvider>(context, listen: false).configModel!;
    return Column(children: [

      _isSelfPickupActive ? Container(
        padding: const EdgeInsets.all(Dimensions.paddingSizeSmall),
        decoration: BoxDecoration(
          color: Theme.of(context).cardColor,
          borderRadius: BorderRadius.circular(Dimensions.radiusSizeDefault),
          boxShadow: [BoxShadow(color: Colors.grey.withOpacity(0.1), spreadRadius: 1, blurRadius: 5, offset: const Offset(0, 1))],
        ),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(getTranslated('delivery_option', context), style: poppinsSemiBold.copyWith(fontSize: Dimensions.fontSizeDefault)),
          DeliveryOptionWidget(value: 'delivery', title: getTranslated('home_delivery', context), kmWiseFee: _kmWiseCharge, freeDelivery: _isFreeDelivery),

          DeliveryOptionWidget(value: 'self_pickup', title: getTranslated('self_pickup', context), kmWiseFee: _kmWiseCharge),

        ]),
      ) : const SizedBox(),
      SizedBox(height: _isSelfPickupActive ? Dimensions.paddingSizeDefault : 0),

      Container(
        padding: const EdgeInsets.all(Dimensions.paddingSizeSmall),
        decoration: BoxDecoration(
          color: Theme.of(context).cardColor,
          borderRadius: BorderRadius.circular(Dimensions.radiusSizeDefault),
          boxShadow: [BoxShadow(color: Colors.grey.withOpacity(0.1), spreadRadius: 1, blurRadius: 5, offset: const Offset(0, 1))],
        ),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

          Consumer<CouponProvider>(
            builder: (context, couponProvider, child) {
              return CouponWidget(couponController: _couponController, total: _total, deliveryCharge: deliveryCharge);
            },
          ),
          const SizedBox(height: Dimensions.paddingSizeLarge),

          // Total
          Text(getTranslated('cost_summery', context), style: poppinsSemiBold.copyWith(fontSize: Dimensions.fontSizeLarge)),
          Divider(height: 30, thickness: 1, color: Theme.of(context).disabledColor.withOpacity(0.05)),

          PriceItemWidget(
            title: getTranslated('items_price', context),
            subTitle: PriceConverterHelper.convertPrice(context, _itemPrice),
          ),
          const SizedBox(height: Dimensions.paddingSizeSmall),

          PriceItemWidget(
            title: '${getTranslated('tax', context)} ${configModel.isVatTexInclude! ? '(${getTranslated('include', context)})' : ''}',
            subTitle: '${ configModel.isVatTexInclude! ?  '' : '+'} ${PriceConverterHelper.convertPrice(context, _tax)}',
          ),
          const SizedBox(height: Dimensions.paddingSizeSmall),

          PriceItemWidget(
            title: getTranslated('discount', context),
            subTitle: '- ${PriceConverterHelper.convertPrice(context, _discount)}',
          ),
          const SizedBox(height: Dimensions.paddingSizeSmall),


          Consumer<CouponProvider>(builder: (context, couponProvider, _) {
            return couponProvider.coupon?.couponType != 'free_delivery' && couponProvider.discount! > 0 ? Padding(
              padding: EdgeInsets.symmetric(vertical: couponProvider.coupon?.couponType != 'free_delivery' && couponProvider.discount! > 0 ? Dimensions.paddingSizeSmall : 0),
              child: PriceItemWidget(
                title: getTranslated('coupon_discount', context),
                subTitle: '- ${PriceConverterHelper.convertPrice(context, couponProvider.discount)}',
              ),
            ) : const SizedBox();
          }),


          if (_kmWiseCharge || _isFreeDelivery) const SizedBox() else PriceItemWidget(
            title: getTranslated('delivery_fee', context),
            subTitle: PriceConverterHelper.convertPrice(context, deliveryCharge),
          ),

          Divider(height: 30, thickness: 1, color: Theme.of(context).disabledColor.withOpacity(0.1)),

          PriceItemWidget(
            title: getTranslated(_kmWiseCharge ? 'subtotal' : 'total_amount', context),
            subTitle: PriceConverterHelper.convertPrice(context, _total),
            style: poppinsBold.copyWith(fontSize: Dimensions.fontSizeExtraLarge),
          ),

        ]),
      ),

    ]);
  }
}


