import 'package:flutter/material.dart';
import 'package:flutter_grocery/common/enums/footer_type_enum.dart';
import 'package:flutter_grocery/common/models/response_model.dart';
import 'package:flutter_grocery/common/widgets/custom_image_widget.dart';
import 'package:flutter_grocery/features/profile/domain/models/userinfo_model.dart';
import 'package:flutter_grocery/localization/app_localization.dart';
import 'package:flutter_grocery/localization/language_constraints.dart';
import 'package:flutter_grocery/features/auth/providers/auth_provider.dart';
import 'package:flutter_grocery/features/profile/providers/profile_provider.dart';
import 'package:flutter_grocery/features/splash/providers/splash_provider.dart';
import 'package:flutter_grocery/utill/dimensions.dart';
import 'package:flutter_grocery/utill/images.dart';
import 'package:flutter_grocery/utill/styles.dart';
import 'package:flutter_grocery/common/widgets/custom_button_widget.dart';
import 'package:flutter_grocery/helper/custom_snackbar_helper.dart';
import 'package:flutter_grocery/common/widgets/custom_text_field_widget.dart';
import 'package:flutter_grocery/common/widgets/footer_web_widget.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';

class ProfileMenuWebWidget extends StatefulWidget {
  final FocusNode? firstNameFocus;
  final FocusNode? lastNameFocus;
  final FocusNode? emailFocus;
  final FocusNode? phoneNumberFocus;
  final FocusNode? passwordFocus;
  final FocusNode? confirmPasswordFocus;
  final TextEditingController? firstNameController;
  final TextEditingController? lastNameController;
  final TextEditingController? emailController;
  final TextEditingController? phoneNumberController;
  final TextEditingController? passwordController;
  final TextEditingController? confirmPasswordController;
  final UserInfoModel? userInfoModel;

  final Function pickImage;
  final PickedFile? file;
  final String? image;

  const ProfileMenuWebWidget({
    Key? key,
    required this.firstNameFocus,
    required this.lastNameFocus,
    required this.emailFocus,
    required this.phoneNumberFocus,
    required this.passwordFocus,
    required this.confirmPasswordFocus,
    required this.firstNameController,
    required this.lastNameController,
    required this.emailController,
    required this.phoneNumberController,
    required this.passwordController,
    required this.confirmPasswordController,
    //function
    required this.pickImage,
    //file
    required this.file,
    required this.image,
    required this.userInfoModel,


  }) : super(key: key);

  @override
  State<ProfileMenuWebWidget> createState() => _ProfileMenuWebWidgetState();
}

class _ProfileMenuWebWidgetState extends State<ProfileMenuWebWidget> {
  @override
  Widget build(BuildContext context) {
    final SplashProvider splashProvider = Provider.of<SplashProvider>(context, listen: false);

    return CustomScrollView(
      slivers: [
        SliverToBoxAdapter(child: Consumer<ProfileProvider>(builder: (context, profileProvider, child) {
          return Center(child: SizedBox(
            width: Dimensions.webScreenWidth,
            child: Stack(children: [
              Column(children: [
                Container(
                  height: 150,  color:  Theme.of(context).primaryColor.withOpacity(0.5),
                  alignment: Alignment.centerLeft,
                  padding: const EdgeInsets.symmetric(horizontal: 240.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      profileProvider.userInfoModel != null ? Text(
                        '${profileProvider.userInfoModel!.fName ?? ''} ${profileProvider.userInfoModel!.lName ?? ''}',
                        style: poppinsRegular.copyWith(fontSize: Dimensions.fontSizeExtraLarge, color: Theme.of(context).textTheme.bodyLarge?.color?.withOpacity(0.6)),
                      ) : const SizedBox(height: Dimensions.paddingSizeDefault, width: 150),
                      const SizedBox(height: Dimensions.paddingSizeSmall),
                      profileProvider.userInfoModel != null ? Text(
                        profileProvider.userInfoModel!.email ?? '',
                        style: poppinsRegular.copyWith(color: Theme.of(context).textTheme.bodyLarge?.color?.withOpacity(0.6)),
                      ) : const SizedBox(height: 15, width: 100),



                    ],
                  ),

                ),
                const SizedBox(height: 100),

                SizedBox(width: Dimensions.webScreenWidth, child: Column(children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            getTranslated('first_name', context),
                            style: Theme.of(context).textTheme.displayMedium!.copyWith(color: Theme.of(context).hintColor.withOpacity(0.6), fontWeight: FontWeight.w400, fontSize: Dimensions.fontSizeSmall),
                          ),
                          const SizedBox(height: Dimensions.paddingSizeSmall),

                          SizedBox(
                            width: 400,
                            child: CustomTextFieldWidget(
                              hintText: 'John',
                              isShowBorder: true,
                              controller: widget.firstNameController,
                              focusNode: widget.firstNameFocus,
                              nextFocus: widget.lastNameFocus,
                              inputType: TextInputType.name,
                              capitalization: TextCapitalization.words,
                            ),
                          ),

                          const SizedBox(height: Dimensions.paddingSizeLarge),

                          // for email section
                          Text(
                            getTranslated('email', context),
                            style: Theme.of(context).textTheme.displayMedium?.copyWith(
                              color: Theme.of(context).hintColor.withOpacity(0.6),
                              fontWeight: FontWeight.w400,
                              fontSize: Dimensions.fontSizeSmall,
                            ),
                          ),
                          const SizedBox(height: Dimensions.paddingSizeSmall),

                          SizedBox(
                            width: 400,
                            child: CustomTextFieldWidget(
                              hintText: getTranslated('demo_gmail', context),
                              isShowBorder: true,
                              controller: widget.emailController,
                              isEnabled: false,
                              focusNode: widget.emailFocus,
                              nextFocus: widget.phoneNumberFocus,
                              inputType: TextInputType.emailAddress,
                            ),
                          ),
                          const SizedBox(height: Dimensions.paddingSizeLarge),

                          if(widget.userInfoModel?.loginMedium == 'general')  Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                getTranslated('password', context),
                                style: Theme.of(context).textTheme.displayMedium!.copyWith(
                                  color: Theme.of(context).hintColor.withOpacity(0.6),
                                  fontWeight: FontWeight.w400,
                                  fontSize: Dimensions.fontSizeSmall,
                                ),
                              ),
                              const SizedBox(height: Dimensions.paddingSizeSmall),

                              SizedBox(
                                width: 400,
                                child: CustomTextFieldWidget(
                                  hintText: getTranslated('password_hint', context),
                                  isShowBorder: true,
                                  controller: widget.passwordController,
                                  focusNode: widget.passwordFocus,
                                  nextFocus: widget.confirmPasswordFocus,
                                  isPassword: true,
                                  isShowSuffixIcon: true,
                                ),
                              ),
                              const SizedBox(height: Dimensions.paddingSizeLarge),
                            ]),



                        ],
                      ),
                      const SizedBox(width: Dimensions.paddingSizeLarge),

                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            getTranslated('last_name', context),
                            style: Theme.of(context).textTheme.displayMedium?.copyWith(
                              color: Theme.of(context).hintColor.withOpacity(0.6),
                              fontWeight: FontWeight.w400, fontSize: Dimensions.fontSizeSmall,
                            ),
                          ),
                          const SizedBox(height: Dimensions.paddingSizeSmall),

                          SizedBox(
                            width: 400,
                            child: CustomTextFieldWidget(
                              hintText: 'Doe',
                              isShowBorder: true,
                              controller: widget.lastNameController,
                              focusNode: widget.lastNameFocus,
                              nextFocus: widget.phoneNumberFocus,
                              inputType: TextInputType.name,
                              capitalization: TextCapitalization.words,
                            ),
                          ),
                          const SizedBox(height: Dimensions.paddingSizeLarge),

                          // for phone Number section
                          Text(
                            getTranslated('mobile_number', context),
                            style: Theme.of(context).textTheme.displayMedium!.copyWith(
                              color: Theme.of(context).hintColor.withOpacity(0.6),
                              fontWeight: FontWeight.w400,
                              fontSize: Dimensions.fontSizeSmall,
                            ),
                          ),
                          const SizedBox(height: Dimensions.paddingSizeSmall),

                          SizedBox(
                            width: 400,
                            child: CustomTextFieldWidget(
                              hintText: getTranslated('number_hint', context),
                              isShowBorder: true,
                              controller: widget.phoneNumberController,
                              focusNode: widget.phoneNumberFocus,
                              nextFocus: widget.passwordFocus,
                              inputType: TextInputType.phone,
                            ),
                          ),
                          const SizedBox(height: Dimensions.paddingSizeLarge),

                          if(widget.userInfoModel?.loginMedium == 'general')   Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                getTranslated('confirm_password', context),
                                style: Theme.of(context).textTheme.displayMedium!.copyWith(color: Theme.of(context).hintColor.withOpacity(0.6), fontWeight: FontWeight.w400, fontSize: Dimensions.fontSizeSmall),
                              ),
                              const SizedBox(height: Dimensions.paddingSizeSmall),
                              SizedBox(
                                width: 400,
                                child: CustomTextFieldWidget(
                                  hintText: getTranslated('password_hint', context),
                                  isShowBorder: true,
                                  controller: widget.confirmPasswordController,
                                  focusNode: widget.confirmPasswordFocus,
                                  isPassword: true,
                                  isShowSuffixIcon: true,
                                  inputAction: TextInputAction.done,
                                ),
                              ),
                              const SizedBox(height: Dimensions.paddingSizeLarge),
                            ],),





                        ],
                      ),
                      const SizedBox(height: 55.0)
                    ],
                  ),

                  SizedBox(width: 180.0, child: CustomButtonWidget(
                    isLoading: profileProvider.isLoading,
                    buttonText: getTranslated('update_profile', context),
                    onPressed: () async => _onSubmit(),
                  )),
                ])),

              ]),

              Positioned(left: 30, top: 45, child: Stack(children: [
                Container(
                  height: 180, width: 180,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle, border: Border.all(color: Colors.white, width: 4),
                    boxShadow: [BoxShadow(color: Colors.white.withOpacity(0.1), blurRadius: 22, offset: const Offset(0, 8.8) )],
                    color: Theme.of(context).secondaryHeaderColor,
                  ),
                  child: ClipOval(
                    child: profileProvider.file != null
                        ?  Image.file(profileProvider.file!, width: 80, height: 80, fit: BoxFit.contain) : profileProvider.data != null
                        ?  Image.network(profileProvider.data!.path, width: 80, height: 80, fit: BoxFit.fill) : CustomImageWidget(
                      placeholder: Images.placeHolder, height: 170, width: 170, fit: BoxFit.cover,
                      image: '${splashProvider.baseUrls?.customerImageUrl}/${profileProvider.userInfoModel?.image ?? widget.image}',
                    ),
                  ),
                ),

                Positioned(bottom: 10, right: 10, child: InkWell(
                  onTap: widget.pickImage as void Function()?,
                  child: Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Theme.of(context).primaryColor.withOpacity(0.5),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.camera_alt,color: Colors.white60),
                  ),
                )),
              ])),

            ]),
          ));
        })),

        const FooterWebWidget(footerType: FooterType.sliver),
      ],
    );
  }



  Future<void> _onSubmit() async {
    final ProfileProvider profileProvider = Provider.of<ProfileProvider>(context, listen: false);

    String firstName = widget.firstNameController?.text.trim() ?? '';
    String lastName = widget.lastNameController?.text.trim() ?? '';
    String phoneNumber = widget.phoneNumberController?.text.trim() ?? '';
    String password = widget.passwordController?.text.trim() ?? '';
    String confirmPassword = widget.confirmPasswordController?.text.trim() ?? '';
    if (profileProvider.userInfoModel?.fName == firstName &&
        profileProvider.userInfoModel?.lName == lastName &&
        profileProvider.userInfoModel?.phone == phoneNumber &&
        profileProvider.userInfoModel?.email == widget.emailController?.text && widget.file == null
        && password.isEmpty && confirmPassword.isEmpty) {
      showCustomSnackBarHelper(getTranslated('change_something_to_update', context));

    }else if (firstName.isEmpty) {
      showCustomSnackBarHelper(getTranslated('enter_first_name', context));

    }else if (lastName.isEmpty) {
      showCustomSnackBarHelper(getTranslated('enter_last_name', context));

    }else if (phoneNumber.isEmpty) {
      showCustomSnackBarHelper(getTranslated('enter_phone_number', context));

    } else if((password.isNotEmpty && password.length < 6) || (confirmPassword.isNotEmpty && confirmPassword.length < 6)) {
      showCustomSnackBarHelper(getTranslated('password_should_be', context));

    } else if(password != confirmPassword) {
      showCustomSnackBarHelper(getTranslated('password_did_not_match', context));

    } else {
      UserInfoModel updateUserInfoModel = UserInfoModel();
      updateUserInfoModel.fName = firstName;
      updateUserInfoModel.lName = lastName;
      updateUserInfoModel.phone = phoneNumber;
      String pass = password;

      ResponseModel responseModel = await profileProvider.updateUserInfo(
        updateUserInfoModel, pass,
        profileProvider.file, profileProvider.data,
        Provider.of<AuthProvider>(context, listen: false).getUserToken(),
      );

      if (responseModel.isSuccess) {
        profileProvider.getUserInfo();
        widget.passwordController?.text = '';
        widget.confirmPasswordController?.text = '';
        showCustomSnackBarHelper('updated_successfully'.tr, isError: false);

      } else {
        showCustomSnackBarHelper(responseModel.message!, isError: true);

      }
      setState(() {});
    }
  }
}
