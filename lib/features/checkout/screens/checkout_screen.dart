import 'dart:collection';
import 'package:flutter/material.dart';
import 'package:flutter_grocery/common/enums/footer_type_enum.dart';
import 'package:flutter_grocery/common/models/config_model.dart';
import 'package:flutter_grocery/common/providers/localization_provider.dart';
import 'package:flutter_grocery/common/widgets/custom_app_bar_widget.dart';
import 'package:flutter_grocery/common/widgets/custom_loader_widget.dart';
import 'package:flutter_grocery/common/widgets/custom_shadow_widget.dart';
import 'package:flutter_grocery/common/widgets/custom_single_child_list_widget.dart';
import 'package:flutter_grocery/common/widgets/footer_web_widget.dart';
import 'package:flutter_grocery/common/widgets/not_login_widget.dart';
import 'package:flutter_grocery/common/widgets/web_app_bar_widget.dart';
import 'package:flutter_grocery/features/address/domain/models/address_model.dart';
import 'package:flutter_grocery/features/address/providers/location_provider.dart';
import 'package:flutter_grocery/features/auth/providers/auth_provider.dart';
import 'package:flutter_grocery/features/checkout/domain/models/check_out_model.dart';
import 'package:flutter_grocery/features/checkout/widgets/delivery_address_widget.dart';
import 'package:flutter_grocery/features/checkout/widgets/details_widget.dart';
import 'package:flutter_grocery/features/checkout/widgets/place_order_button_widget.dart';
import 'package:flutter_grocery/features/order/providers/image_note_provider.dart';
import 'package:flutter_grocery/features/order/providers/order_provider.dart';
import 'package:flutter_grocery/features/splash/providers/splash_provider.dart';
import 'package:flutter_grocery/helper/checkout_helper.dart';
import 'package:flutter_grocery/helper/date_converter_helper.dart';
import 'package:flutter_grocery/helper/responsive_helper.dart';
import 'package:flutter_grocery/localization/language_constraints.dart';
import 'package:flutter_grocery/utill/dimensions.dart';
import 'package:flutter_grocery/utill/images.dart';
import 'package:flutter_grocery/utill/styles.dart';
import 'package:geolocator/geolocator.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:provider/provider.dart';

class CheckoutScreen extends StatefulWidget {
  final double amount;
  final String? orderType;
  final double? discount;
  final String? couponCode;
  final String freeDeliveryType;
  final double deliveryCharge;
  const CheckoutScreen({Key? key, required this.amount, required this.orderType, required this.discount, required this.couponCode,required this.freeDeliveryType, required this.deliveryCharge}) : super(key: key);

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  final GlobalKey<ScaffoldMessengerState> _scaffoldKey = GlobalKey();
  final TextEditingController _noteController = TextEditingController();
  late GoogleMapController _mapController;
  List<Branches>? _branches = [];
  bool _loading = true;
  Set<Marker> _markers = HashSet<Marker>();
  late bool _isLoggedIn;
  List<PaymentMethod> _activePaymentList = [];
  late bool selfPickup;


  @override
  void initState() {
    super.initState();

    initLoading();

  }




  @override
  Widget build(BuildContext context) {
    final AuthProvider authProvider = Provider.of<AuthProvider>(context, listen: false);
    final ConfigModel configModel = Provider.of<SplashProvider>(context, listen: false).configModel!;

    final bool isRoute = (_isLoggedIn || (configModel.isGuestCheckout! && authProvider.getGuestId() != null));

    return Scaffold(
      key: _scaffoldKey,
      resizeToAvoidBottomInset: true,
      appBar: (ResponsiveHelper.isDesktop(context)? const PreferredSize(preferredSize: Size.fromHeight(120), child: WebAppBarWidget())  : CustomAppBarWidget(title: getTranslated('checkout', context))) as PreferredSizeWidget?,
      body: isRoute ? Column(children: [

        Expanded(child: CustomScrollView(slivers: [

          SliverToBoxAdapter(child: Consumer<OrderProvider>(
            builder: (context, orderProvider, child) {

              double deliveryCharge = CheckOutHelper.getDeliveryCharge(
                freeDeliveryType: widget.freeDeliveryType,
                orderAmount: widget.amount, distance: orderProvider.distance, discount: widget.discount ?? 0, configModel: configModel,
              );

              orderProvider.getCheckOutData?.copyWith(deliveryCharge: deliveryCharge, orderNote: _noteController.text);

              return Consumer<LocationProvider>(builder: (context, address, child) => Column(
                children: [

                  Center(child: SizedBox(width: Dimensions.webScreenWidth, child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(flex: 6, child: Column(children: [

                        if (_branches!.isNotEmpty) CustomShadowWidget(
                          margin: const EdgeInsets.symmetric(
                            horizontal: Dimensions.paddingSizeDefault,
                            vertical: Dimensions.paddingSizeSmall,
                          ),
                          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                            Padding(
                              padding: const EdgeInsets.fromLTRB(10, 10, 10, 0),
                              child: Text(getTranslated('select_branch', context), style: poppinsMedium.copyWith(fontSize: Dimensions.fontSizeLarge)),
                            ),

                            SizedBox(height: 50, child: ListView.builder(
                              scrollDirection: Axis.horizontal,
                              padding: const EdgeInsets.all(Dimensions.paddingSizeSmall),
                              physics: const BouncingScrollPhysics(),
                              itemCount: _branches!.length,
                              itemBuilder: (context, index) {
                                return Padding(
                                  padding: const EdgeInsets.only(right: Dimensions.paddingSizeSmall),
                                  child: InkWell(
                                    onTap: () {
                                      try {
                                        orderProvider.setBranchIndex(index);
                                        double.parse(_branches![index].latitude!);
                                        _setMarkers(index);
                                        // ignore: empty_catches
                                      }catch(e) {}
                                    },
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(vertical: Dimensions.paddingSizeExtraSmall, horizontal: Dimensions.paddingSizeSmall),
                                      alignment: Alignment.center,
                                      decoration: BoxDecoration(
                                        color: index == orderProvider.branchIndex ? Theme.of(context).primaryColor : Theme.of(context).canvasColor,
                                        borderRadius: BorderRadius.circular(5),
                                      ),
                                      child: Text(_branches![index].name!, maxLines: 1, overflow: TextOverflow.ellipsis, style: poppinsMedium.copyWith(
                                        color: index == orderProvider.branchIndex ? Colors.white : Theme.of(context).textTheme.bodyLarge!.color,
                                      )),
                                    ),
                                  ),
                                );
                              },
                            )),

                            Container(
                              height: 200,
                              padding: const EdgeInsets.all(Dimensions.paddingSizeSmall),
                              alignment: Alignment.center,
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(10),
                                color: Theme.of(context).cardColor,
                              ),
                              child: Stack(children: [
                                ClipRRect(
                                  borderRadius: BorderRadius.circular(Dimensions.radiusSizeDefault),
                                  child: GoogleMap(
                                    minMaxZoomPreference: const MinMaxZoomPreference(0, 16),
                                    mapType: MapType.normal,
                                    initialCameraPosition: CameraPosition(target: LatLng(
                                      double.parse(_branches![0].latitude!),
                                      double.parse(_branches![0].longitude!),
                                    ), zoom: 8),
                                    zoomControlsEnabled: true,
                                    markers: _markers,
                                    onMapCreated: (GoogleMapController controller) async {
                                      await Geolocator.requestPermission();
                                      _mapController = controller;
                                      _loading = false;
                                      _setMarkers(0);
                                    },
                                  ),
                                ),


                                _loading ? Center(child: CircularProgressIndicator(
                                  valueColor: AlwaysStoppedAnimation<Color>(Theme.of(context).primaryColor),
                                )) : const SizedBox(),
                              ]),
                            ),
                          ]),
                        ),

                        // Address
                        DeliveryAddressWidget(selfPickup: selfPickup),

                        // Time Slot
                        CustomShadowWidget(
                          margin: const EdgeInsets.symmetric(horizontal: Dimensions.paddingSizeDefault, vertical: Dimensions.paddingSizeSmall),
                          padding: const EdgeInsets.symmetric(horizontal: Dimensions.paddingSizeDefault, vertical: Dimensions.paddingSizeDefault),
                           child: Align(
                            alignment: Provider.of<LocalizationProvider>(context, listen: false).isLtr
                                ? Alignment.topLeft : Alignment.topRight,
                            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                              Padding(
                                padding: const EdgeInsets.symmetric(horizontal: Dimensions.paddingSizeSmall, vertical: Dimensions.paddingSizeDefault),
                                child: Row(children: [
                                  Text(getTranslated('preference_time', context), style: poppinsMedium.copyWith(
                                    fontSize: Dimensions.fontSizeLarge,
                                  )),
                                  const SizedBox(width: Dimensions.paddingSizeExtraSmall),
                                  
                                  Tooltip(
                                    message: getTranslated('select_your_preference_time', context),
                                    child: Icon(Icons.info_outline, color: Theme.of(context).disabledColor, size: Dimensions.paddingSizeLarge),
                                  ),
                                  
                                ]),
                              ),

                              CustomSingleChildListWidget(
                                scrollDirection: Axis.horizontal,
                                itemCount: 3,
                                itemBuilder: (index) {
                                  return Padding(
                                    padding: const EdgeInsets.symmetric(horizontal: 2),
                                    child: Row(mainAxisAlignment: MainAxisAlignment.start, children: [
                                      Radio(
                                        activeColor: Theme.of(context).primaryColor,
                                        value: index,
                                        groupValue: orderProvider.selectDateSlot,
                                        onChanged: (value)=> orderProvider.updateDateSlot(index),
                                      ),
                                      const SizedBox(width: Dimensions.paddingSizeExtraSmall),

                                      Text(
                                        index == 0
                                            ? getTranslated('today', context) : index == 1
                                            ? getTranslated('tomorrow', context)
                                            : DateConverterHelper.estimatedDate(DateTime.now().add(const Duration(days: 2))),
                                        style: poppinsRegular.copyWith(
                                          color: index == orderProvider.selectDateSlot ? Theme.of(context).primaryColor : Theme.of(context).textTheme.bodyLarge?.color,
                                        ),
                                      ),
                                      const SizedBox(width: Dimensions.paddingSizeExtraSmall),

                                    ]),
                                  );
                                },
                              ),
                              const SizedBox(height: Dimensions.paddingSizeDefault),

                              orderProvider.timeSlots == null ? CustomLoaderWidget(color: Theme.of(context).primaryColor) : CustomSingleChildListWidget(
                                scrollDirection: Axis.horizontal,
                                itemCount: orderProvider.timeSlots?.length ?? 0,
                                itemBuilder: (index){
                                  return Padding(
                                    padding: const EdgeInsets.symmetric(horizontal: Dimensions.paddingSizeSmall),
                                    child: InkWell(
                                      hoverColor: Colors.transparent,
                                      onTap: () => orderProvider.updateTimeSlot(index),
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(vertical: Dimensions.paddingSizeSmall, horizontal: Dimensions.paddingSizeSmall),
                                        alignment: Alignment.center,
                                        decoration: BoxDecoration(
                                          color: orderProvider.selectTimeSlot == index
                                              ? Theme.of(context).primaryColor
                                              : Theme.of(context).cardColor,
                                          borderRadius: BorderRadius.circular(Dimensions.radiusSizeDefault),
                                          boxShadow: [BoxShadow(
                                            color: Theme.of(context).shadowColor,
                                            spreadRadius: .5, blurRadius: .5,
                                          )],
                                          border: Border.all(
                                            color: orderProvider.selectTimeSlot == index
                                                ? Theme.of(context).primaryColor
                                                : Theme.of(context).disabledColor,
                                          ),
                                        ),
                                        child: Row(
                                          children: [
                                            Icon(Icons.history, color: orderProvider.selectTimeSlot == index ? Theme.of(context).cardColor : Theme.of(context).disabledColor, size: 20),
                                            const SizedBox(width: Dimensions.paddingSizeExtraSmall),

                                            Text('${DateConverterHelper.stringToStringTime(orderProvider.timeSlots![index].startTime!, context)} '
                                                '- ${DateConverterHelper.stringToStringTime(orderProvider.timeSlots![index].endTime!, context)}',
                                              style: poppinsRegular.copyWith(
                                                fontSize: Dimensions.fontSizeLarge,
                                                color: orderProvider.selectTimeSlot == index ? Theme.of(context).cardColor : Theme.of(context).disabledColor,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                  );
                                },
                              ),


                              const SizedBox(height: 20),
                            ]),
                          ),
                        ),

                        if(!ResponsiveHelper.isDesktop(context)) DetailsWidget(
                          paymentList: _activePaymentList,
                          noteController: _noteController,
                        ),

                      ])),

                      if(ResponsiveHelper.isDesktop(context)) Expanded(
                        flex: 4, child: Column(children: [
                          DetailsWidget(paymentList: _activePaymentList, noteController: _noteController),

                          const PlaceOrderButtonWidget(),
                      ]),
                      ),
                    ],
                  ))),

                ],
              ));
            },
          )),


          const FooterWebWidget(footerType: FooterType.sliver),
        ])),

        if(!ResponsiveHelper.isDesktop(context)) const Center(child: PlaceOrderButtonWidget()),
      ]) : const NotLoggedInWidget(),
    );
  }

  Future<void> initLoading() async {
    final OrderProvider orderProvider = Provider.of<OrderProvider>(context, listen: false);
    final SplashProvider splashProvider = Provider.of<SplashProvider>(context, listen: false);
    final LocationProvider locationProvider = Provider.of<LocationProvider>(context, listen: false);
    final AuthProvider authProvider = Provider.of<AuthProvider>(context, listen: false);
    final OrderImageNoteProvider orderImageNoteProvider = Provider.of<OrderImageNoteProvider>(context, listen: false);

    orderProvider.clearPrevData();
    orderImageNoteProvider.onPickImage(true, isUpdate: false);
    splashProvider.getOfflinePaymentMethod(true);

    _isLoggedIn = authProvider.isLoggedIn();
    final bool isGuestCheckout = (splashProvider.configModel!.isGuestCheckout!) && authProvider.getGuestId() != null;
    selfPickup = CheckOutHelper.isSelfPickup(orderType: widget.orderType ?? '');
    orderProvider.setOrderType(widget.orderType, notify: false);

    orderProvider.setCheckOutData = CheckOutModel(
      orderType: widget.orderType,
      deliveryCharge: 0,
      freeDeliveryType: widget.freeDeliveryType,
      amount: widget.amount,
      placeOrderDiscount: widget.discount,
      couponCode: widget.couponCode, orderNote: null,
    );

    if(_isLoggedIn || isGuestCheckout) {
      orderProvider.setAddressIndex(-1, notify: false);
      orderProvider.initializeTimeSlot();
      _branches = splashProvider.configModel!.branches;

      await locationProvider.initAddressList();
      AddressModel? lastOrderedAddress;

      if(_isLoggedIn && widget.orderType == 'delivery') {
        lastOrderedAddress = await  locationProvider.getLastOrderedAddress();
      }

      CheckOutHelper.selectDeliveryAddressAuto(orderType: widget.orderType, isLoggedIn: (_isLoggedIn || isGuestCheckout), lastAddress: lastOrderedAddress);
    }
    _activePaymentList = CheckOutHelper.getActivePaymentList(configModel: splashProvider.configModel!);

  }


  void _setMarkers(int selectedIndex) async {
    late BitmapDescriptor bitmapDescriptor;
    late BitmapDescriptor bitmapDescriptorUnSelect;
    await BitmapDescriptor.fromAssetImage(const ImageConfiguration(size: Size(25, 30)), Images.restaurantMarker).then((marker) {
      bitmapDescriptor = marker;
    });
    await BitmapDescriptor.fromAssetImage(const ImageConfiguration(size: Size(20, 20)), Images.unselectedRestaurantMarker).then((marker) {
      bitmapDescriptorUnSelect = marker;
    });
    // Marker
    _markers = HashSet<Marker>();
    for(int index=0; index<_branches!.length; index++) {
      _markers.add(Marker(
        markerId: MarkerId('branch_$index'),
        position: LatLng(double.tryParse(_branches![index].latitude!)!, double.tryParse(_branches![index].longitude!)!),
        infoWindow: InfoWindow(title: _branches![index].name, snippet: _branches![index].address),
        icon: selectedIndex == index ? bitmapDescriptor : bitmapDescriptorUnSelect,
      ));
    }

    _mapController.animateCamera(CameraUpdate.newCameraPosition(CameraPosition(target: LatLng(
      double.tryParse(_branches![selectedIndex].latitude!)!,
      double.tryParse(_branches![selectedIndex].longitude!)!,
    ), zoom: ResponsiveHelper.isMobile() ? 12 : 16)));

    setState(() {});
  }


}


