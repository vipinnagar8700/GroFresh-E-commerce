
const {
  User,
} = require("../models/userModel");
require("dotenv/config");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "durzgbfjf",
  api_key: "512412315723482",
  api_secret: "e3kLlh_vO5XhMBCMoIjkbZHjazo",
});

const edit_admin_profile = async (req, res) => {
    const { id } = req.params;
    try {
      const editUser = await User.findById( id ); // Exclude the 'password' field
      if (!editUser) {
        res.status(200).json({
          message: "Admin was not found!",
          status:false
        });
      } else {
        res.status(201).json({
          message: "Data successfully Retrieved!",
          success: true,
          data: editUser,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Failed to retrieve Data!",
        status: false,
      });
    }
  };
  // Multer configuration
  
  const Update_admin_profile = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body; // Assuming you send the updated data in the request body
    const file = req.file;
  
  if (file) {
      try {
          const result = await cloudinary.uploader.upload(file.path, {
              folder: 'LifeCareSolution_admin', // Optional: You can specify a folder in your Cloudinary account
              resource_type: 'auto', // Automatically detect the file type
          });
  
          updateData.image = result.secure_url;
      } catch (error) {
          console.error('Error uploading image to Cloudinary:', error);
          // Handle the error appropriately
      }
  }
  
  const domain = 'https://viplifecaresolution.onrender.com';
  
  // Replace backslashes with forward slashes and remove leading './'
  const relativePath = file.path.replace(/\\/g, '/').replace(/^\.\//, '');
  
  // Construct the full image URL
  const imageUrl = `${domain}/${relativePath}`;
  
  console.log(imageUrl);
  
    delete updateData.role;
  
    try {
      const editUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
      }).select("-password");
  
      if (!editUser) {
        res.status(200).json({
          message: "admin was not found!",
        });
      } else {
        res.status(201).json({
          message: "Data successfully updated!",
          success: true,
          data: editUser,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Failed to update data!",
        status: false,
      });
    }
  };



  const configApi =async(req, res)=>{
try {
  const data ={
    "ecommerce_name": "GroFresh",
    "ecommerce_logo": "2023-11-21-655c755267e93.png",
    "ecommerce_address": "Noida Up India",
    "ecommerce_phone": "+8801700000000",
    "ecommerce_email": "vipinnagar8700@gmail.com",
    "ecommerce_location_coverage": {
        "longitude": "90.3796523012575",
        "latitude": "23.83899440413541",
        "coverage": 1000
    },
    "minimum_order_value": 100,
    "self_pickup": 1,
    "base_urls": {
        "product_image_url": "https://grofresh-e-commerce.onrender.com/",
        "customer_image_url": "https://grofresh-e-commerce.onrender.com/",
        "banner_image_url": "https://grofresh-e-commerce.onrender.com/",
        "category_image_url": "https://grofresh-e-commerce.onrender.com/",
        "review_image_url": "https://grofresh-e-commerce.onrender.com/",
        "notification_image_url": "https://grofresh-e-commerce.onrender.com/",
        "ecommerce_image_url": "https://grofresh-e-commerce.onrender.com/",
        "delivery_man_image_url": "https://grofresh-e-commerce.onrender.com/",
        "chat_image_url": "https://grofresh-e-commerce.onrender.com/",
        "flash_sale_image_url": "https://grofresh-e-commerce.onrender.com/",
        "gateway_image_url": "https://grofresh-e-commerce.onrender.com/",
        "payment_image_url": "https://grofresh-e-commerce.onrender.com/",
        "order_image_url": "https://grofresh-e-commerce.onrender.com/"
    },
    "currency_symbol": "$",
    "delivery_charge": 10,
    "delivery_management": {
        "status": 1,
        "min_shipping_charge": 10,
        "shipping_per_km": 2
    },
    "branches": [
        {
            "id": 1,
            "name": "Main",
            "email": "vipinnagar8700@gmail.com",
            "longitude": "77.7108686",
            "latitude": "28.9104503",
            "address": "Jhatta Noida GB Nagar",
            "coverage": 1000,
            "status": 1
        },
    ],
    "terms_and_conditions": "<h2>What is Lorem Ipsum?</h2>\r\n\r\n<p><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&#39;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\r\n\r\n<h2>Why do we use it?</h2>\r\n\r\n<p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using &#39;Content here, content here&#39;, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for &#39;lorem ipsum&#39; will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>",
    "privacy_policy": "<h2>Where does it come from?</h2>\r\n\r\n<p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of &quot;de Finibus Bonorum et Malorum&quot; (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, &quot;Lorem ipsum dolor sit amet..&quot;, comes from a line in section 1.10.32.</p>\r\n\r\n<p>The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from &quot;de Finibus Bonorum et Malorum&quot; by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.</p>\r\n\r\n<h2>Where does it come from?</h2>\r\n\r\n<p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of &quot;de Finibus Bonorum et Malorum&quot; (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, &quot;Lorem ipsum dolor sit amet..&quot;, comes from a line in section 1.10.32.</p>\r\n\r\n<p>The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from &quot;de Finibus Bonorum et Malorum&quot; by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.</p>\r\n\r\n<h2>What is Lorem Ipsum?</h2>\r\n\r\n<p><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&#39;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\r\n\r\n<h2>Why do we use it?</h2>\r\n\r\n<p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using &#39;Content here, content here&#39;, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for &#39;lorem ipsum&#39; will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>",
    "about_us": "<h2>What is Lorem Ipsum?</h2>\r\n\r\n<p><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&#39;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\r\n\r\n<h2>Why do we use it?</h2>\r\n\r\n<p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using &#39;Content here, content here&#39;, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for &#39;lorem ipsum&#39; will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<h2>Where does it come from?</h2>\r\n\r\n<p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of &quot;de Finibus Bonorum et Malorum&quot; (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, &quot;Lorem ipsum dolor sit amet..&quot;, comes from a line in section 1.10.32.</p>\r\n\r\n<p>The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from &quot;de Finibus Bonorum et Malorum&quot; by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.</p>",
    "faq": "<ul>\r\n\t<li><strong>Can orders be placed using Grofresh&nbsp;App?</strong>\r\n\t<ul>\r\n\t\t<li>Yes, Orders can be placed with the Grofresh app.</li>\r\n\t</ul>\r\n\t</li>\r\n</ul>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<ul>\r\n\t<li><strong>Is it important for me to educate the customer before placing an order?</strong>\r\n\r\n\t<ul>\r\n\t\t<li>Yes, it is essential that you first educate your customer and tell them how to place the order, how to change the order, and how to return it as well. You have to guide them properly because the better you guide and convince them, the greater the chance of them making a purchase from Grofresh</li>\r\n\t</ul>\r\n\t</li>\r\n</ul>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<ul>\r\n\t<li><strong>Why do my orders get canceled?</strong>\r\n\r\n\t<ul>\r\n\t\t<li>Orders get canceled because of the following reasons:\r\n\t\t<ul>\r\n\t\t\t<li>Cancelation from the customer side.</li>\r\n\t\t\t<li>The system recognizes it as a fraud order.</li>\r\n\t\t</ul>\r\n\t\t</li>\r\n\t</ul>\r\n\t</li>\r\n</ul>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p>&nbsp;</p>",
    "email_verification": false,
    "phone_verification": false,
    "currency_symbol_position": "right",
    "maintenance_mode": false,
    "country": "BD",
    "play_store_config": {
        "status": true,
        "link": "https://drive.google.com/file/d/1Vp5xa8R7GVnGveoBW1lAKSpJeNkLagMC/view?usp=sharing",
        "min_version": "1"
    },
    "app_store_config": {
        "status": true,
        "link": "https://drive.google.com/file/d/1WKXV_O6tZS1ogVsHxsGb489jB-UeiQ-6/view?usp=sharing",
        "min_version": "1"
    },
    "social_media_link": [
        {
            "id": 5,
            "name": "twitter",
            "link": "https://twitter.com/6amTech",
            "status": 1,
            "created_at": null,
            "updated_at": null
        },
        {
            "id": 4,
            "name": "instagram",
            "link": "https://www.instagram.com/",
            "status": 1,
            "created_at": null,
            "updated_at": null
        },
        {
            "id": 3,
            "name": "linkedin",
            "link": "https://www.linkedin.com/",
            "status": 1,
            "created_at": null,
            "updated_at": null
        },
        {
            "id": 2,
            "name": "pinterest",
            "link": "https://www.pinterest.com/login/",
            "status": 1,
            "created_at": null,
            "updated_at": null
        },
        {
            "id": 1,
            "name": "facebook",
            "link": "https://www.facebook.com/",
            "status": 1,
            "created_at": null,
            "updated_at": "2022-03-01T22:03:17.000000Z"
        }
    ],
    "software_version": "7.3",
    "footer_text": "Copyright © 2023, groFresh",
    "decimal_point_settings": "2",
    "time_format": "12",
    "social_login": {
        "google": 1,
        "facebook": 0
    },
    "wallet_status": 1,
    "loyalty_point_status": 1,
    "ref_earning_status": 1,
    "loyalty_point_exchange_rate": 1,
    "ref_earning_exchange_rate": 100,
    "loyalty_point_item_purchase_point": 200,
    "loyalty_point_minimum_point": 10,
    "free_delivery_over_amount": 2000,
    "maximum_amount_for_cod_order": 10000,
    "cookies_management": {
        "status": 1,
        "text": "Allow Cookies for this site"
    },
    "product_vat_tax_status": "excluded",
    "maximum_amount_for_cod_order_status": 1,
    "free_delivery_over_amount_status": 0,
    "cancellation_policy": "<h2>What is Lorem Ipsum?</h2>\r\n\r\n<p><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&#39;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\r\n\r\n<h2>Why do we use it?</h2>\r\n\r\n<p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using &#39;Content here, content here&#39;, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for &#39;lorem ipsum&#39; will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>",
    "refund_policy": "<h2>What is Lorem Ipsum?</h2>\r\n\r\n<p><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&#39;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\r\n\r\n<h2>Why do we use it?</h2>\r\n\r\n<p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using &#39;Content here, content here&#39;, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for &#39;lorem ipsum&#39; will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>",
    "return_policy": "<h2>What is Lorem Ipsum?</h2>\r\n\r\n<p><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&#39;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\r\n\r\n<h2>Why do we use it?</h2>\r\n\r\n<p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using &#39;Content here, content here&#39;, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for &#39;lorem ipsum&#39; will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>",
    "cancellation_policy_status": 0,
    "refund_policy_status": 0,
    "return_policy_status": 0,
    "whatsapp": {
        "status": "0",
        "number": ""
    },
    "telegram": {
        "status": "0",
        "user_name": ""
    },
    "messenger": {
        "status": "0",
        "user_name": ""
    },
    "featured_product_status": 1,
    "trending_product_status": 1,
    "most_reviewed_product_status": 1,
    "recommended_product_status": 1,
    "flash_deal_product_status": 0,
    "toggle_dm_registration": 1,
    "otp_resend_time": 60,
    "digital_payment_info": {
        "digital_payment": "true",
        "plugin_payment_gateways": "false",
        "default_payment_gateways": "true"
    },
    "digital_payment_status": 1,
    "active_payment_method_list": [
        {
            "gateway": "paypal",
            "gateway_title": "Paypal",
            "gateway_image": "2023-10-21-6533656fbc088.png"
        },
        {
            "gateway": "stripe",
            "gateway_title": "Stripe",
            "gateway_image": "2023-10-21-6533659902123.png"
        },
        {
            "gateway": "razor_pay",
            "gateway_title": "Razor pay",
            "gateway_image": "2023-10-21-653365ae81dc8.png"
        },
        {
            "gateway": "ssl_commerz",
            "gateway_title": "Ssl commerz",
            "gateway_image": "2023-10-21-6533661948dc4.png"
        }
    ],
    "cash_on_delivery": "true",
    "digital_payment": "true",
    "offline_payment": "true",
    "guest_checkout": 1,
    "partial_payment": 1,
    "partial_payment_combine_with": "all",
    "add_fund_to_wallet": 1,
    "apple_login": {
        "login_medium": "apple",
        "status": 0,
        "client_id": ""
    },
    "firebase_otp_verification_status": 0,
    "customer_verification": {
        "status": 0,
        "type": ""
    },
    "order_image_status": 1,
    "order_image_label_name": "Order Image"
}
res.json(data);
} catch (error) {
  res.status(500).json({
    message: "Failed to get data!",
    status: false,
  });
}
  }

  module.exports = {
    Update_admin_profile,edit_admin_profile,configApi
  };
  