
import 'package:flutter/material.dart';
import 'package:flutter_grocery/features/address/domain/models/address_model.dart';
import 'package:flutter_grocery/features/address/providers/location_provider.dart';
import 'package:flutter_grocery/features/address/widgets/map_widget.dart';
import 'package:flutter_grocery/helper/responsive_helper.dart';
import 'package:flutter_grocery/localization/language_constraints.dart';
import 'package:flutter_grocery/utill/color_resources.dart';
import 'package:flutter_grocery/utill/dimensions.dart';
import 'package:flutter_grocery/utill/styles.dart';
import 'package:provider/provider.dart';

class MapWithLabelWidget extends StatelessWidget {
  final bool isEnableUpdate;
  final bool fromCheckout;
  final AddressModel? address;

  const MapWithLabelWidget({
    Key? key,
    required this.isEnableUpdate,
    required this.fromCheckout,
    this.address,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final LocationProvider locationProvider = Provider.of<LocationProvider>(context, listen: false);

    return Container(
      decoration: ResponsiveHelper.isDesktop(context) ?  BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(10),
        boxShadow: [
          BoxShadow(
            color:ColorResources.cartShadowColor.withOpacity(0.2),
            blurRadius: 10,
          )
        ],
      ) : const BoxDecoration(),

      padding: ResponsiveHelper.isDesktop(context) ?  const EdgeInsets.symmetric(
        horizontal: Dimensions.paddingSizeLarge,vertical: Dimensions.paddingSizeLarge,
      ) : EdgeInsets.zero,

      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [

          if(ResponsiveHelper.isDesktop(context)) Expanded(child: MapWidget(
            fromCheckout: fromCheckout,
            isEnableUpdate: isEnableUpdate,
            address: address,
          )),

          if(!ResponsiveHelper.isDesktop(context)) MapWidget(
            fromCheckout: fromCheckout,
            isEnableUpdate: isEnableUpdate,
            address: address,
          ),

          Padding(padding: const EdgeInsets.only(top: 10), child: Center(child: Text(
            getTranslated('add_the_location_correctly', context),
            style: poppinsRegular.copyWith(
              color: Theme.of(context).textTheme.bodyLarge!.color,
              fontSize: Dimensions.fontSizeSmall,
            ),
          ))),

          Padding(padding: const EdgeInsets.symmetric(vertical: 24.0), child: Text(
            getTranslated('label_us', context),
            style: poppinsRegular.copyWith(
              color: Theme.of(context).hintColor, fontSize: Dimensions.fontSizeLarge,
            ),
          )),

          SizedBox(height: 50, child: ListView.builder(
            shrinkWrap: true,
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            itemCount: locationProvider.getAllAddressType.length,
            itemBuilder: (context, index) => InkWell(
              onTap: () {
                locationProvider.updateAddressIndex(index, true);
              },
              child: Container(
                padding: const EdgeInsets.symmetric(
                  vertical: Dimensions.paddingSizeDefault,
                  horizontal: Dimensions.paddingSizeLarge,
                ),
                margin: const EdgeInsets.only(right: 17),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(Dimensions.paddingSizeSmall),
                  border: Border.all(color: locationProvider.selectAddressIndex == index
                      ? Theme.of(context).primaryColor : Theme.of(context).hintColor.withOpacity(0.6)
                  ),
                  color: locationProvider.selectAddressIndex == index
                      ? Theme.of(context).primaryColor : Theme.of(context).cardColor.withOpacity(0.9),
                ),
                child: Text(
                  getTranslated(locationProvider.getAllAddressType[index].toLowerCase(), context),
                  style: poppinsRegular.copyWith(
                    color: locationProvider.selectAddressIndex == index
                        ? Theme.of(context).cardColor
                        : Theme.of(context).hintColor.withOpacity(0.6),
                  ),

                ),
              ),
            ),
          )),

        ],
      ),
    );
  }
}
