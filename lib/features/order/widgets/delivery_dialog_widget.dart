import 'package:flutter/material.dart';
import 'package:grocery_delivery_boy/common/models/order_model.dart';
import 'package:grocery_delivery_boy/helper/price_converter_helper.dart';
import 'package:grocery_delivery_boy/localization/language_constrants.dart';
import 'package:grocery_delivery_boy/features/auth/providers/auth_provider.dart';
import 'package:grocery_delivery_boy/features/order/providers/order_provider.dart';
import 'package:grocery_delivery_boy/common/providers/tracker_provider.dart';
import 'package:grocery_delivery_boy/utill/dimensions.dart';
import 'package:grocery_delivery_boy/utill/images.dart';
import 'package:grocery_delivery_boy/utill/styles.dart';
import 'package:grocery_delivery_boy/common/widgets/custom_button_widget.dart';
import 'package:grocery_delivery_boy/features/order/screens/order_details_screen.dart';
import 'package:grocery_delivery_boy/features/order/screens/order_delivered_screen.dart';
import 'package:provider/provider.dart';

class DeliveryDialogWidget extends StatelessWidget {
  final Function onTap;
  final OrderModel? orderModel;
  final double? totalPrice;

  const DeliveryDialogWidget({Key? key, required this.onTap, this.totalPrice, this.orderModel}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
        decoration: BoxDecoration(
            color: Theme.of(context).cardColor,
            borderRadius: BorderRadius.circular(Dimensions.paddingSizeSmall),
            border: Border.all(color: Theme.of(context).primaryColor, width: 0.2)),
        child: Stack(
          clipBehavior: Clip.none, children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const SizedBox(height: 20),
                Image.asset(Images.money),
                const SizedBox(height: 20),
                Center(
                    child: Text(
                  getTranslated('do_you_collect_money', context),
                  style: rubikRegular,
                )),
                const SizedBox(height: 20),
                Center(
                    child: Text(
                  PriceConverterHelper.convertPrice(context, totalPrice),
                  style: rubikRegular.copyWith(color: Theme.of(context).primaryColor,fontSize: 30),
                )),
                const SizedBox(height: 20),
                Row(
                  children: [
                    Expanded(
                        child: CustomButtonWidget(
                      btnTxt: getTranslated('no', context),
                      isShowBorder: true,
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (_) => OrderDetailsScreen(orderModelItem: orderModel)));
                      },
                    )),
                    const SizedBox(width: Dimensions.paddingSizeDefault),
                    Expanded(
                        child: Consumer<OrderProvider>(
                      builder: (context, order, child) {
                        return !order.isLoading ? CustomButtonWidget(
                          btnTxt: getTranslated('yes', context),
                          onTap: () {
                            Provider.of<TrackerProvider>(context, listen: false).stopLocationService();
                            Provider.of<OrderProvider>(context, listen: false).updateOrderStatus(
                                token: Provider.of<AuthProvider>(context, listen: false).getUserToken(),
                                orderId: orderModel!.id,
                                status: 'delivered').then((value) {
                              if (value.isSuccess) {
                                order.updatePaymentStatus(
                                    token: Provider.of<AuthProvider>(context, listen: false).getUserToken(), orderId: orderModel!.id, status: 'paid');
                                Provider.of<OrderProvider>(context, listen: false).getAllOrders();
                                Navigator.of(context)
                                    .pushReplacement(MaterialPageRoute(builder: (_) => OrderDeliveredScreen(orderID: orderModel!.id.toString())));
                              }
                            });
                          },
                        ) : Center(child: CircularProgressIndicator(valueColor: AlwaysStoppedAnimation<Color>(Theme.of(context).primaryColor)));
                      },
                    )),
                  ],
                ),
              ],
            ),
            Positioned(
              right: -20,
              top: -20,
              child: IconButton(
                  padding: const EdgeInsets.all(0),
                  icon: const Icon(Icons.clear, size: Dimensions.paddingSizeLarge),
                  onPressed: () {
                    Navigator.pop(context);
                    Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (_) => OrderDetailsScreen(orderModelItem: orderModel)));
                  }),
            ),
          ],
        ),
      ),
    );
  }
}
