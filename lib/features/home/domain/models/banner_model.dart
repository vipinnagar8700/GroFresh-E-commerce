
class BannerModel {
    String? id;
    String? tittle;
    String? itemType;
    String? productName;
    String? categoryName;
    String? status;
    String? image;
    String? createdAt;
    String? updatedAt;
    int? v;

    BannerModel({this.id, this.tittle, this.itemType, this.productName, this.categoryName, this.status, this.image, this.createdAt, this.updatedAt, this.v});

    BannerModel.fromJson(Map<String, dynamic> json) {
        id = json["_id"];
        tittle = json["tittle"];
        itemType = json["Item_type"];
        productName = json["Product_name"];
        categoryName = json["Category_name"];
        status = json["status"];
        image = json["image"];
        createdAt = json["createdAt"];
        updatedAt = json["updatedAt"];
        v = json["__v"];
    }

    Map<String, dynamic> toJson() {
        final Map<String, dynamic> _data = <String, dynamic>{};
        _data["_id"] = id;
        _data["tittle"] = tittle;
        _data["Item_type"] = itemType;
        _data["Product_name"] = productName;
        _data["Category_name"] = categoryName;
        _data["status"] = status;
        _data["image"] = image;
        _data["createdAt"] = createdAt;
        _data["updatedAt"] = updatedAt;
        _data["__v"] = v;
        return _data;
    }
}