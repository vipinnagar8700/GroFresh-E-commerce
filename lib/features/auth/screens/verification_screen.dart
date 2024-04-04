import 'package:flutter/material.dart';
import 'package:flutter_grocery/common/enums/footer_type_enum.dart';
import 'package:flutter_grocery/common/models/config_model.dart';
import 'package:flutter_grocery/features/auth/domain/models/signup_model.dart';
import 'package:flutter_grocery/common/enums/app_mode_enum.dart';
import 'package:flutter_grocery/features/auth/providers/verification_provider.dart';
import 'package:flutter_grocery/helper/email_checker_helper.dart';
import 'package:flutter_grocery/helper/responsive_helper.dart';
import 'package:flutter_grocery/helper/route_helper.dart';
import 'package:flutter_grocery/localization/language_constraints.dart';
import 'package:flutter_grocery/features/auth/providers/auth_provider.dart';
import 'package:flutter_grocery/features/splash/providers/splash_provider.dart';
import 'package:flutter_grocery/utill/app_constants.dart';
import 'package:flutter_grocery/utill/dimensions.dart';
import 'package:flutter_grocery/utill/images.dart';
import 'package:flutter_grocery/utill/styles.dart';
import 'package:flutter_grocery/common/widgets/custom_app_bar_widget.dart';
import 'package:flutter_grocery/common/widgets/custom_button_widget.dart';
import 'package:flutter_grocery/common/widgets/custom_directionality_widget.dart';
import 'package:flutter_grocery/common/widgets/custom_loader_widget.dart';
import 'package:flutter_grocery/helper/custom_snackbar_helper.dart';
import 'package:flutter_grocery/features/auth/screens/create_new_password_screen.dart';
import 'package:flutter_grocery/features/menu/screens/menu_screen.dart';
import 'package:pin_code_fields/pin_code_fields.dart';
import 'package:provider/provider.dart';

import '../../../common/widgets/footer_web_widget.dart';
import '../../../common/widgets/web_app_bar_widget.dart';

class VerificationScreen extends StatefulWidget {
  final String? emailAddress;
  final String? session;
  final bool fromSignUp;
  const VerificationScreen({Key? key, this.emailAddress, this.fromSignUp = false, this.session}) : super(key: key);

  @override
  State<VerificationScreen> createState() => _VerificationScreenState();
}

class _VerificationScreenState extends State<VerificationScreen> {
  final TextEditingController inputPinTextController = TextEditingController();

  @override
  void initState() {
    final VerificationProvider verificationProvider = Provider.of<VerificationProvider>(context, listen: false);
    verificationProvider.startVerifyTimer();
    verificationProvider.updateVerificationCode('', 6, isUpdate: false);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {

    double width = MediaQuery.of(context).size.width;
    final isPhone = EmailCheckerHelper.isNotValid(widget.emailAddress!);

    final ConfigModel config = Provider.of<SplashProvider>(context, listen: false).configModel!;
    final bool isFirebaseOTP =  config.customerVerification!.status! && config.customerVerification?.type ==  'firebase';

    return Scaffold(
      backgroundColor: Theme.of(context).cardColor,
      appBar: (ResponsiveHelper.isDesktop(context) ? const PreferredSize(preferredSize: Size.fromHeight(120), child: WebAppBarWidget()) : CustomAppBarWidget(
        title: getTranslated(isPhone ? 'verify_phone' : 'verify_email', context),
      )) as PreferredSizeWidget?,
      body: SafeArea(child: CustomScrollView(slivers: [

        SliverToBoxAdapter(child: Center(child: SizedBox(
          width: Dimensions.webScreenWidth,
          child: Consumer<VerificationProvider>(builder: (context, verificationProvider, child) => Container(
            width: !ResponsiveHelper.isMobile() ? 700 : width,
            padding: !ResponsiveHelper.isMobile() ? const EdgeInsets.all(Dimensions.paddingSizeDefault) : null,
            margin: !ResponsiveHelper.isMobile() ? const EdgeInsets.symmetric(vertical: Dimensions.paddingSizeLarge) : null,
            decoration: !ResponsiveHelper.isMobile() ? BoxDecoration(
              color: Theme.of(context).cardColor, borderRadius: BorderRadius.circular(10),
              boxShadow: [BoxShadow(color: Theme.of(context).shadowColor, blurRadius: 5, spreadRadius: 1)],
            ) : null,
            child: Column(
              children: [
                const SizedBox(height: 55),

                Image.asset(
                  Images.emailWithBackground,
                  width: 142, height: 142,
                  color: Theme.of(context).primaryColor,
                ),
                const SizedBox(height: 40),

                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 50),
                  child: Center(child: Text(
                    '${getTranslated('please_enter', context)} 6 ${getTranslated('digit_code', context)} '
                        '\n ${widget.emailAddress!.trim()}',
                    textAlign: TextAlign.center,
                    style: poppinsRegular.copyWith(color: Theme.of(context).hintColor.withOpacity(0.6)),
                  )),
                ),

                if(AppMode.demo == AppConstants.appMode && !isFirebaseOTP)
                  Padding(
                    padding: const EdgeInsets.all(Dimensions.paddingSizeSmall),
                    child: Text(getTranslated('for_demo_purpose_use', context), style: poppinsMedium.copyWith(
                      color: Theme.of(context).disabledColor,
                    )),
                  ),

                Padding(
                  padding:  EdgeInsets.symmetric(horizontal: ResponsiveHelper.isDesktop(context) ? 300 : ResponsiveHelper.isTab(context) ? 150 : 12, vertical: 35),
                  child: PinCodeTextField(
                    controller: inputPinTextController,
                    length: 6,
                    appContext: context,
                    obscureText: false,
                    enabled: true,
                    keyboardType: TextInputType.number,
                    animationType: AnimationType.fade,
                    pinTheme: PinTheme(
                      shape: PinCodeFieldShape.box,
                      fieldHeight: 63,
                      fieldWidth: 52,
                      borderWidth: 1,
                      borderRadius: BorderRadius.circular(10),
                      selectedColor: Theme.of(context).primaryColor.withOpacity(.2),
                      selectedFillColor: Colors.white,
                      inactiveFillColor: Theme.of(context).cardColor,
                      inactiveColor: Theme.of(context).primaryColor.withOpacity(.2),
                      activeColor: Theme.of(context).primaryColor.withOpacity(.4),
                      activeFillColor: Theme.of(context).cardColor,
                    ),
                    animationDuration: const Duration(milliseconds: 300),
                    backgroundColor: Colors.transparent,
                    enableActiveFill: true,
                    onChanged: (query)=> verificationProvider.updateVerificationCode(query, 6),
                    beforeTextPaste: (text) {
                      return true;
                    },
                  ),
                ),



                Consumer<AuthProvider>(
                  builder: (context, authProvider, _) {
                    print('verification------status-----> ${verificationProvider.resendLoadingStatus}');
                    int? days, hours, minutes, seconds;

                    Duration duration = Duration(seconds: verificationProvider.currentTime ?? 0);
                    days = duration.inDays;
                    hours = duration.inHours - days * 24;
                    minutes = duration.inMinutes - (24 * days * 60) - (hours * 60);
                    seconds = duration.inSeconds - (24 * days * 60 * 60) - (hours * 60 * 60) - (minutes * 60);

                    return Column(children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Text(getTranslated('did_not_receive_the_code', context), style: poppinsMedium.copyWith(
                            color: Theme.of(context).textTheme.bodyLarge!.color!.withOpacity(.6),
                          )),
                          const SizedBox(width: Dimensions.paddingSizeSmall),


                          verificationProvider.resendLoadingStatus ? CustomLoaderWidget(
                            color: Theme.of(context).primaryColor,
                          ) : TextButton(
                            onPressed: verificationProvider.currentTime! > 0 ? null :  () async {

                              if (widget.fromSignUp) {
                                await verificationProvider.sendVerificationCode(config, SignUpModel(phone: widget.emailAddress, email: widget.emailAddress));
                                verificationProvider.startVerifyTimer();

                              } else {
                                if(isFirebaseOTP) {
                                  verificationProvider.firebaseVerifyPhoneNumber('${widget.emailAddress?.trim()}', isForgetPassword: true);

                                }else{
                                  await authProvider.forgetPassword(widget.emailAddress).then((value) {
                                    verificationProvider.startVerifyTimer();

                                    if (value.isSuccess) {
                                      showCustomSnackBarHelper('resend_code_successful', isError: false);
                                    } else {
                                      showCustomSnackBarHelper(value.message!);
                                    }
                                  });
                                }
                              }

                            },
                            child: CustomDirectionalityWidget(
                              child: Text((verificationProvider.currentTime != null && verificationProvider.currentTime! > 0)
                                  ? '${getTranslated('resend', context)} (${minutes > 0 ? '${minutes}m :' : ''}${seconds}s)'
                                  : getTranslated('resend_it', context), textAlign: TextAlign.end,
                                  style: poppinsMedium.copyWith(
                                    color: verificationProvider.currentTime != null && verificationProvider.currentTime! > 0 ?
                                    Theme.of(context).disabledColor : Theme.of(context).primaryColor.withOpacity(.6),
                                  )),
                            ),
                          ),
                        ],
                      ) ,
                      const SizedBox(height: 48),

                      (verificationProvider.isEnableVerificationCode && !verificationProvider.resendLoadingStatus) ? Padding(
                        padding: const EdgeInsets.symmetric(horizontal: Dimensions.paddingSizeLarge),
                        child: SizedBox(width: 200, child: CustomButtonWidget(
                          isLoading: verificationProvider.isLoading || (isFirebaseOTP && authProvider.isLoading),
                          buttonText: getTranslated('verify', context),
                          onPressed: () {
                            if (widget.fromSignUp) {
                              if(config.customerVerification!.status! && config.customerVerification!.type == 'phone') {
                                verificationProvider.verifyPhone(widget.emailAddress!.trim()).then((value) {
                                  if(value.isSuccess){
                                    Navigator.pushNamedAndRemoveUntil(context, RouteHelper.menu, (route) => false);
                                  }
                                });
                              }else if(config.customerVerification!.status! && config.customerVerification!.type == 'email') {
                                verificationProvider.verifyEmail(widget.emailAddress).then((value){
                                  if(value.isSuccess){
                                    Navigator.pushNamedAndRemoveUntil(context, RouteHelper.menu, (route) => false);
                                  }

                                });

                              } else if(isFirebaseOTP) {
                                authProvider.firebaseOtpLogin(
                                  phoneNumber: '${widget.emailAddress}',
                                  session: '${widget.session}',
                                  otp: verificationProvider.verificationCode,
                                );

                              }
                            } else {
                              if(isFirebaseOTP) {
                                authProvider.firebaseOtpLogin(
                                  phoneNumber: '${widget.emailAddress}',
                                  session: '${widget.session}',
                                  otp: verificationProvider.verificationCode,
                                  isForgetPassword: true,
                                );
                              }else{
                                verificationProvider.verifyToken(widget.emailAddress).then((value) {
                                  if(value.isSuccess) {
                                    Navigator.of(context).pushNamed(
                                      RouteHelper.getNewPassRoute(widget.emailAddress, verificationProvider.verificationCode),
                                      arguments: CreateNewPasswordScreen(email: widget.emailAddress, resetToken: verificationProvider.verificationCode),
                                    );
                                  }else {
                                    showCustomSnackBarHelper(value.message!);
                                  }
                                });
                              }

                            }
                          },
                        )),
                      ) : const SizedBox.shrink(),
                      const SizedBox(height: 48),

                    ]);
                  }
                ),
              ],
            ),
          )),
        ))),

        const FooterWebWidget(footerType: FooterType.sliver),
      ])),
    );
  }
}
