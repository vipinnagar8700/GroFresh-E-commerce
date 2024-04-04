
import 'package:flutter/material.dart';
import 'package:flutter_grocery/features/address/domain/models/address_model.dart';
import 'package:flutter_grocery/features/address/providers/location_provider.dart';
import 'package:flutter_grocery/features/address/screens/select_location_screen.dart';
import 'package:flutter_grocery/features/address/widgets/search_dialog_widget.dart';
import 'package:flutter_grocery/features/splash/providers/splash_provider.dart';
import 'package:flutter_grocery/helper/address_helper.dart';
import 'package:flutter_grocery/helper/responsive_helper.dart';
import 'package:flutter_grocery/helper/route_helper.dart';
import 'package:flutter_grocery/utill/dimensions.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:provider/provider.dart';

class MapWidget extends StatelessWidget {
  final bool isEnableUpdate;
  final bool fromCheckout;
  final AddressModel? address;

  const MapWidget({
    Key? key, required this.isEnableUpdate, this.address, required this.fromCheckout,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final LocationProvider locationProvider = Provider.of<LocationProvider>(context, listen: false);

    final branch = Provider.of<SplashProvider>(context, listen: false).configModel!.branches![0];

    return SizedBox(
      height: ResponsiveHelper.isMobile() ? 130 : 250,
      width: MediaQuery.of(context).size.width,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(Dimensions.paddingSizeSmall),
        child: Stack(
            clipBehavior: Clip.none, children: [
          GoogleMap(
            minMaxZoomPreference: const MinMaxZoomPreference(0, 16),
            mapType: MapType.normal,
            initialCameraPosition: CameraPosition(
              target: isEnableUpdate ? LatLng(
                double.parse( address != null ? address!.latitude! : branch.latitude!),
                double.parse( address != null ? address!.longitude! : branch.longitude!),
              ) : LatLng(locationProvider.position.latitude.toInt()  == 0
                  ? double.parse(branch.latitude!)
                  : locationProvider.position.latitude, locationProvider.position.longitude.toInt() == 0
                  ? double.parse(branch.longitude!)
                  : locationProvider.position.longitude,
              ),
              zoom: 8,
            ),
            zoomControlsEnabled: false,
            compassEnabled: false,
            indoorViewEnabled: true,
            mapToolbarEnabled: false,
            onCameraIdle: () {
              if(address != null && !fromCheckout) {
                locationProvider.updatePosition(locationProvider.cameraPosition, true, null, true);
                locationProvider.isUpdateAddress = true;
              }else {
                if(locationProvider.isUpdateAddress) {
                  locationProvider.updatePosition(locationProvider.cameraPosition, true, null, true);
                }else {
                  locationProvider.isUpdateAddress = true;
                }
              }

            },
            onCameraMove: ((position) => locationProvider.cameraPosition = position),
            onMapCreated: (GoogleMapController controller) {
              locationProvider.mapController = controller;

              if (!isEnableUpdate && locationProvider.mapController != null) {

                AddressHelper.checkPermission(()=>locationProvider.getCurrentLocation(
                  context, true, mapController: locationProvider.mapController,
                ));
              }
            },
          ),
          locationProvider.loading ? Center(
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Theme.of(context).primaryColor),
              )) : const SizedBox(),

          Container(
              width: MediaQuery.of(context).size.width,
              alignment: Alignment.center,
              height: MediaQuery.of(context).size.height,
              child:Icon(
                Icons.location_on,
                color: Theme.of(context).primaryColor,
                size: 35,
              )
          ),

          Positioned(
            bottom: 10,
            right: 0,
            child: InkWell(
              onTap: () => AddressHelper.checkPermission(()=>locationProvider.getCurrentLocation(
                context, true, mapController: locationProvider.mapController,
              )),
              child: Container(
                width: ResponsiveHelper.isDesktop(context) ? 40 : 30,
                height: ResponsiveHelper.isDesktop(context) ? 40 : 30,
                margin: const EdgeInsets.only(right: Dimensions.paddingSizeLarge),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(Dimensions.paddingSizeSmall),
                  color: Colors.white,
                ),
                child: Icon(
                  Icons.my_location,
                  color: Theme.of(context).primaryColor,
                  size: 20,
                ),
              ),
            ),
          ),

          if(ResponsiveHelper.isDesktop(context)) Positioned.fill(
            child: Align(
              alignment: Alignment.topLeft,
              child: SizedBox(
                width: 500,
                child: SearchBarView(margin: Dimensions.paddingSizeSmall, onTap: (){
                  showDialog(context: context, builder: (context) => Container(
                    width: 600,
                    margin: const EdgeInsets.only(right:  480),
                    child: SearchDialogWidget(mapController: locationProvider.mapController),
                  ), barrierDismissible: true);
                }),
              ),
            ),
          ),

          Positioned(
            top: 10,
            right: 0,
            child: InkWell(
              onTap: () {
                Navigator.pushNamed(
                  context, RouteHelper.getSelectLocationRoute(),
                  arguments: SelectLocationScreen(googleMapController: locationProvider.mapController),
                );
              },
              child: Container(
                width: ResponsiveHelper.isDesktop(context) ? 55 : 30,
                height: ResponsiveHelper.isDesktop(context) ? 55 : 30,
                margin: const EdgeInsets.only(right: Dimensions.paddingSizeLarge),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(Dimensions.paddingSizeSmall),
                  color: Theme.of(context).cardColor,
                ),
                child: Icon(
                  Icons.fullscreen,
                  color: Theme.of(context).primaryColor,
                  size: ResponsiveHelper.isDesktop(context) ? Dimensions.paddingSizeExtraLarge : Dimensions.paddingSizeLarge,
                ),
              ),
            ),
          ),

        ]),
      ),
    );
  }
}
