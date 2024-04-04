import 'package:country_code_picker/country_code_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_grocery/common/enums/footer_type_enum.dart';
import 'package:flutter_grocery/common/models/config_model.dart';
import 'package:flutter_grocery/common/widgets/custom_pop_scope_widget.dart';
import 'package:flutter_grocery/features/auth/domain/models/user_log_data.dart';
import 'package:flutter_grocery/helper/email_checker_helper.dart';
import 'package:flutter_grocery/helper/responsive_helper.dart';
import 'package:flutter_grocery/helper/route_helper.dart';
import 'package:flutter_grocery/localization/language_constraints.dart';
import 'package:flutter_grocery/features/auth/providers/auth_provider.dart';
import 'package:flutter_grocery/features/splash/providers/splash_provider.dart';
import 'package:flutter_grocery/utill/dimensions.dart';
import 'package:flutter_grocery/utill/images.dart';
import 'package:flutter_grocery/utill/styles.dart';
import 'package:flutter_grocery/common/widgets/custom_button_widget.dart';
import 'package:flutter_grocery/helper/custom_snackbar_helper.dart';
import 'package:flutter_grocery/common/widgets/custom_text_field_widget.dart';
import 'package:flutter_grocery/common/widgets/footer_web_widget.dart';
import 'package:flutter_grocery/features/auth/widgets/country_code_picker_widget.dart';
import 'package:flutter_grocery/features/auth/screens/forgot_password_screen.dart';
import 'package:flutter_grocery/common/widgets/web_app_bar_widget.dart';
import 'package:provider/provider.dart';

import '../widgets/social_login_widget.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {

  final FocusNode _emailFocus = FocusNode();
  final FocusNode _numberFocus = FocusNode();
  final FocusNode _passwordFocus = FocusNode();
  TextEditingController? _emailController;
  TextEditingController? _passwordController;
  GlobalKey<FormState>? _formKeyLogin;
  bool email = true;
  bool phone =false;
  String? countryCode;

  @override
  void initState() {
    super.initState();

    _initLoading();
    
  }
  
  

  @override
  void dispose() {
    _emailController!.dispose();
    _passwordController!.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    double width = MediaQuery.of(context).size.width;
    final configModel = Provider.of<SplashProvider>(context,listen: false).configModel!;
    final socialStatus = configModel.socialLoginStatus;

    return CustomPopScopeWidget(child: Scaffold(
      appBar: ResponsiveHelper.isDesktop(context)? const PreferredSize(preferredSize: Size.fromHeight(120), child: WebAppBarWidget()) : null,
      body: SafeArea(child: CustomScrollView(slivers: [

        if(ResponsiveHelper.isDesktop(context)) const SliverToBoxAdapter(child: SizedBox(height: Dimensions.paddingSizeDefault)),

        SliverToBoxAdapter(child: Padding(
          padding: EdgeInsets.all(ResponsiveHelper.isDesktop(context) ? 0 : Dimensions.paddingSizeLarge),
          child: Center(child: Container(
            width: ResponsiveHelper.isMobile() ? width : 700,
            padding: !ResponsiveHelper.isMobile() ? const EdgeInsets.symmetric(horizontal: 100,vertical: 50) :  width > 700 ? const EdgeInsets.all(Dimensions.paddingSizeDefault) : null,
            decoration: !ResponsiveHelper.isMobile() ? BoxDecoration(
              color: Theme.of(context).cardColor, borderRadius: BorderRadius.circular(10),
              boxShadow: [BoxShadow(color: Theme.of(context).shadowColor, blurRadius: 5, spreadRadius: 1)],
            ) : null,
            child: Consumer<AuthProvider>(
              builder: (context, authProvider, child) => Form(key: _formKeyLogin, child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(child: Padding(
                    padding: const EdgeInsets.all(Dimensions.paddingSizeDefault),
                    child: Image.asset(
                      Images.appLogo,
                      height: ResponsiveHelper.isDesktop(context)
                          ? MediaQuery.of(context).size.height * 0.15
                          : MediaQuery.of(context).size.height / 4.5,
                      fit: BoxFit.scaleDown,
                    ),
                  )),
                  //SizedBox(height: 20),

                  Center(child: Text(
                    getTranslated('login', context),
                    style: poppinsMedium.copyWith(fontSize: 24, color: Theme.of(context).textTheme.bodyLarge?.color?.withOpacity(0.6)),
                  )),
                  const SizedBox(height: 35),

                  (configModel.emailVerification ?? false) ?
                  Text(
                    getTranslated('email', context),
                    style: poppinsRegular.copyWith(color: Theme.of(context).hintColor.withOpacity(0.6)),
                  ):Text(
                    getTranslated('mobile_number', context),
                    style: poppinsRegular.copyWith(color: Theme.of(context).hintColor.withOpacity(0.6)),
                  ),
                  const SizedBox(height: Dimensions.paddingSizeSmall),

                  (configModel.emailVerification ?? false) ? CustomTextFieldWidget(
                    hintText: getTranslated('demo@gmail.com', context),
                    isShowBorder: true,
                    focusNode: _emailFocus,
                    nextFocus: _passwordFocus,
                    controller: _emailController,
                    inputType: TextInputType.emailAddress,
                  ):Row(children: [
                    CountryCodePickerWidget(
                      onChanged: (CountryCode value) {
                        countryCode = value.dialCode;
                      },
                      initialSelection: countryCode,
                      favorite: [countryCode!],
                      showDropDownButton: true,
                      padding: EdgeInsets.zero,
                      showFlagMain: true,
                      textStyle: TextStyle(color: Theme.of(context).textTheme.displayLarge?.color),

                    ),

                    Expanded(child: CustomTextFieldWidget(
                      hintText: getTranslated('8700504218', context),
                      isShowBorder: true,
                      focusNode: _numberFocus,
                      nextFocus: _passwordFocus,
                      controller: _emailController,
                      inputType: TextInputType.phone,
                    )),

                  ]),
                  const SizedBox(height: Dimensions.paddingSizeLarge),

                  Text(
                    getTranslated('password', context),
                    style: poppinsRegular.copyWith(color: Theme.of(context).hintColor.withOpacity(0.6)),
                  ),
                  const SizedBox(height: Dimensions.paddingSizeSmall),

                  CustomTextFieldWidget(
                    hintText: getTranslated('password_hint', context),
                    isShowBorder: true,
                    isPassword: true,
                    isShowSuffixIcon: true,
                    focusNode: _passwordFocus,
                    controller: _passwordController,
                    inputAction: TextInputAction.done,
                  ),
                  const SizedBox(height: Dimensions.paddingSizeLarge),

                  // for remember me section
                  Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                    InkWell(
                      onTap: () => authProvider.onChangeRememberMeStatus(),
                      child: Padding(
                        padding: const EdgeInsets.all(Dimensions.paddingSizeExtraSmall),
                        child: Row(children: [
                          Container(
                            width: 18, height: 18,
                            decoration: BoxDecoration(
                              color: authProvider.isActiveRememberMe ? Theme.of(context).primaryColor : Theme.of(context).cardColor,
                              border: Border.all(color: authProvider.isActiveRememberMe ? Colors.transparent : Theme.of(context).primaryColor),
                              borderRadius: BorderRadius.circular(3),
                            ),
                            child: authProvider.isActiveRememberMe
                                ? const Icon(Icons.done, color: Colors.white, size: 17)
                                : const SizedBox.shrink(),
                          ),
                          const SizedBox(width: Dimensions.paddingSizeSmall),

                          Text(
                            getTranslated('remember_me', context),
                            style: Theme.of(context)
                                .textTheme
                                .displayMedium!
                                .copyWith(fontSize: Dimensions.fontSizeExtraSmall, color: Theme.of(context).hintColor.withOpacity(0.6)),
                          ),
                        ]),
                      ),
                    ),

                    InkWell(
                      onTap: () {
                        Navigator.of(context).pushNamed(RouteHelper.forgetPassword, arguments: const ForgotPasswordScreen());
                      },
                      child: Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Text(
                          getTranslated('forgot_password', context),
                          style: Theme.of(context)
                              .textTheme
                              .displayMedium!
                              .copyWith(fontSize: Dimensions.fontSizeSmall, color: Theme.of(context).hintColor.withOpacity(0.6)),
                        ),
                      ),
                    ),
                  ]),
                  const SizedBox(height: Dimensions.paddingSizeSmall),

                  Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    authProvider.loginErrorMessage!.isNotEmpty
                        ? CircleAvatar(backgroundColor: Theme.of(context).colorScheme.error, radius: 5)
                        : const SizedBox.shrink(),
                    const SizedBox(width: 8),

                    Expanded(child: Text(
                      authProvider.loginErrorMessage ?? "",
                      style: Theme.of(context).textTheme.displayMedium!.copyWith(
                        fontSize: Dimensions.fontSizeSmall,
                        color: Theme.of(context).colorScheme.error,
                      ),
                    )),

                  ]),
                  const SizedBox(height: Dimensions.paddingSizeSmall),

                  // for login button

                  CustomButtonWidget(
                    isLoading: authProvider.isLoading,
                    buttonText: getTranslated('login', context),
                    onPressed: () async => _login(),
                  ),
                  const SizedBox(height: Dimensions.paddingSizeLarge),


                  // for create an account
                  InkWell(
                    onTap: () {
                      Navigator.of(context).pushNamed(RouteHelper.getCreateAccount());
                    },
                    child: Padding(padding: const EdgeInsets.all(8.0), child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            getTranslated('create_an_account', context),
                            style: poppinsRegular.copyWith(fontSize: Dimensions.fontSizeSmall, color: Theme.of(context).hintColor.withOpacity(0.6)),
                          ),
                          const SizedBox(width: Dimensions.paddingSizeSmall),

                          Text(
                            getTranslated('signup', context),
                            style: poppinsMedium.copyWith(fontSize: Dimensions.fontSizeSmall, color: Theme.of(context).textTheme.bodyLarge?.color?.withOpacity(0.6)),
                          ),
                        ])),
                  ),

                  if(socialStatus!.isFacebook! || socialStatus.isGoogle!)
                    Center(child: SocialLoginWidget(countryCode: countryCode)),


                  Center(child: Text(getTranslated('OR', context), style: poppinsRegular.copyWith(fontSize: 12))),

                  Center(child: TextButton(
                    style: TextButton.styleFrom(
                      minimumSize: const Size(1, 40),
                    ),
                    onPressed: () {
                      Navigator.pushReplacementNamed(context, RouteHelper.menu);
                    },
                    child: RichText(text: TextSpan(children: [
                      TextSpan(text: '${getTranslated('continue_as_a', context)} ',  style: poppinsRegular.copyWith(fontSize: Dimensions.fontSizeSmall, color: Theme.of(context).hintColor.withOpacity(0.6))),
                      TextSpan(text: getTranslated('guest', context), style: poppinsRegular.copyWith(color: Theme.of(context).textTheme.bodyLarge!.color)),
                    ])),

                  )),

                  if(ResponsiveHelper.isDesktop(context)) const SizedBox(height: 50),

                ],
              )),
            ),
          )),
        )),


        const FooterWebWidget(footerType: FooterType.sliver),

      ])),

    ));
  }

  void _initLoading() {
    final AuthProvider authProvider = Provider.of<AuthProvider>(context, listen: false);

    authProvider.onChangeLoadingStatus();
    authProvider.socialLogout();

    _formKeyLogin = GlobalKey<FormState>();
    _emailController = TextEditingController();
    _passwordController = TextEditingController();

    final ConfigModel configModel = Provider.of<SplashProvider>(context, listen: false).configModel!;

    UserLogData? userData = authProvider.getUserData();


    if(userData != null) {
      if(configModel.emailVerification!){
        _emailController!.text = userData.email ?? '';
      }else if(userData.phoneNumber != null){
        _emailController!.text = userData.phoneNumber!;
      }
      if(countryCode != null){
        countryCode = userData.countryCode;
      }
      _passwordController!.text = userData.password ?? '';
    }

    countryCode ??= CountryCode.fromCountryCode(configModel.country!).dialCode;
  }

  void _login() {
    final SplashProvider splashProvider = Provider.of<SplashProvider>(context, listen: false);
    final AuthProvider authProvider = Provider.of<AuthProvider>(context, listen: false);

    String email = _emailController?.text.trim() ?? '';
    String password = _passwordController?.text.trim() ?? '';

    if(!splashProvider.configModel!.emailVerification!) {
      email = countryCode! + _emailController!.text.trim();
    }


    if (email.isEmpty) {
      if(splashProvider.configModel!.emailVerification!){
        showCustomSnackBarHelper(getTranslated('enter_email_address', context));

      }else {
        showCustomSnackBarHelper(getTranslated('enter_phone_number', context));

      }
    }else if (splashProvider.configModel!.emailVerification!
        && EmailCheckerHelper.isNotValid(email)) {
      showCustomSnackBarHelper(getTranslated('enter_valid_email', context));
    }else if (password.isEmpty) {
      showCustomSnackBarHelper(getTranslated('enter_password', context));
    }else if (password.length < 6) {
      showCustomSnackBarHelper(getTranslated('password_should_be', context));
    }else {
      authProvider.login(email, password).then((status) async {
        if(!status.isSuccess && status.message == 'verification') {
          Navigator.of(context).pushNamed(RouteHelper.getVerifyRoute('sign-up', email, session: null));

        }else if (status.isSuccess) {
          if (authProvider.isActiveRememberMe) {
            authProvider.saveUserNumberAndPassword(UserLogData(
              countryCode:  countryCode,
              phoneNumber: (splashProvider.configModel?.emailVerification ?? false) ? null : _emailController!.text,
              email: (splashProvider.configModel?.emailVerification ?? false) ? _emailController!.text : null,
              password: password,
            ));
          } else {
            authProvider.clearUserLogData();
          }

          Navigator.pushNamedAndRemoveUntil(context, RouteHelper.menu, (route) => false);
        }
      });
    }
  }

}
