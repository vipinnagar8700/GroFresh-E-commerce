import 'package:flutter/material.dart';
import 'package:flutter_grocery/features/auth/providers/auth_provider.dart';
import 'package:flutter_grocery/utill/styles.dart';
import 'package:flutter_grocery/common/widgets/custom_loader_widget.dart';
import 'package:provider/provider.dart';
import '../../../utill/dimensions.dart';
import '../../../common/widgets/custom_button_widget.dart';

class AccountDeleteDialogWidget extends StatelessWidget {
  final bool isFailed;
  final double rotateAngle;
  final IconData icon;
  final String? title;
  final String? description;
  final Function onTapTrue;
  final String? onTapTrueText;
  final Function onTapFalse;
  final String? onTapFalseText;
  const AccountDeleteDialogWidget({Key? key, this.isFailed = false, this.rotateAngle = 0, required this.icon, required this.title, required this.description,required this.onTapFalse,required this.onTapTrue, this.onTapTrueText, this.onTapFalseText}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      child: Consumer<AuthProvider>(
        builder: (context, authProvider, _) {
          return Container(
            width: 300,
            padding: const EdgeInsets.all(Dimensions.paddingSizeLarge),
            child: Stack(clipBehavior: Clip.none, children: [

              Positioned(
                left: 0, right: 0, top: -55,
                child: Container(
                  height: 80,
                  width: 80,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(color: isFailed ? Theme.of(context).colorScheme.error : Theme.of(context).primaryColor, shape: BoxShape.circle),
                  child: Transform.rotate(angle: rotateAngle, child: Icon(icon, size: 40, color: Colors.white)),
                ),
              ),

              Padding(
                padding: const EdgeInsets.only(top: 40),
                child: Column(mainAxisSize: MainAxisSize.min, children: [
                  Text(title ?? '', style: poppinsRegular.copyWith(fontSize: Dimensions.fontSizeLarge)),
                  const SizedBox(height: Dimensions.paddingSizeSmall),
                  Text(description!, textAlign: TextAlign.center, style: poppinsRegular),
                  const SizedBox(height: Dimensions.paddingSizeLarge),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 0),
                    child: Row(
                      children: [

                        Expanded(child: CustomButtonWidget(buttonText: onTapFalseText, onPressed: authProvider.isLoading ? null : onTapFalse)),
                        const SizedBox(width: 10,),

                        Expanded(child: authProvider.isLoading ? Center(child: CustomLoaderWidget(color: Theme.of(context).primaryColor)) :  CustomButtonWidget(buttonText: onTapTrueText, onPressed: onTapTrue)),
                      ],
                    ),
                  ),
                ]),
              ),

            ]),
          );
        }
      ),
    );
  }
}
