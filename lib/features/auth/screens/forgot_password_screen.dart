import 'package:country_code_picker/country_code_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_grocery/common/enums/footer_type_enum.dart';
import 'package:flutter_grocery/common/models/config_model.dart';
import 'package:flutter_grocery/features/auth/providers/verification_provider.dart';
import 'package:flutter_grocery/helper/email_checker_helper.dart';
import 'package:flutter_grocery/helper/responsive_helper.dart';
import 'package:flutter_grocery/helper/route_helper.dart';
import 'package:flutter_grocery/localization/language_constraints.dart';
import 'package:flutter_grocery/features/auth/providers/auth_provider.dart';
import 'package:flutter_grocery/features/splash/providers/splash_provider.dart';
import 'package:flutter_grocery/utill/dimensions.dart';
import 'package:flutter_grocery/utill/images.dart';
import 'package:flutter_grocery/utill/styles.dart';
import 'package:flutter_grocery/common/widgets/custom_app_bar_widget.dart';
import 'package:flutter_grocery/common/widgets/custom_button_widget.dart';
import 'package:flutter_grocery/common/widgets/custom_loader_widget.dart';
import 'package:flutter_grocery/helper/custom_snackbar_helper.dart';
import 'package:flutter_grocery/common/widgets/custom_text_field_widget.dart';
import 'package:flutter_grocery/common/widgets/footer_web_widget.dart';
import 'package:flutter_grocery/common/widgets/web_app_bar_widget.dart';
import 'package:flutter_grocery/features/auth/widgets/country_code_picker_widget.dart';
import 'package:provider/provider.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({Key? key}) : super(key: key);

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final TextEditingController _emailController = TextEditingController();
  String? _countryDialCode;

  @override
  void initState() {
    super.initState();

    _countryDialCode = CountryCode.fromCountryCode(Provider.of<SplashProvider>(context, listen: false).configModel!.country!).code;
  }

  @override
  Widget build(BuildContext context) {
    final AuthProvider authProvider = Provider.of<AuthProvider>(context, listen: false);
    final ConfigModel configModel = Provider.of<SplashProvider>(context, listen: false).configModel!;
    double width = MediaQuery.of(context).size.width;
    final bool isFirebase = configModel.customerVerification!.status! && configModel.customerVerification?.type ==  'firebase';

    return Scaffold(
      appBar: (ResponsiveHelper.isDesktop(context)? const PreferredSize(preferredSize: Size.fromHeight(120), child: WebAppBarWidget()): CustomAppBarWidget(title: getTranslated('forgot_password', context))) as PreferredSizeWidget?,
      body: CustomScrollView(slivers: [
        SliverToBoxAdapter(child: Center(child: Container(
          width: !ResponsiveHelper.isMobile() ? 700 : width,
          padding: !ResponsiveHelper.isMobile() ? const EdgeInsets.all(Dimensions.paddingSizeDefault) : null,
          margin: !ResponsiveHelper.isMobile() ? const EdgeInsets.symmetric(vertical: Dimensions.paddingSizeLarge) : null,
          decoration: !ResponsiveHelper.isMobile() ? BoxDecoration(
            color: Theme.of(context).cardColor, borderRadius: BorderRadius.circular(10),
            boxShadow: [BoxShadow(color: Theme.of(context).shadowColor, blurRadius: 5, spreadRadius: 1)],
          ) : null,
          child: Consumer<VerificationProvider>(
            builder: (context, verificationProvider, child) {
              return Column(
                children: [
                  const SizedBox(height: 55),
                  Image.asset(Images.closeLock, width: 142, height: 142, color: Theme.of(context).primaryColor),
                  const SizedBox(height: 40),

                  Center(child: Text(
                    getTranslated( configModel.phoneVerification!
                        ? 'please_enter_your_number': 'please_enter_your_email', context),
                    textAlign: TextAlign.center,
                    style: poppinsRegular.copyWith(color: Theme.of(context).hintColor.withOpacity(0.6)),
                  )),

                  Padding(
                    padding: const EdgeInsets.all(Dimensions.paddingSizeLarge),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 80),

                        configModel.phoneVerification! ? Text(
                          getTranslated('mobile_number', context),
                          style: poppinsRegular.copyWith(color: Theme.of(context).hintColor.withOpacity(0.6)),
                        ) : Text(
                          getTranslated('email', context),
                          style: poppinsRegular.copyWith(color: Theme.of(context).hintColor.withOpacity(0.6)),
                        ),
                        const SizedBox(height: Dimensions.paddingSizeSmall),

                        configModel.phoneVerification! ? Row(children: [
                          CountryCodePickerWidget(
                            onChanged: (CountryCode countryCode) {
                              _countryDialCode = countryCode.code;
                            },
                            initialSelection: _countryDialCode,
                            favorite: [_countryDialCode!],
                            showDropDownButton: true,
                            padding: EdgeInsets.zero,
                            showFlagMain: true,
                            textStyle: TextStyle(color: Theme.of(context).textTheme.displayLarge!.color),

                          ),

                          Expanded(child: CustomTextFieldWidget(
                            hintText: getTranslated('number_hint', context),
                            isShowBorder: true,
                            controller: _emailController,
                            inputAction: TextInputAction.done,
                            inputType: TextInputType.phone,
                          )),
                        ]) : CustomTextFieldWidget(
                          hintText: getTranslated('demo_gmail', context),
                          isShowBorder: true,
                          controller: _emailController,
                          inputType: TextInputType.emailAddress,
                          inputAction: TextInputAction.done,
                        ),
                        const SizedBox(height: Dimensions.paddingSizeExtraLarge),

                        SizedBox(
                          width: Dimensions.webScreenWidth, child: CustomButtonWidget(
                          isLoading: (isFirebase && verificationProvider.isLoading) || (!isFirebase && authProvider.isLoading),
                          buttonText: getTranslated('send', context),
                          onPressed: () {
                            String email = _emailController.text.trim();
                            if(configModel.phoneVerification!) {
                              String phone = '${CountryCode.fromCountryCode(_countryDialCode!).dialCode}$email';
                              if (email.isEmpty) {
                                showCustomSnackBarHelper(getTranslated('enter_phone_number', context));
                              } else {
                                if(isFirebase){
                                  verificationProvider.firebaseVerifyPhoneNumber(phone, isForgetPassword: true);
                                }else{
                                  authProvider.forgetPassword(phone).then((value) {
                                    if (value.isSuccess) {
                                      Navigator.of(context).pushNamed(RouteHelper.getVerifyRoute('forget-password', phone));
                                    } else {
                                      showCustomSnackBarHelper(value.message!);
                                    }
                                  });
                                }
                              }
                            }else {
                              if (email.isEmpty) {
                                showCustomSnackBarHelper(getTranslated('enter_email_address', context));
                              } else if (EmailCheckerHelper.isNotValid(email)) {
                                showCustomSnackBarHelper(getTranslated('enter_valid_email', context));
                              } else {
                                authProvider.forgetPassword(email).then((value) {
                                  if (value.isSuccess) {
                                    Navigator.of(context).pushNamed(
                                      RouteHelper.getVerifyRoute('forget-password', email),
                                    );
                                  } else {
                                    showCustomSnackBarHelper(value.message!);
                                  }
                                });
                              }
                            }
                          },
                        ),
                        ),
                      ],
                    ),
                  ),
                ],
              );
            },
          ),
        ))),

        const FooterWebWidget(footerType: FooterType.sliver),

      ]),
    );
  }
}
