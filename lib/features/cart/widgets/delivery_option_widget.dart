import 'package:flutter/material.dart';
import 'package:flutter_grocery/helper/price_converter_helper.dart';
import 'package:flutter_grocery/localization/language_constraints.dart';
import 'package:flutter_grocery/features/order/providers/order_provider.dart';
import 'package:flutter_grocery/features/splash/providers/splash_provider.dart';
import 'package:flutter_grocery/utill/dimensions.dart';
import 'package:flutter_grocery/utill/styles.dart';
import 'package:flutter_grocery/common/widgets/custom_directionality_widget.dart';
import 'package:provider/provider.dart';

class DeliveryOptionWidget extends StatelessWidget {
  final String value;
  final String? title;
  final bool kmWiseFee;
  final bool freeDelivery;
  const DeliveryOptionWidget({Key? key, required this.value, required this.title, required this.kmWiseFee, this.freeDelivery = false}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final SplashProvider splashProvider = Provider.of<SplashProvider>(context, listen: false);

    return Consumer<OrderProvider>(
      builder: (context, order, child) {
        return InkWell(
          onTap: () => order.setOrderType(value),
          child: Row(
            children: [
              Radio(
                value: value,
                groupValue: order.orderType,
                activeColor: Theme.of(context).primaryColor,
                onChanged: (String? value) => order.setOrderType(value),
              ),
              const SizedBox(width: Dimensions.paddingSizeSmall),

              Text(title!, style: order.orderType == value ? poppinsSemiBold.copyWith(fontSize: Dimensions.fontSizeSmall)
                  : poppinsRegular.copyWith(fontSize: Dimensions.fontSizeSmall)),
              const SizedBox(width: 5),

              freeDelivery ? CustomDirectionalityWidget(child: Text('(${getTranslated('free', context)})', style: poppinsMedium))
                  :  kmWiseFee  ? const SizedBox() : Text('(${value == 'delivery' && !freeDelivery
                  ? PriceConverterHelper.convertPrice(context, splashProvider.configModel?.deliveryCharge)
                  : getTranslated('free', context)})', style: poppinsMedium,
              ),

            ],
          ),
        );
      },
    );
  }
}
