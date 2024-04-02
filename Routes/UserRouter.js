const express = require('express')
const { authenticateToken } = require('../config/JwtToken');
const { register, login, AllUsers, editUser, UpdateUsers, deleteUser, Accept_User, changePassword, register_admin, ResetPassword, New_password, payment, AllUsers_role, loginWithOTP, generateAndSendOTP, login_fb, login_google, SendEmail } = require('../controllers/userController');
const { editDoctor, UpdateDoctor, deleteDoctor, AllDoctors, UpdateDoctorSocail_Media, UpdateDoctorBankDetails, deleteDoctorAwards, deleteDoctorEducation, deleteDoctorExperience, deleteClinicImage, FilterDoctors, search_specialities, AllDoctorPermitted, AllDoctorApproved, AllDoctorBlocked, AllDoctorPending, deleteDoctorBlock } = require('../controllers/doctorController');
// Multer configuration
const multer = require('multer')
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
router.post('/register', register);
router.post('/login', login);
// router.get('/AllUsers_role',AllUsers_role)
// router.post('/loginWithOTP',loginWithOTP)
// router.post('/generateAndSendOTP',generateAndSendOTP)
// router.post('/login_fb',login_fb)
// router.post('/login_google',login_google)

// // Patient
// router.get('/AllUsers', AllUsers)
// router.get('/editUser/:id', editUser)
// router.put('/UpdateUsers/:id', upload.single('image'),authenticateToken, UpdateUsers)
// router.delete('/deleteUser/:id',authenticateToken, deleteUser)

// // Doctor
// router.get('/AllDoctors', AllDoctors)
// router.get('/editDoctor/:id', editDoctor)
// router.put('/UpdateDoctor/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'ClinicImage', maxCount: 5 }]), authenticateToken, UpdateDoctor);
// router.put('/UpdateDoctorRegister/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'ClinicImage', maxCount: 5 }]), UpdateDoctor);
// router.delete('/deleteDoctor/:id',authenticateToken, deleteDoctor)
// router.put('/UpdateDoctorSocail_Media/:id',authenticateToken, UpdateDoctorSocail_Media)
// router.put('/UpdateDoctorBankDetails',authenticateToken, upload.fields([
//     { name: 'Aadhar_image', maxCount: 1 },
//     { name: 'Pan_image', maxCount: 1 }
// ]),UpdateDoctorBankDetails)
// router.post('/changePassword/:resetToken',authenticateToken,changePassword)
// router.get("/doctors/filter", FilterDoctors);

// // admin
// router.put('/Accept_User/:id',authenticateToken, Accept_User)
// router.get('/edit_admin_profile/:id',edit_admin_profile,authenticateToken);
// router.put('/Update_admin_profile/:id',upload.single('image'),Update_admin_profile,authenticateToken);
// router.post('/register_admin',authenticateToken,register_admin);

module.exports = router;