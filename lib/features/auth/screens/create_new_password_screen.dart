import 'package:flutter/material.dart';
import 'package:flutter_grocery/common/enums/footer_type_enum.dart';
import 'package:flutter_grocery/helper/responsive_helper.dart';
import 'package:flutter_grocery/helper/route_helper.dart';
import 'package:flutter_grocery/localization/language_constraints.dart';
import 'package:flutter_grocery/features/auth/providers/auth_provider.dart';
import 'package:flutter_grocery/utill/dimensions.dart';
import 'package:flutter_grocery/utill/images.dart';
import 'package:flutter_grocery/utill/styles.dart';
import 'package:flutter_grocery/common/widgets/custom_app_bar_widget.dart';
import 'package:flutter_grocery/common/widgets/custom_button_widget.dart';
import 'package:flutter_grocery/helper/custom_snackbar_helper.dart';
import 'package:flutter_grocery/common/widgets/custom_text_field_widget.dart';
import 'package:flutter_grocery/common/widgets/footer_web_widget.dart';
import 'package:flutter_grocery/common/widgets/web_app_bar_widget.dart';
import 'package:provider/provider.dart';

class CreateNewPasswordScreen extends StatelessWidget {
  final String? resetToken;
  final String? email;

  CreateNewPasswordScreen({Key? key, required this.resetToken, required this.email}) : super(key: key);

  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController = TextEditingController();
  final FocusNode _passwordFocus = FocusNode();
  final FocusNode _confirmPasswordFocus = FocusNode();

  @override
  Widget build(BuildContext context) {
    double width = MediaQuery.of(context).size.width;

    return Scaffold(
      backgroundColor: Theme.of(context).cardColor,
      appBar: (ResponsiveHelper.isDesktop(context)? const PreferredSize(preferredSize: Size.fromHeight(120), child: WebAppBarWidget()): CustomAppBarWidget(title: getTranslated('create_new_password', context))) as PreferredSizeWidget?,
      body: CustomScrollView(slivers: [
        SliverToBoxAdapter(child: Center(child: SizedBox(
          width: Dimensions.webScreenWidth,
          child: Consumer<AuthProvider>(builder: (context, auth, child) => Center(
            child: Container(
              width: ResponsiveHelper.isDesktop(context) ? 700 : width,
              padding: width > 700 ? const EdgeInsets.all(Dimensions.paddingSizeDefault) : null,
              margin: width > 700 ? const EdgeInsets.symmetric(vertical: Dimensions.paddingSizeLarge) : null,
              decoration: width > 700 ? BoxDecoration(
                color: Theme.of(context).cardColor, borderRadius: BorderRadius.circular(10),
                boxShadow: [BoxShadow(color: Theme.of(context).shadowColor, blurRadius: 5, spreadRadius: 1)],
              ) : null,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  const SizedBox(height: 30),

                  Center(child: Image.asset(Images.openLock, width: 142, height: 142, color: Theme.of(context).primaryColor)),
                  const SizedBox(height: 30),

                  Center(child: Text(
                    getTranslated('enter_password_to_create', context),
                    textAlign: TextAlign.center,
                    style: poppinsRegular.copyWith(color: Theme.of(context).hintColor.withOpacity(0.6)),
                  )),

                  Padding(
                    padding: const EdgeInsets.all(Dimensions.paddingSizeLarge),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // for password section

                        const SizedBox(height: 30),

                        Text(
                          getTranslated('new_password', context),
                          style: poppinsRegular.copyWith(color: Theme.of(context).hintColor.withOpacity(0.6)),
                        ),
                        const SizedBox(height: Dimensions.paddingSizeSmall),

                        CustomTextFieldWidget(
                          hintText: getTranslated('password_hint', context),
                          isShowBorder: true,
                          isPassword: true,
                          focusNode: _passwordFocus,
                          nextFocus: _confirmPasswordFocus,
                          isShowSuffixIcon: true,
                          inputAction: TextInputAction.next,
                          controller: _passwordController,
                        ),
                        const SizedBox(height: Dimensions.paddingSizeLarge),

                        // for confirm password section
                        Text(
                          getTranslated('confirm_password', context),
                          style: poppinsRegular.copyWith(color: Theme.of(context).hintColor.withOpacity(0.6)),
                        ),
                        const SizedBox(height: Dimensions.paddingSizeSmall),

                        CustomTextFieldWidget(
                          hintText: getTranslated('password_hint', context),
                          isShowBorder: true,
                          isPassword: true,
                          isShowSuffixIcon: true,
                          focusNode: _confirmPasswordFocus,
                          controller: _confirmPasswordController,
                          inputAction: TextInputAction.done,
                        ),
                        const SizedBox(height: Dimensions.paddingSizeExtraLarge),

                        SizedBox(width: double.infinity, child: CustomButtonWidget(
                          isLoading: auth.isLoading,
                          buttonText: getTranslated('save', context),
                          onPressed: () {
                            String password = _passwordController.text.trim();
                            String confirmPassword = _confirmPasswordController.text.trim();
                            if (password.isEmpty) {
                              showCustomSnackBarHelper(getTranslated('enter_new_password', context));
                            } else if(password.length < 6) {
                              showCustomSnackBarHelper(getTranslated('password_should_be', context));
                            } else if (confirmPassword.isEmpty) {
                              showCustomSnackBarHelper(getTranslated('confirm_new_password', context));
                            } else if (password != confirmPassword) {
                              showCustomSnackBarHelper(getTranslated('password_did_not_match', context));
                            } else {
                              auth.resetPassword(email, resetToken, password, confirmPassword).then((value) {
                                if (value.isSuccess) {
                                  auth.login(email, password).then((value) {
                                    Navigator.pushNamedAndRemoveUntil(context, RouteHelper.menu, (route) => false);
                                  });
                                } else {
                                  showCustomSnackBarHelper(value.message!);
                                }
                              });
                            }
                          },
                        )),


                      ],
                    ),
                  )
                ],
              ),
            ),
          )),
        ))),

        const FooterWebWidget(footerType: FooterType.sliver),
      ]),
    );
  }
}
