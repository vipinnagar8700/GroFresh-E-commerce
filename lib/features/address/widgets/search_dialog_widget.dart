
import 'package:flutter/material.dart';
import 'package:flutter_grocery/helper/responsive_helper.dart';
import 'package:flutter_grocery/localization/language_constraints.dart';
import 'package:flutter_grocery/features/address/providers/location_provider.dart';
import 'package:flutter_grocery/utill/dimensions.dart';
import 'package:flutter_typeahead/flutter_typeahead.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:google_maps_webservice/places.dart';
import 'package:provider/provider.dart';

class SearchDialogWidget extends StatelessWidget {
  final GoogleMapController? mapController;
  const SearchDialogWidget({Key? key, required this.mapController}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final TextEditingController controller = TextEditingController();
    final LocationProvider locationProvider = Provider.of<LocationProvider>(context, listen: false);

    return Scrollable(viewportBuilder: (context, _)=> Container(
      decoration: BoxDecoration(borderRadius: BorderRadius.circular(Dimensions.radiusSizeDefault)),
      margin: EdgeInsets.only(
        top: ResponsiveHelper.isDesktop(context) ? 160 : 75,
        right: Dimensions.paddingSizeSmall, left: Dimensions.paddingSizeSmall,
      ),
      alignment: Alignment.topCenter,
      child: SizedBox(width: 650, child: TypeAheadField(
        textFieldConfiguration: TextFieldConfiguration(
          controller: controller,
          textInputAction: TextInputAction.search,
          autofocus: true,
          textCapitalization: TextCapitalization.words,
          keyboardType: TextInputType.streetAddress,
          decoration: InputDecoration(
            hintText: getTranslated('search_location', context),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: const BorderSide(style: BorderStyle.none, width: 0),
            ),
            hintStyle: Theme.of(context).textTheme.displayMedium!.copyWith(
              fontSize: Dimensions.fontSizeDefault, color: Theme.of(context).disabledColor,
            ),
            filled: true, fillColor: Theme.of(context).cardColor,
          ),
          style: Theme.of(context).textTheme.displayMedium!.copyWith(
            color: Theme.of(context).textTheme.bodyLarge!.color,
            fontSize: Dimensions.fontSizeLarge,
          ),
        ),
        suggestionsCallback: (pattern) async {
          return await locationProvider.searchLocation(context, pattern);
        },
        itemBuilder: (context, Prediction suggestion) {
          return Padding(
            padding: const EdgeInsets.all(Dimensions.paddingSizeSmall),
            child: Row(children: [
              const Icon(Icons.location_on),

              Expanded(child: Text(
                suggestion.description ?? '', maxLines: 1, overflow: TextOverflow.ellipsis,
                style: Theme.of(context).textTheme.displayMedium?.copyWith(
                  color: Theme.of(context).textTheme.bodyLarge?.color, fontSize: Dimensions.fontSizeLarge,
                ),
              )),
            ]),
          );
        },
        onSuggestionSelected: (Prediction suggestion) {
          locationProvider.setLocation(suggestion.placeId, suggestion.description, mapController);
          Navigator.pop(context);
        },
      )),
    ));
  }
}