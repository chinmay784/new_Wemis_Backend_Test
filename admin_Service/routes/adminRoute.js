const express = require('express');
const router = express.Router();
const { authMiddelWere } = require("../middelwere/authMiddelWere");
const { createWlp, getAllWlp, deleteWlp, fetchAdminElementsList, adminDashBoard, adminAssignElement, fetchAllDaterelatedToassignAdminElement, editWlp, getWlpById, fetchWlpAssignElementList } = require('../controllers/adminController');
const { upload } = require('../config/cloudinary');

router.post("/createWlp", upload.fields([
    { name: 'logo', maxCount: 1 },
]), authMiddelWere, createWlp);
router.post("/getAllWlp", authMiddelWere, getAllWlp);
router.post("/deleteWlp", authMiddelWere, deleteWlp);
router.post("/fetchAdminElementsList", authMiddelWere, fetchAdminElementsList);
router.post("/adminDashBoard", authMiddelWere, adminDashBoard);
router.post("/fetchAllDaterelatedToassignAdminElement", authMiddelWere, fetchAllDaterelatedToassignAdminElement);
router.post("/adminAssignElement", authMiddelWere, adminAssignElement);
router.post("/editWlp", authMiddelWere, upload.fields([{ name: 'logo', maxCount: 1 }]), editWlp);
router.post("/getWlpById",authMiddelWere, getWlpById);
router.post("/fetchWlpAssignElementList",authMiddelWere,fetchWlpAssignElementList)

module.exports = router;