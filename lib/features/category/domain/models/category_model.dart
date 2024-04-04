
class CategoryModel {
    int? parentId;
    int? position;
    List<dynamic>? translations;
    String? status;
    String? id;
    String? categoryName;
    int? v;
    String? image;
    String? createdAt;
    String? updatedAt;

    CategoryModel({this.parentId, this.position, this.translations, this.status, this.id, this.categoryName, this.v, this.image, this.createdAt, this.updatedAt});

    CategoryModel.fromJson(Map<String, dynamic> json) {
        parentId = json["parent_id"];
        position = json["position"];
        translations = json["translations"] ?? [];
        status = json["status"];
        id = json["_id"];
        categoryName = json["Category_name"];
        v = json["__v"];
        image = json["image"];
        createdAt = json["createdAt"];
        updatedAt = json["updatedAt"];
    }

    Map<String, dynamic> toJson() {
        final Map<String, dynamic> _data = <String, dynamic>{};
        _data["parent_id"] = parentId;
        _data["position"] = position;
        if(translations != null) {
            _data["translations"] = translations;
        }
        _data["status"] = status;
        _data["_id"] = id;
        _data["Category_name"] = categoryName;
        _data["__v"] = v;
        _data["image"] = image;
        _data["createdAt"] = createdAt;
        _data["updatedAt"] = updatedAt;
        return _data;
    }
}