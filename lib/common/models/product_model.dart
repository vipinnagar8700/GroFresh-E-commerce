import 'dart:convert';




class ProductModel {
  int? totalSize;
  int? limit;
  int? offset;
  FlashDeal? flashDeal;
  List<Product>? products;
  double? minPrice;
  double? maxPrice;

  ProductModel({this.totalSize, this.limit, this.offset, this.products, this.maxPrice, this.minPrice});



  ProductModel.fromJson(Map<String, dynamic> json) {
    totalSize = int.tryParse('${json['total_size']}');
    limit = int.tryParse('${json['limit']}');
    offset = int.tryParse('${json['offset']}');
    minPrice = double.tryParse('${json['lowest_price']}') ?? 0;
    maxPrice = double.tryParse('${json['highest_price']}') ?? 0;

    flashDeal = json['flash_deal'] != null
        ? FlashDeal.fromJson(json['flash_deal'])
        : null;

    if (json['products'] != null) {
      products = [];
      json['products'].forEach((v) {
        products!.add(Product.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['total_size'] = totalSize;
    data['limit'] = totalSize;
    data['offset'] = offset;
    if (products != null) {
      data['products'] = products!.map((v) => v.toJson()).toList();
    }
    data['highest_price'] = maxPrice;
    data['lowest_price'] = minPrice;

    return data;
  }
}

class Product {
  int? _id;
  String? _name;
  String? _description;
  List<String>? _image;
  double? _price;
  List<Variations>? _variations;
  double? _tax;
  int? _status;
  String? _createdAt;
  String? _updatedAt;
  List<String>? _attributes;
  List<CategoryIds>? _categoryIds;
  List<ChoiceOptions>? _choiceOptions;
  double? _discount;
  String? _discountType;
  String? _taxType;
  String? _unit;
  double? _capacity;
  int? _totalStock;
  List<Rating>? _rating;
  List<ActiveReview>? _activeReviews;
  int? _maximumOrderQuantity;
  CategoryDiscount? _categoryDiscount;

  Product(
      {int? id,
        String? name,
        String? description,
        List<String>? image,
        double? price,
        List<Variations>? variations,
        double? tax,
        int? status,
        String? createdAt,
        String? updatedAt,
        List<String>? attributes,
        List<CategoryIds>? categoryIds,
        List<ChoiceOptions>? choiceOptions,
        double? discount,
        String? discountType,
        String? taxType,
        String? unit,
        double? capacity,
        int? totalStock,
        List<void>? rating,
        int? maximumOrderQuantity,
        CategoryDiscount? categoryDiscount,
      }) {
    _id = id;
    _name = name;
    _description = description;
    _image = image;
    _price = price;
    _variations = variations;
    _tax = tax;
    _status = status;
    _createdAt = createdAt;
    _updatedAt = updatedAt;
    _attributes = attributes;
    _categoryIds = categoryIds;
    _choiceOptions = choiceOptions;
    _discount = discount;
    _discountType = discountType;
    _taxType = taxType;
    _unit = unit;
    _capacity = capacity;
    _totalStock = totalStock;
    _rating = rating as List<Rating>?;
    _maximumOrderQuantity = maximumOrderQuantity;
    _categoryDiscount = categoryDiscount;
  }

  int? get id => _id;
  String? get name => _name;
  String? get description => _description;
  List<String>? get image => _image;
  double? get price => _price;
  List<Variations>? get variations => _variations;
  double? get tax => _tax;
  int? get status => _status;
  String? get createdAt => _createdAt;
  String? get updatedAt => _updatedAt;
  List<String>? get attributes => _attributes;
  List<CategoryIds>? get categoryIds => _categoryIds;
  List<ChoiceOptions>? get choiceOptions => _choiceOptions;
  double? get discount => _discount;
  String? get discountType => _discountType;
  String? get taxType => _taxType;
  String? get unit => _unit;
  double? get capacity => _capacity;
  int? get totalStock => _totalStock;
  List<Rating>? get rating => _rating;
  List<ActiveReview>? get activeReviews => _activeReviews;
  int? get maximumOrderQuantity => _maximumOrderQuantity;
  CategoryDiscount? get categoryDiscount => _categoryDiscount;

  Product.fromJson(Map<String, dynamic> json) {
    _id = json['id'];
    _name = json['name'];
    _description = json['description'];
    _image = json['image'].cast<String>();
    _price = json['price'].toDouble();
    if (json['variations'] != null) {
      _variations = [];
      json['variations'].forEach((v) {
        _variations!.add(Variations.fromJson(v));
      });
    }
    _tax = json['tax'].toDouble();
    _status = json['status'];
    _createdAt = json['created_at'];
    _updatedAt = json['updated_at'];
    _attributes = json['attributes'].cast<String>();
    if (json['category_ids'] != null) {
      _categoryIds = [];
      json['category_ids'].forEach((v) {
        _categoryIds!.add(CategoryIds.fromJson(v));
      });
    }
    if (json['choice_options'] != null) {
      _choiceOptions = [];
      json['choice_options'].forEach((v) {
        _choiceOptions!.add(ChoiceOptions.fromJson(v));
      });
    }
    _discount = json['discount'].toDouble();
    _discountType = json['discount_type'];
    _taxType = json['tax_type'];
    _unit = json['unit'];
    _capacity = json['capacity'] != null ? json['capacity'].toDouble() : json['capacity'];
    _totalStock = json['total_stock'];
    if (json['rating'] != null) {
      _rating = [];
      json['rating'].forEach((v) {
        _rating!.add(Rating.fromJson(v));
      });
    }

    if (json['active_reviews'] != null) {

      _activeReviews =  [];
      json['active_reviews'].forEach((v) {
        _activeReviews!.add(ActiveReview.fromJson(v));
      });
    }
    _maximumOrderQuantity = int.tryParse('${json['maximum_order_quantity']}');
    _categoryDiscount = json['category_discount'] != null
        ?  CategoryDiscount.fromJson(json['category_discount'])
        : null;

  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['id'] = _id;
    data['name'] = _name;
    data['description'] = _description;
    data['image'] = _image;
    data['price'] = _price;
    if (_variations != null) {
      data['variations'] = _variations!.map((v) => v.toJson()).toList();
    }
    data['tax'] = _tax;
    data['status'] = _status;
    data['created_at'] = _createdAt;
    data['updated_at'] = _updatedAt;
    data['attributes'] = _attributes;
    if (_categoryIds != null) {
      data['category_ids'] = _categoryIds!.map((v) => v.toJson()).toList();
    }
    if (_choiceOptions != null) {
      data['choice_options'] =
          _choiceOptions!.map((v) => v.toJson()).toList();
    }
    data['discount'] = _discount;
    data['discount_type'] = _discountType;
    data['tax_type'] = _taxType;
    data['unit'] = _unit;
    data['capacity'] = _capacity;
    data['total_stock'] = _totalStock;
     if (_rating != null) {
      data['rating'] = _rating!.map((v) => v.toJson()).toList();
    }
    data['maximum_order_quantity'] = _maximumOrderQuantity;
    if (_categoryDiscount != null) {
      data['category_discount'] = _categoryDiscount!.toJson();
    }

    return data;
  }
}

class Variations {
  String? _type;
  double? _price;
  int? _stock;

  Variations({String? type, double? price, int? stock}) {
    _type = type;
    _price = price;
    _stock = stock;
  }

  String? get type => _type;
  double? get price => _price;
  int? get stock => _stock;

  Variations.fromJson(Map<String, dynamic> json) {
    _type = json['type'];
    _price = json['price'].toDouble();
    _stock = json['stock'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['type'] = _type;
    data['price'] = _price;
    data['stock'] = _stock;
    return data;
  }
}

class CategoryIds {
  String? _id;

  CategoryIds({String? id}) {
    _id = id;
  }

  String? get id => _id;

  CategoryIds.fromJson(Map<String, dynamic> json) {
    _id = json['id'].toString();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['id'] = _id;
    return data;
  }
}

class ChoiceOptions {
  String? _name;
  String? _title;
  List<String>? _options;

  ChoiceOptions({String? name, String? title, List<String>? options}) {
    _name = name;
    _title = title;
    _options = options;
  }

  String? get name => _name;
  String? get title => _title;
  List<String>? get options => _options;

  ChoiceOptions.fromJson(Map<String, dynamic> json) {
    _name = json['name'];
    _title = json['title'];
    _options = json['options'].cast<String>();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['name'] = _name;
    data['title'] = _title;
    data['options'] = _options;
    return data;
  }
}
class Rating {
  String? _average;

  Rating({String? average}) {
    _average = average;
  }

  String? get average => _average;

  Rating.fromJson(Map<String, dynamic> json) {
    _average = json['average'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['average'] = _average;
    return data;
  }
}

class ActiveReview {
  ActiveReview({
    this.id,
    this.productId,
    this.userId,
    this.comment,
    this.attachment,
    this.rating,
    this.isActive,
    this.createdAt,
    this.updatedAt,
    this.orderId,
    this.customer,
  });

  int? id;
  int? productId;
  int? userId;
  String? comment;
  String? attachment;
  int? rating;
  int? isActive;
  String? createdAt;
  String? updatedAt;
  int? orderId;
  Customer? customer;

  factory ActiveReview.fromRawJson(String str) => ActiveReview.fromJson(json.decode(str));


  factory ActiveReview.fromJson(Map<String, dynamic> json) => ActiveReview(
    id: json["id"],
    productId: json["product_id"],
    userId: json["user_id"],
    comment: json["comment"],
    attachment: json["attachment"],
    rating: json["rating"],
    isActive: json["is_active"],
    createdAt: json["created_at"],
    updatedAt: json["updated_at"],
    orderId: json["order_id"],
    customer:json['customer'] != null
        ? Customer.fromJson(json['customer']) : null,
  );

  Map<String, dynamic> toJson() => {
    "id": id,
    "product_id": productId,
    "user_id": userId,
    "comment": comment,
    "attachment": attachment,
    "rating": rating,
    "is_active": isActive,
    "created_at": createdAt,
    "updated_at": updatedAt,
    "order_id": orderId,
    "customer": customer,
  };
}



class Customer {
  String? fName;
  String? lName;
  String? email;
  String? image;

  Customer(
      {
        this.fName,
        this.lName,
        this.email,
        this.image,
      });

  Customer.fromJson(Map<String, dynamic> json) {

    fName = json['f_name'];
    lName = json['l_name'];
    email = json['email'];
    image = json['image'];

  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};

    data['f_name'] = fName;
    data['l_name'] = lName;
    data['email'] = email;
    data['image'] = image;
    return data;
  }
}

class CategoryDiscount {
  String? id;
  String? categoryId;
  String? discountType;
  double? discountAmount;
  double? maximumAmount;

  CategoryDiscount({
    this.id,
    this.categoryId,
    this.discountType,
    this.discountAmount,
    this.maximumAmount,
  });

  CategoryDiscount.fromJson(Map<String, dynamic> json) {
    id = json['id'].toString();
    categoryId = json['category_id'].toString();
    discountType = json['discount_type'].toString();
    discountAmount = double.tryParse('${json['discount_amount']}');
    maximumAmount = double.tryParse('${json['maximum_amount']}');
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['id'] = id;
    data['category_id'] = categoryId;
    data['discount_type'] = discountType;
    data['discount_amount'] = discountAmount;
    data['maximum_amount'] = maximumAmount;
    return data;
  }
}

class FlashDeal {
  int? _id;
  String? _title;
  String? _startDate;
  String? _endDate;
  int? _status;
  int? _featured;
  String? _backgroundColor;
  String? _textColor;
  String? _banner;
  String? _slug;
  String? _createdAt;
  String? _updatedAt;
  int? _productId;
  String? _dealType;

  FlashDeal(
      {int? id,
        String? title,
        String? startDate,
        String? endDate,
        int? status,
        int? featured,
        String? backgroundColor,
        String? textColor,
        String? banner,
        String? slug,
        String? createdAt,
        String? updatedAt,
        int? productId,
        String? dealType}) {
    _id = id;
    _title = title;
    _startDate = startDate;
    _endDate = endDate;
    _status = status;
    _featured = featured;
    _backgroundColor = backgroundColor;
    _textColor = textColor;
    _banner = banner;
    _slug = slug;
    _createdAt = createdAt;
    _updatedAt = updatedAt;
    _productId = productId;
    _dealType = dealType;
  }

  int? get id => _id;
  String? get title => _title;
  String? get startDate => _startDate;
  String? get endDate => _endDate;
  int? get status => _status;
  int? get featured => _featured;
  String? get backgroundColor => _backgroundColor;
  String? get textColor => _textColor;
  String? get banner => _banner;
  String? get slug => _slug;
  String? get createdAt => _createdAt;
  String? get updatedAt => _updatedAt;
  int? get productId => _productId;
  String? get dealType => _dealType;

  FlashDeal.fromJson(Map<String, dynamic> json) {
    _id = json['id'];
    _title = json['title'];
    _startDate = json['start_date'];
    _endDate = json['end_date'];
    _status = json['status'];
    _featured = json['featured'];
    _backgroundColor = json['background_color'];
    _textColor = json['text_color'];
    _banner = json['image'];
    _slug = json['slug'];
    _createdAt = json['created_at'];
    _updatedAt = json['updated_at'];
    _productId = json['product_id'];
    _dealType = json['deal_type'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['id'] = _id;
    data['title'] = _title;
    data['start_date'] = _startDate;
    data['end_date'] = _endDate;
    data['status'] = _status;
    data['featured'] = _featured;
    data['background_color'] = _backgroundColor;
    data['text_color'] = _textColor;
    data['image'] = _banner;
    data['slug'] = _slug;
    data['created_at'] = _createdAt;
    data['updated_at'] = _updatedAt;
    data['product_id'] = _productId;
    data['deal_type'] = _dealType;
    return data;
  }
}
