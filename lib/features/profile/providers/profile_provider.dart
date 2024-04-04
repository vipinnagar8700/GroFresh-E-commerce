import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_grocery/common/models/api_response_model.dart';
import 'package:flutter_grocery/common/models/error_response_model.dart';
import 'package:flutter_grocery/common/models/response_model.dart';
import 'package:flutter_grocery/features/profile/domain/models/userinfo_model.dart';
import 'package:flutter_grocery/features/profile/domain/reposotories/profile_repo.dart';
import 'package:flutter_grocery/helper/api_checker_helper.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';

class ProfileProvider with ChangeNotifier {
  final ProfileRepo? profileRepo;

  ProfileProvider({required this.profileRepo});

  UserInfoModel? _userInfoModel;
  bool _isLoading = false;
  File? _file;
  PickedFile? _data;

  UserInfoModel? get userInfoModel => _userInfoModel;
  bool get isLoading => _isLoading;
  PickedFile? get data => _data;
  File? get file => _file;

  final picker = ImagePicker();


  Future<void> getUserInfo() async {
    _isLoading = true;
    ApiResponseModel apiResponse = await profileRepo!.getUserInfo();
    if (apiResponse.response != null && apiResponse.response!.statusCode == 200) {

      _userInfoModel = UserInfoModel.fromJson(apiResponse.response!.data);
    } else {
      ApiCheckerHelper.checkApi(apiResponse);
    }
    _isLoading = false;
    notifyListeners();
  }



  void choosePhoto() async {
    final pickedFile = await picker.pickImage(source: ImageSource.gallery, imageQuality: 50, maxHeight: 500, maxWidth: 500);
    if (pickedFile != null) {
      _file = File(pickedFile.path);
    }
    notifyListeners();
  }

  void pickImage() async {
    _data = PickedFile(await picker.pickImage(source: ImageSource.gallery, imageQuality: 80).then((value) => value?.path ?? ''));
    notifyListeners();
  }

  Future<ResponseModel> updateUserInfo(UserInfoModel updateUserModel, String pass, File? file, PickedFile? data, String token) async {
    _isLoading = true;
    notifyListeners();

    ResponseModel responseModel;
    http.StreamedResponse response = await profileRepo!.updateProfile(updateUserModel, pass, file, data, token);
    if (response.statusCode == 200) {
      Map map = jsonDecode(await response.stream.bytesToString());
      String? message = map["message"];
      _userInfoModel = updateUserModel;
      responseModel = ResponseModel(true, message);
    } else {
      responseModel = ResponseModel(false, ErrorResponseModel.fromJson(jsonDecode(await response.stream.bytesToString())).errors![0].message);
    }

    _isLoading = false;
    notifyListeners();

    return responseModel;
  }
}
