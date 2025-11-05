const express = require('express');
const { createManuFactur, fetchWlpName, fetchManuFactur, deleteManuFactur, findManuFacturById, editManuFactur, findElements, AssignElements, fetchAllDataRelatedtoAssignElements, fetchAssignElement, fetchDashBoardData } = require('../controllers/wlpController');
const { authMiddelWere } = require('../middelwere/authMiddelWere');
const { upload } = require('../config/cloudinary');
const router = express.Router();

router.post("/createManuFactur", upload.fields([
    { name: 'logo', maxCount: 1 ,optional: true},
]), authMiddelWere, createManuFactur);

router.post("/fetchWlpName", authMiddelWere, fetchWlpName);
router.post("/fetchManuFactur", authMiddelWere, fetchManuFactur);
router.post("/deleteManuFactur", authMiddelWere, deleteManuFactur);
router.post("/findManuFacturById", authMiddelWere, findManuFacturById);
router.post("/editManuFactur", upload.fields([
    { name: 'logo', maxCount: 1 },
]), authMiddelWere, editManuFactur);
router.post("/findElements",authMiddelWere,findElements);
router.post("/AssignElements",authMiddelWere,AssignElements);
router.post("/fetchAllDataRelatedtoAssignElements",authMiddelWere,fetchAllDataRelatedtoAssignElements);
router.post("/fetchAssignElement",authMiddelWere, fetchAssignElement);
router.post("/fetchDashBoardData",authMiddelWere, fetchDashBoardData)

module.exports = router;