import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_grocery/helper/price_converter_helper.dart';
import 'package:flutter_grocery/helper/responsive_helper.dart';
import 'package:flutter_grocery/features/profile/providers/profile_provider.dart';
import 'package:flutter_grocery/utill/dimensions.dart';
import 'package:flutter_grocery/localization/language_constraints.dart';
import 'package:flutter_grocery/features/splash/providers/splash_provider.dart';
import 'package:flutter_grocery/features/wallet_and_loyalty/providers/wallet_provider.dart';
import 'package:flutter_grocery/utill/images.dart';
import 'package:flutter_grocery/utill/styles.dart';
import 'package:flutter_grocery/common/widgets/custom_button_widget.dart';
import 'package:flutter_grocery/helper/dialog_helper.dart';
import 'package:flutter_grocery/common/widgets/custom_loader_widget.dart';
import 'package:flutter_grocery/helper/custom_snackbar_helper.dart';
import 'package:provider/provider.dart';

class ConvertMoneyWidget extends StatefulWidget {
  const ConvertMoneyWidget({Key? key}) : super(key: key);

  @override
  State<ConvertMoneyWidget> createState() => _ConvertMoneyWidgetState();
}

class _ConvertMoneyWidgetState extends State<ConvertMoneyWidget> {
  final TextEditingController _pointController = TextEditingController();


  @override
  void initState() {

    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final ProfileProvider profileProvider = Provider.of<ProfileProvider>(context, listen: false);
    
    final List<String?>  noteList = [
      getTranslated('only_earning_point_can_converted', context),

      '${Provider.of<SplashProvider>(context, listen: false).configModel!.loyaltyPointExchangeRate
      } ${getTranslated('point', context)} ${getTranslated('remain', context)} ${PriceConverterHelper.convertPrice(context, 1)}',
      getTranslated('once_you_convert_the_point', context),
      getTranslated('point_can_use_for_get_bonus_money', context),

    ];
    final configModel = Provider.of<SplashProvider>(context, listen: false).configModel;
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: Dimensions.paddingSizeLarge,
          vertical: Dimensions.paddingSizeSmall,
        ),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start,children: [
          const SizedBox(height: Dimensions.paddingSizeDefault,),
          Text(
            getTranslated('enters_point_amount', context),
            style: poppinsMedium.copyWith(
              fontSize: Dimensions.fontSizeDefault,
            ),
          ),
          const SizedBox(height: Dimensions.paddingSizeDefault,),

          Container(
            padding: const EdgeInsets.symmetric(vertical: Dimensions.paddingSizeLarge).copyWith(bottom: Dimensions.paddingSizeLarge),
            width: Dimensions.webScreenWidth,
            decoration: BoxDecoration(
              color: Theme.of(context).cardColor,
              borderRadius: BorderRadius.circular(5),
              boxShadow: [BoxShadow(
                color: Theme.of(context).textTheme.bodyLarge!.color!.withOpacity(0.1),
                offset: const Offset(-1, 1),
                blurRadius: 10,
                spreadRadius: -3,
              )]
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [

                Text(getTranslated('convert_point_to_wallet_money', context),style: poppinsBold.copyWith(
                  fontSize: Dimensions.fontSizeDefault, color: Theme.of(context).primaryColor,
                )),

                Container( width: MediaQuery.of(context).size.width * 0.6,
                  padding: const EdgeInsets.symmetric(vertical: Dimensions.paddingSizeLarge),
                  child: TextField(
                    keyboardType: const TextInputType.numberWithOptions(decimal: true),
                    inputFormatters: <TextInputFormatter>[
                      FilteringTextInputFormatter.allow(RegExp(r'[0-9]')),
                      FilteringTextInputFormatter.digitsOnly

                    ],
                    controller: _pointController,
                    textAlignVertical: TextAlignVertical.center,
                    textAlign: TextAlign.center,
                    style: poppinsMedium.copyWith(fontSize: Dimensions.fontSizeMaxLarge),
                    decoration: InputDecoration(
                      isCollapsed : true,
                      hintText:'ex: 300',
                      border : InputBorder.none, focusedBorder: const UnderlineInputBorder(),
                      hintStyle: poppinsMedium.copyWith(
                        fontSize: Dimensions.fontSizeExtraLarge, color: Theme.of(context).hintColor.withOpacity(0.4),
                      ),

                    ),

                  ),
                ),


              ],
            ),
          ),
          const SizedBox(height: Dimensions.paddingSizeDefault,),
          
          Container(
            padding: const EdgeInsets.all(Dimensions.paddingSizeSmall),
            decoration: BoxDecoration(
              color: Theme.of(context).primaryColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('${getTranslated('note', context)}:', style: poppinsRegular.copyWith(fontSize: Dimensions.fontSizeDefault),),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: Column(children: noteList.map((note) => Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                  Padding(
                    padding: const EdgeInsets.only(top: 4),
                    child: Icon(Icons.circle,  size: 6, color: Theme.of(context).textTheme.bodyLarge!.color!.withOpacity(0.5)),
                  ),
                  const SizedBox(width: Dimensions.paddingSizeSmall,),

                  Flexible(
                    child: Text(note!, style: poppinsRegular.copyWith(
                      color: Theme.of(context).textTheme.bodyLarge!.color!.withOpacity(0.5),
                      fontSize: Dimensions.fontSizeDefault,
                    ), maxLines: 3, overflow: TextOverflow.ellipsis),
                  ),
                ],)).toList()),
              )
            ]),
            
          ),
          const SizedBox(height: Dimensions.paddingSizeDefault,),




          Consumer<WalletAndLoyaltyProvider>(
            builder: (context, walletProvider, _) {
              return walletProvider.isLoading ? Center(child: CustomLoaderWidget(color: Theme.of(context).primaryColor)) : CustomButtonWidget(
                borderRadius: 30,
                buttonText: getTranslated('convert_point', context), onPressed: (){
                  if(profileProvider.userInfoModel?.point == null || (profileProvider.userInfoModel?.point != null && profileProvider.userInfoModel!.point! < 1)){
                    showCustomSnackBarHelper(getTranslated('insufficient_point', context));
                  }else if(_pointController.text.isEmpty) {
                  showCustomSnackBarHelper(getTranslated('please_enter_your_point', context));
                }else{
                  int point = int.parse(_pointController.text.trim());

                  if(point < configModel!.loyaltyPointMinimumPoint!){
                    showCustomSnackBarHelper('${getTranslated('please_exchange_more_then', context)} ${configModel.loyaltyPointMinimumPoint} ${getTranslated('points', context)}' );
                  } else {

                    walletProvider.pointToWallet(point, false).then((isSuccess) => openDialog(Stack(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(Dimensions.paddingSizeDefault),
                          width: ResponsiveHelper.isDesktop(context) ? 600 : size.width * 0.9,
                          decoration: BoxDecoration(
                            color: Theme.of(context).cardColor,
                            borderRadius: const BorderRadius.all(Radius.circular(Dimensions.radiusSizeDefault)),
                          ),
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Image.asset(Images.convertedImage, color: Theme.of(context).primaryColor),
                              const SizedBox(height: Dimensions.paddingSizeDefault,),

                              Text(getTranslated('loyalty_point_converted_to', context), style: poppinsMedium),
                              Text(
                                getTranslated(isSuccess ?  'successfully' : 'failed', context),
                                style: poppinsMedium.copyWith(color:isSuccess ?  Theme.of(context).primaryColor : Theme.of(context).colorScheme.error),
                              ),
                              const SizedBox(height: Dimensions.paddingSizeDefault,),

                              TextButton(
                                onPressed: () {
                                  if(isSuccess) {
                                    walletProvider.setCurrentTabButton(2);
                                  }
                                  Navigator.of(context).pop();
                                },
                                child: Text(getTranslated(isSuccess ? 'check_history' : 'go_back', context), style: poppinsRegular.copyWith(
                                  decoration: TextDecoration.underline,
                                  color: isSuccess ?  Theme.of(context).primaryColor : Theme.of(context).colorScheme.error,
                                )),
                              ),

                            ],
                          ),
                        ),

                        Positioned.fill(child: Align(alignment: Alignment.topRight,child: InkWell(
                          onTap: (){
                            _pointController.clear();
                            Navigator.of(context).pop();
                            },
                          child: Icon(Icons.cancel_rounded, color: Theme.of(context).primaryColor.withOpacity(0.7)),
                        )))
                      ],
                    ), isDismissible: false, willPop: false),
                    );
                  }
                }

              },
              );
            }
          ),
        ],),
      ),
    );
  }
}
