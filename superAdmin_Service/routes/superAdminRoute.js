const express = require('express');
const { registerSuperAdmin, login, getProfile, createAdmin, getAllAdmins, deleteAdmin, editAdmin, getAdminById, fetchAllAdmins_Elements_wlp, createBrand, fetchAllBrands, createElementCategory, fetchAllCategory, createElement, addElementCheckBox, fetchAllElementCheckBox, fetchAllElement, deleteElement, addElementType, fetchAllElementType, addDeviceModel, fetchModelElementData, addDevicePart, fetchAllDeviceData, addTacNumber, fetchAllTacNo, addCopNumber, fetchAllCopNo, fetchAllAdmins, assignElement, fetchSuperAdminAssignElement } = require('../controllers/superAdminController');
const { authMiddelWere } = require('../middelwere/authMiddelWere');
const { upload } = require('../config/cloudinary');
const router = express.Router();

router.post("/register-superadmin", registerSuperAdmin);
router.post('/login', login);
router.post('/profile', authMiddelWere, getProfile);
router.post(
    '/createAdmin',
    authMiddelWere,
    upload.fields([
        { name: 'Company_Logo', maxCount: 1 ,optional: true},
        { name: 'Incorporation_Certificate', maxCount: 1 ,optional: true},
        { name: 'Pan_Card', maxCount: 1 ,optional: true},
        { name: 'GST_Certificate', maxCount: 1,optional: true }
    ]),
    createAdmin
);

router.post('/getAllAdmins', authMiddelWere, getAllAdmins);
router.post('/getAdminById', authMiddelWere , getAdminById)
router.post(
  '/editAdmin',
  authMiddelWere,
  upload.fields([
    { name: 'Company_Logo', maxCount: 1 },
    { name: 'Incorporation_Certificate', maxCount: 1 },
    { name: 'Pan_Card', maxCount: 1 },
    { name: 'GST_Certificate', maxCount: 1 }
  ]),
  editAdmin
);

router.post("/deleteAdmin", authMiddelWere, deleteAdmin);
router.post('/fetchAllAdmins_Elements_wlp', authMiddelWere, fetchAllAdmins_Elements_wlp)
router.post("/createBrand",authMiddelWere, createBrand);
router.post("/fetchAllBrands", authMiddelWere, fetchAllBrands);
router.post("/createElementCategory", authMiddelWere, createElementCategory);
router.post("/fetchAllCategory",authMiddelWere,fetchAllCategory);
router.post("/createElement",authMiddelWere,createElement);
// router.post("/addElementCheckBox",upload.fields([{ name: "icon", maxCount: 1 }]),authMiddelWere,addElementCheckBox);
router.post("/addElementCheckBox",authMiddelWere,addElementCheckBox);
router.post("/fetchAllElementCheckBox",authMiddelWere,fetchAllElementCheckBox);
router.post("/fetchAllElement",authMiddelWere,fetchAllElement);
router.post("/deleteElement", authMiddelWere,deleteElement);
router.post("/addElementType",authMiddelWere,addElementType);
router.post("/fetchAllElementType",authMiddelWere,fetchAllElementType);
router.post("/addDeviceModel",authMiddelWere,addDeviceModel);
router.post("/fetchModelElementData",authMiddelWere,fetchModelElementData);
router.post("/addDevicePart",authMiddelWere,addDevicePart);
router.post("/fetchAllDeviceData",authMiddelWere,fetchAllDeviceData);
router.post("/addTacNumber",authMiddelWere,addTacNumber);
router.post("/fetchAllTacNo",authMiddelWere,fetchAllTacNo);
router.post("/addCopNumber",authMiddelWere,addCopNumber);
router.post("/fetchAllCopNo",authMiddelWere,fetchAllCopNo);
router.post("/fetchAllAdmins",authMiddelWere,fetchAllAdmins);
router.post("/assignElement",authMiddelWere,assignElement);
router.post("/fetchSuperAdminAssignElement",authMiddelWere,fetchSuperAdminAssignElement)

module.exports = router;