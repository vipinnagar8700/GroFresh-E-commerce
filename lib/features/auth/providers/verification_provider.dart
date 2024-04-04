import 'dart:async';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_grocery/common/models/api_response_model.dart';
import 'package:flutter_grocery/common/models/config_model.dart';
import 'package:flutter_grocery/common/models/error_response_model.dart';
import 'package:flutter_grocery/common/models/response_model.dart';
import 'package:flutter_grocery/features/auth/domain/models/signup_model.dart';
import 'package:flutter_grocery/features/auth/domain/reposotories/auth_repo.dart';
import 'package:flutter_grocery/features/splash/providers/splash_provider.dart';
import 'package:flutter_grocery/helper/api_checker_helper.dart';
import 'package:flutter_grocery/helper/custom_snackbar_helper.dart';
import 'package:flutter_grocery/helper/route_helper.dart';
import 'package:flutter_grocery/localization/language_constraints.dart';
import 'package:flutter_grocery/main.dart';
import 'package:provider/provider.dart';
import 'package:flutter_grocery/features/auth/providers/auth_provider.dart' as auth;

class VerificationProvider with ChangeNotifier {
  final AuthRepo? authRepo;

  VerificationProvider({required this.authRepo});


  bool resendLoadingStatus = false;
  bool _isLoading = false;
  bool get isLoading => _isLoading;


  String _verificationCode = '';
  String get verificationCode => _verificationCode;

  bool _isEnableVerificationCode = false;
  bool get isEnableVerificationCode => _isEnableVerificationCode;

  Timer? _timer;
  int? currentTime;



  Future<void> sendVerificationCode(ConfigModel config, SignUpModel signUpModel) async {
    resendLoadingStatus = true;
    notifyListeners();

    if(config.customerVerification!.status! && config.customerVerification?.type ==  'phone'){
      await checkPhone(signUpModel.phone!);

    }else if(config.customerVerification!.status! && config.customerVerification?.type ==  'email'){
     await checkEmail(signUpModel.email);

    }else if(config.customerVerification!.status! && config.customerVerification?.type ==  'firebase'){
      await firebaseVerifyPhoneNumber(signUpModel.phone!);

    }
    resendLoadingStatus = false;
    notifyListeners();

  }


  Future<ResponseModel> checkPhone(String phone) async {
    _isLoading = true;
    notifyListeners();
    ApiResponseModel apiResponse = await authRepo!.checkPhone(phone);
    _isLoading = false;
    notifyListeners();
    ResponseModel responseModel;
    if (apiResponse.response != null && apiResponse.response!.statusCode == 200) {
      responseModel = ResponseModel(true, apiResponse.response!.data["token"]);
    } else {
      String errorMessage = ApiCheckerHelper.getError(apiResponse).errors![0].message ?? '';

      responseModel = ResponseModel(false, errorMessage);
    }
    notifyListeners();
    return responseModel;
  }

  Future<ResponseModel> checkEmail(String? email) async {
    _isLoading = true;
    resendLoadingStatus = true;
    notifyListeners();
    ApiResponseModel apiResponse = await authRepo!.checkEmail(email);
    _isLoading = false;
    notifyListeners();
    ResponseModel responseModel;
    if (apiResponse.response != null && apiResponse.response!.statusCode == 200) {
      // startVerifyTimer();

      responseModel = ResponseModel(true, apiResponse.response!.data["token"]);
    } else {
      String? errorMessage = ApiCheckerHelper.getError(apiResponse).errors?.first.message;

      responseModel = ResponseModel(false, errorMessage);
      showCustomSnackBarHelper(errorMessage!);
    }
    resendLoadingStatus = false;
    notifyListeners();
    return responseModel;
  }

  Future<void> firebaseVerifyPhoneNumber(String phoneNumber, {bool isForgetPassword = false})async {
    _isLoading = true;
    notifyListeners();

    FirebaseAuth.instance.verifyPhoneNumber(
      phoneNumber: phoneNumber,
      verificationCompleted: (PhoneAuthCredential credential) {},
      verificationFailed: (FirebaseAuthException e) {
        _isLoading = false;
        notifyListeners();

        Navigator.pop(Get.context!);
        showCustomSnackBarHelper(getTranslated('${e.message}', Get.context!));
      },
      codeSent: (String vId, int? resendToken) {
        _isLoading = false;
        notifyListeners();

        Navigator.of(Get.context!).pushNamed(RouteHelper.getVerifyRoute(
          isForgetPassword ? 'forget-password' : 'sign-up', phoneNumber, session: vId,
        ));
      },
      codeAutoRetrievalTimeout: (String verificationId) {},
    );

  }



  Future<ResponseModel> verifyPhone(String phone) async {
    final auth.AuthProvider authProvider = Provider.of<auth.AuthProvider>(Get.context!, listen: false);

    _isLoading = true;
    notifyListeners();
    ApiResponseModel apiResponse = await authRepo!.verifyPhone(phone, _verificationCode);

    ResponseModel responseModel;
    if (apiResponse.response != null && apiResponse.response!.statusCode == 200) {
      // startVerifyTimer();
      String token = apiResponse.response!.data["token"];
      await authProvider.updateAuthToken(token);
      responseModel = ResponseModel(true, apiResponse.response!.data["message"]);


    } else {
      String? errorMessage = getTranslated(ErrorResponseModel.fromJson(apiResponse.error).errors![0].message, Get.context!);
      responseModel = ResponseModel(false, errorMessage);

      showCustomSnackBarHelper(errorMessage);
    }
    _isLoading = false;
    notifyListeners();
    return responseModel;
  }

  Future<ResponseModel> verifyToken(String? email) async {
    _isLoading = true;
    notifyListeners();
    ApiResponseModel apiResponse = await authRepo!.verifyToken(email, _verificationCode);

    ResponseModel responseModel;
    if (apiResponse.response != null && apiResponse.response!.statusCode == 200) {
      responseModel = ResponseModel(true, apiResponse.response!.data["message"]);
    } else {

      responseModel = ResponseModel(false, ErrorResponseModel.fromJson(apiResponse.error).errors![0].message);
    }

    _isLoading = false;
    notifyListeners();
    return responseModel;
  }

  Future<ResponseModel> verifyEmail(String? email) async {
    final auth.AuthProvider authProvider = Provider.of<auth.AuthProvider>(Get.context!, listen: false);

    _isLoading = true;
    notifyListeners();
    ApiResponseModel apiResponse = await authRepo!.verifyEmail(email, _verificationCode);

    ResponseModel responseModel;
    if (apiResponse.response != null && apiResponse.response!.statusCode == 200) {
      String token = apiResponse.response!.data["token"];
      await authProvider.updateAuthToken(token);

      responseModel = ResponseModel(true, apiResponse.response!.data["message"]);
    } else {
      String? errorMessage = ErrorResponseModel.fromJson(apiResponse.error).errors![0].message;

      responseModel = ResponseModel(false, errorMessage);
      showCustomSnackBarHelper(errorMessage ?? '');
    }
    _isLoading = false;
    notifyListeners();
    return responseModel;
  }

  void updateVerificationCode(String query, int queryLen, {bool isUpdate = true}) {
    if (query.length == queryLen) {
      _isEnableVerificationCode = true;
    } else {
      _isEnableVerificationCode = false;
    }
    _verificationCode = query;
    if(isUpdate) {
      notifyListeners();
    }
  }



  void startVerifyTimer(){
    final SplashProvider splashProvider = Provider.of<SplashProvider>(Get.context!, listen: false);

    _timer?.cancel();
    currentTime = splashProvider.configModel?.otpResendTime ?? 0;


    _timer =  Timer.periodic(const Duration(seconds: 1), (_){

      if(currentTime! > 0) {
        currentTime = currentTime! - 1;
      }else{
        _timer?.cancel();
      }

      notifyListeners();
    });

  }






}