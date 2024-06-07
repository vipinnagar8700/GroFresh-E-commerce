const express = require('express')
const { authenticateToken } = require('../config/JwtToken');
const { register, login, AllUsers, editUser, UpdateUsers, deleteUser, Accept_User, changePassword, register_admin, ResetPassword, New_password, AllUsers_role, loginWithOTP, generateAndSendOTP, login_fb, login_google, SendEmail, Userme, AllDeliveryMan } = require('../controllers/userController');
const { editDoctor, UpdateDoctor, deleteDoctor, AllDoctors, UpdateDoctorSocail_Media, UpdateDoctorBankDetails, deleteDoctorAwards, deleteDoctorEducation, deleteDoctorExperience, deleteClinicImage, FilterDoctors, search_specialities, AllDoctorPermitted, AllDoctorApproved, AllDoctorBlocked, AllDoctorPending, deleteDoctorBlock } = require('../controllers/doctorController');
// Multer configuration
const path = require('path');
const multer = require('multer');
const { createProductCategory, singleProductCategory, deleteProductCategory, updateProductCategory, allProductCategories, updateProductCategoryStatus, updateProductCategoryPriority } = require('../controllers/ProductCategoryController');
const { createProductSubCategory, singleProductSubCategory, updateProductSubCategory, deleteProductSubCategory, allProductSubCategories, updateSubProductCategoryStatus, singleProductSubCategory_category } = require('../controllers/ProductSubCategoryController');
const { createProduct, singleProduct, deleteProduct, updateProduct, AllProduct, AllFeaturedProduct, AllDailyNeedProduct, ProductFilter, AllCategoryClilds, AllSubCategoryClilds } = require('../controllers/ProductController');
const { createattribute, singleattribute, deleteattribute, updateattribute, allProductattribute } = require('../controllers/ProductCategoryController copy');
const { createBanner, allProductBanner, singleBanner, updateBanner, deleteBanner } = require('../controllers/BannerController');
const { configApi } = require('../controllers/adminController');
const { addProductToWishlist, listWishlistProducts, removeProductFromWishlist, listWishlistProducts_all } = require('../controllers/WishlistController');
const { addToCart, listCartProducts, deleteFromCart, decreaseProductQuantity } = require('../controllers/CartController');
const { createOrderFromCart, allOrder, CustomerOrder, get_single_Order, Update_Order_status, Update_Order_payment_status, get_single_Order_track } = require('../controllers/OrderController');
const { addCoupon, getCoupons, getSingleCoupon, updateCoupon, deleteCoupon } = require('../controllers/CoupenController');
const { AllReviews, addReview } = require('../controllers/ReviewSController');
const { deleteFlashDealById, updateFlashDealById, getFlashDealById, getAllFlashDeals, createFlashDeal } = require('../controllers/FlashDealController');
const { deleteDeliveryTimeSlotById, updateDeliveryTimeSlotById, getDeliveryTimeSlotById, getAllDeliveryTimeSlots, createDeliveryTimeSlot } = require('../controllers/DeliveryTimeSlotController');
const { AllAgents, createUserByAgent, getAllUsersByAgent } = require('../controllers/AgentController');
const { addAddress, getAddressByUserId, updateAddress, deleteAddress } = require('../controllers/addressController');

const storage = multer.diskStorage({
    destination: './public/images', // Specify the destination folder
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Set file size limit (optional)
});


const router = express.Router();


// User Auth 
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/config',configApi);
router.get('/Userme',authenticateToken,Userme);

// Delivery
router.post('/auth/delivery-man/register', register);
router.post('/auth/delivery-man/login', login);
router.get('/delivery-man/profile?token=',authenticateToken,Userme);

router.get('/AllUsers_role',AllUsers_role)
router.get('/AllUsers',AllUsers)
router.get('/AllDeliveryMan',AllDeliveryMan)

// router.post('/loginWithOTP',loginWithOTP)
// router.post('/generateAndSendOTP',generateAndSendOTP)
// router.post('/login_fb',login_fb)
// router.post('/login_google',login_google)

//  Product Category
router.post('/createProductCategory',upload.single('image'), createProductCategory);
router.get('/singleProductCategory/:id', singleProductCategory);
router.put('/updateProductCategory/:id', upload.single('image'), updateProductCategory);
router.delete('/deleteProductCategory/:id', deleteProductCategory);
router.get('/categories',allProductCategories);
router.put('/updateProductCategoryStatus/:id',updateProductCategoryStatus);
router.put('/updateProductCategoryPriority/:id',updateProductCategoryPriority);

// Product Sub Category
router.post('/createProductSubCategory',upload.single('image'), createProductSubCategory);
router.get('/singleProductSubCategory/:id', singleProductSubCategory);
router.put('/updateProductSubCategory/:id', upload.single('image'), updateProductSubCategory);
router.delete('/deleteProductSubCategory/:id', deleteProductSubCategory);
router.get('/allProductSubCategories',allProductSubCategories);
router.put('/updateSubProductCategoryStatus/:id',updateSubProductCategoryStatus);
router.get('/singleProductSubCategory_category/:id',singleProductSubCategory_category);

// Products;
router.post('/createProduct',upload.single('image'), createProduct);
router.get('/products/details/:id', singleProduct);
router.put('/updateProduct/:id', upload.single('image'), updateProduct);
router.delete('/deleteProduct/:id',authenticateToken, deleteProduct);
router.get('/AllProduct',AllProduct) ;
router.get('/products/featured',AllFeaturedProduct);
router.get('/products/daily-needs',AllDailyNeedProduct);
router.get('/products/search',ProductFilter);
router.get('/categories/childes/:id',AllCategoryClilds);
router.get('/categories/products/:id',AllSubCategoryClilds);

// Product Attributes
router.post('/createattribute', createattribute)
router.get('/singleattribute/:id', singleattribute)
router.put('/updateattribute/:id', upload.single('image'), updateattribute)
router.delete('/deleteattribute/:id', deleteattribute)
router.get('/allProductattribute',allProductattribute)

// Product Banner
router.post('/createBanner', upload.single('image'),createBanner)
router.get('/singleBanner/:id', singleBanner)
router.put('/updateBanner/:id', upload.single('image'),authenticateToken, updateBanner)
router.delete('/deleteBanner/:id',authenticateToken, deleteBanner)
router.get('/banners',allProductBanner)

// Wishlist
router.post('/products/favorite',authenticateToken,addProductToWishlist);
router.get('/products/favorite',authenticateToken,listWishlistProducts);
router.get('/products/favorite/:id',authenticateToken,removeProductFromWishlist);
router.get('/products/favorite-all',listWishlistProducts_all);

// Cart
router.post('/addToCart',authenticateToken,addToCart)
router.get('/listCartProducts',authenticateToken,listCartProducts)
router.get('/deleteFromCart/:id',authenticateToken,deleteFromCart)
router.post('/decreaseProductQuantity',authenticateToken,decreaseProductQuantity)

// Order
router.post('/customer/order/place',authenticateToken,createOrderFromCart)
router.get('/allOrder',allOrder);
router.get('/get_single_Order/:id',get_single_Order);
router.get('/customer/order/track/:id',authenticateToken,get_single_Order_track);
router.put('/Update_Order_status/:id',Update_Order_status);
router.put('/Update_Order_payment_status/:id',Update_Order_payment_status);


router.get('/customer/order/list',authenticateToken,CustomerOrder)
router.post('/addCoupon', addCoupon);
router.get('/getCoupons', getCoupons);
router.get('/getSingleCoupon/:id', getSingleCoupon);
router.patch('/updateCoupon/:id', updateCoupon);
router.delete('/deleteCoupon/:id', deleteCoupon);

// Reviews
router.post('/products/reviews/submit',authenticateToken,addReview)
router.get('/AllReviews',AllReviews);

// FlashDeal
router.post('/createFlashDeal', createFlashDeal);
router.get('/flash-deals', getAllFlashDeals);
router.get('/getFlashDealById/:id',getFlashDealById);
router.put('/updateFlashDealById/:id', updateFlashDealById);
router.delete('/deleteFlashDealById/:id', deleteFlashDealById);

// DeliveryTimeSlot
router.post('/createDeliveryTimeSlot', createDeliveryTimeSlot);
router.get('/getAllDeliveryTimeSlots', getAllDeliveryTimeSlots);
router.get('/getDeliveryTimeSlotById/:id',getDeliveryTimeSlotById);
router.put('/updateDeliveryTimeSlotById/:id', updateDeliveryTimeSlotById);
router.delete('/deleteDeliveryTimeSlotById/:id', deleteDeliveryTimeSlotById);
router.get('/AllAgents',AllAgents)
router.get('/getAllUsersByAgent/:id',getAllUsersByAgent)
router.post('/createUserByAgent',createUserByAgent)

// Address
router.post('/customer/address/add', authenticateToken,addAddress);
router.get('/customer/address/list',authenticateToken, getAddressByUserId);
router.get('/customer/address/update/:addressId',authenticateToken,getDeliveryTimeSlotById);
router.put('/customer/address/update/:addressId', authenticateToken,updateAddress);
router.delete('/customer/address/delete/:addressId',authenticateToken, deleteAddress);

module.exports = router;