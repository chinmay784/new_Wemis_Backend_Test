const express = require('express');
const { authMiddelWere } = require('../middelwere/authMiddelWere');
const { createDistributor, fetchDistributor, deleteDistributor, fetchDistributorById, editDistributor, createDelerUnderDistributor, fetchDelerDistributor, deleteDelerDistributor, createOem, fetchOems, deleteOems, getOemsById, editOemsById, createDelerUnderOems, fetchDelerUnderOems, deleteDelerUnderOems, getDelerUnderOemsById, editDelerOem, createBarCode, fetchAllAssignElementDataRelatedToCreateBarCode, fetchAllBarCode, AllocateBarCode, fetchElementData, fetchAllBarCodesNumber, findDistributorUnderManufactur, findOemUnderManufactur, fetchAllAllocatedBarcode, rollBackAllocatedBarCode, findDelerUnderDistributor, findDelerUnderOem, createNewSubscription, fetchAllSubscriptionPlans, findSubScriptionById, editSubscriptionById, manuFacturMAPaDevice, fetchDistributorOnBasisOfState, fetchdelerOnBasisOfDistributor, createTechnician, fetchAllDistributors, fetchAlldelersUnderDistributor, fetchAllTechnicien, fetchDeviceNoOnBasisOfDeler, fetchSubScriptionPackages, fetchTechnicienAllRelatedData, fetchAllMapDevice, viewAMapDeviceInManufactur, viewDocumentsOnMapDevice } = require('../controllers/manuFactrerController');
const { upload } = require('../config/cloudinary');
const router = express.Router();

router.post("/createDistributor", upload.none(), authMiddelWere, createDistributor);
router.post("/fetchDistributor", authMiddelWere, fetchDistributor);
router.post("/deleteDistributor", authMiddelWere, deleteDistributor);
router.post("/fetchDistributorById", authMiddelWere, fetchDistributorById);
router.post("/editDistributor", authMiddelWere, editDistributor);
router.post("/createDelerUnderDistributor", authMiddelWere, createDelerUnderDistributor)
router.post("/fetchDelerDistributor", authMiddelWere, fetchDelerDistributor);
router.post("/deleteDelerDistributor", authMiddelWere, deleteDelerDistributor);
router.post("/createOem", authMiddelWere, createOem);
router.post("/fetchOems", authMiddelWere, fetchOems);
router.post("/deleteOems", authMiddelWere, deleteOems);
router.post("/getOemsById", authMiddelWere, getOemsById);
router.post("/editOemsById", authMiddelWere, editOemsById);
router.post("/createDelerUnderOems", authMiddelWere, createDelerUnderOems);
router.post("/fetchDelerUnderOems", authMiddelWere, fetchDelerUnderOems);
router.post("/deleteDelerUnderOems", authMiddelWere, deleteDelerUnderOems);
router.post("/getDelerUnderOemsById", authMiddelWere, getDelerUnderOemsById);
router.post("/editDelerOem", authMiddelWere, editDelerOem);
router.post("/createBarCode", authMiddelWere, createBarCode);
router.post("/fetchAllAssignElementDataRelatedToCreateBarCode", authMiddelWere, fetchAllAssignElementDataRelatedToCreateBarCode)
router.post("/fetchAllBarCode", authMiddelWere, fetchAllBarCode);
router.post("/AllocateBarCode", authMiddelWere, AllocateBarCode);
router.post("/fetchElementData", authMiddelWere, fetchElementData);
router.post("/fetchAllBarCodeNumber", authMiddelWere, fetchAllBarCodesNumber);
router.post("/findDistributorUnderManufactur", authMiddelWere, findDistributorUnderManufactur);
router.post("/findOemUnderManufactur", authMiddelWere, findOemUnderManufactur);
router.post("/fetchAllAllocatedBarcode", authMiddelWere, fetchAllAllocatedBarcode);
router.post("/rollBackAllocatedBarCode", authMiddelWere, rollBackAllocatedBarCode);
router.post("/findDelerUnderDistributor", authMiddelWere, findDelerUnderDistributor);
router.post("/findDelerUnderOem", authMiddelWere, findDelerUnderOem);
// this for Subscription Api
router.post("/createNewSubscription", authMiddelWere, createNewSubscription);
router.post("/fetchAllSubscriptionPlans", authMiddelWere, fetchAllSubscriptionPlans);
router.post("/findSubScriptionById", authMiddelWere, findSubScriptionById);
router.post("/editSubscriptionById", authMiddelWere, editSubscriptionById);
// Map a Device Routes
router.post(
    "/manuFacturMAPaDevice",
    authMiddelWere,
    upload.fields([
        { name: "Vechile_Doc", maxCount: 1, optional: true },
        { name: "Rc_Doc", maxCount: 1, optional: true },
        { name: "Pan_Card", maxCount: 1, optional: true },
        { name: "Device_Doc", maxCount: 1, optional: true },
        { name: "Adhar_Card", maxCount: 1, optional: true },
        { name: "Invious_Doc", maxCount: 1, optional: true },
        { name: "Signature_Doc", maxCount: 1, optional: true },
        { name: "Panic_Sticker", maxCount: 1, optional: true }
    ]),
    manuFacturMAPaDevice
);

router.post("/fetchAllMapDevice", authMiddelWere, fetchAllMapDevice);
router.post("/viewAMapDeviceInManufactur", authMiddelWere, viewAMapDeviceInManufactur);
router.post("/viewDocumentsOnMapDevice", authMiddelWere, viewDocumentsOnMapDevice)


router.post("/fetchDistributorOnBasisOfState", authMiddelWere, fetchDistributorOnBasisOfState);
router.post("/fetchdelerOnBasisOfDistributor", authMiddelWere, fetchdelerOnBasisOfDistributor);
router.post("/fetchDeviceNoOnBasisOfDeler", authMiddelWere, fetchDeviceNoOnBasisOfDeler);
router.post("/fetchSubScriptionPackages", authMiddelWere, fetchSubScriptionPackages);
router.post("/fetchTechnicienAllRelatedData", authMiddelWere, fetchTechnicienAllRelatedData)



// some more Apis for create Technicien
router.post("/createTechnician", authMiddelWere, createTechnician);
router.post("/fetchAllDistributors", authMiddelWere, fetchAllDistributors);
router.post("/fetchAlldelersUnderDistributor", authMiddelWere, fetchAlldelersUnderDistributor);
router.post("/fetchAllTechnicien", authMiddelWere, fetchAllTechnicien);




// // for single Device LiveTracking Data 
// router.post("/liveTrackingOnAnMapSingleMapDevice",authMiddelWere,liveTrackingOnAnMapSingleMapDevice);



module.exports = router;