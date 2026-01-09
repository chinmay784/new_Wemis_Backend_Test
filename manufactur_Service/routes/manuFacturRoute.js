const express = require('express');
const { authMiddelWere } = require('../middelwere/authMiddelWere');
const { createDistributor, fetchDistributor, deleteDistributor, fetchDistributorById, editDistributor, createDelerUnderDistributor, fetchDelerDistributor, deleteDelerDistributor, createOem, fetchOems, deleteOems, getOemsById, editOemsById, createDelerUnderOems, fetchDelerUnderOems, deleteDelerUnderOems, getDelerUnderOemsById, editDelerOem, createBarCode, fetchAllAssignElementDataRelatedToCreateBarCode, fetchAllBarCode, AllocateBarCode, fetchElementData, fetchAllBarCodesNumber, findDistributorUnderManufactur, findOemUnderManufactur, fetchAllAllocatedBarcode, rollBackAllocatedBarCode, findDelerUnderDistributor, findDelerUnderOem, createNewSubscription, fetchAllSubscriptionPlans, findSubScriptionById, editSubscriptionById, manuFacturMAPaDevice, fetchDistributorOnBasisOfState, fetchdelerOnBasisOfDistributor, createTechnician, fetchAllDistributors, fetchAlldelersUnderDistributor, fetchAllTechnicien, fetchDeviceNoOnBasisOfDeler, fetchSubScriptionPackages, fetchTechnicienAllRelatedData, fetchAllMapDevice, viewAMapDeviceInManufactur, viewDocumentsOnMapDevice, fetchCoustmerallDevices, fetchCoustmerSingleDevice, liveTrackingSingleDevice, liveTrackingAllDevices, ticketIssueByCoustmer, fetchAllCoustmerVechileNo, getCustomerTicketIssues, getTicketIssuesListManufactur, ticketIssueByDeler, fetchAllDelerTicketIssue, fetchAllVechileNoByDeler, chatBetweenManufacturAndDeler, getAllMessagesBetweenUsers, chatBetweenCoustmerAndManuFactur, getAllMessagesBetweenCoustmerAndManufactur, manufacturCloseTicketApi, fetchDistributorAllocatedBarcode, fetchDelerUnderDistributor, distributorAllocatedBarCode, AllocatedListOfBarCode, DistributorCreateDeler, fetchAllDistributorDelerList, getAllBarcodeListByCurrentDeler, technicianCreateByDeler, fetchAllDelerTechenicien, delerMapDevice, fetchDelerMapDevices, fetchdelerSubscriptionPlans, fetchSingleRoutePlayback, fetchVehicleDistanceReport, fetchStoppageReport, fetchIgnitionReport, fetchMovingTimeReport, fetchIdleTimeReport, fetchParkingTimeReport, fetchSOSReport, addWalletBalance, fetchWalletBalance, fetchManufacturPaymentHistory, fetchDistributorPaymentHistory, } = require('../controllers/manuFactrerController');
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
    // upload.fields([
    //     { name: "Vechile_Doc", maxCount: 1, optional: true },
    //     { name: "Rc_Doc", maxCount: 1, optional: true },
    //     { name: "Pan_Card", maxCount: 1, optional: true },
    //     { name: "Device_Doc", maxCount: 1, optional: true },
    //     { name: "Adhar_Card", maxCount: 1, optional: true },
    //     { name: "Invious_Doc", maxCount: 1, optional: true },
    //     { name: "Signature_Doc", maxCount: 1, optional: true },
    //     { name: "Panic_Sticker", maxCount: 1, optional: true }
    // ]),
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



// Fetch Coustmer All Devices
router.get("/fetchCoustmerallDevices", authMiddelWere, fetchCoustmerallDevices);
router.post("/fetchCoustmerSingleDevice", authMiddelWere, fetchCoustmerSingleDevice);

// // for single Device LiveTracking Data 
// router.post("/liveTrackingOnAnMapSingleMapDevice",authMiddelWere,liveTrackingOnAnMapSingleMapDevice);
router.post("/liveTrackingSingleDevice", authMiddelWere, liveTrackingSingleDevice);
router.get("/liveTrackingAllDevices", authMiddelWere, liveTrackingAllDevices);
router.post("/fetchSingleRoutePlayback", authMiddelWere, fetchSingleRoutePlayback);
router.post("/fetchVehicleDistanceReport",authMiddelWere,fetchVehicleDistanceReport);
router.post("/fetchStoppageReport",authMiddelWere,fetchStoppageReport);
router.post("/fetchIgnitionReport",authMiddelWere,fetchIgnitionReport);
router.post("/fetchMovingTimeReport",authMiddelWere,fetchMovingTimeReport);
router.post("/fetchIdleTimeReport",authMiddelWere,fetchIdleTimeReport);
router.post("/fetchParkingTimeReport",authMiddelWere,fetchParkingTimeReport);
router.post("/fetchSOSReport",authMiddelWere,fetchSOSReport)



// Ticket Issue Routes
router.get("/fetchAllCoustmerVechileNo", authMiddelWere, fetchAllCoustmerVechileNo);
router.post("/ticketIssueByCoustmer", authMiddelWere, ticketIssueByCoustmer);
router.get("/getCustomerTicketIssues", authMiddelWere, getCustomerTicketIssues);
router.get("/getTicketIssuesListManufactur", authMiddelWere, getTicketIssuesListManufactur);

// ticket Issue By deler
router.post("/ticketIssueByDeler", authMiddelWere, ticketIssueByDeler);
router.get("/fetchAllDelerTicketIssue", authMiddelWere, fetchAllDelerTicketIssue);
router.get("/fetchAllVechileNoByDeler", authMiddelWere, fetchAllVechileNoByDeler);


// chat Message Between ManuFactur And Deler
router.post("/chatBetweenManufacturAndDeler", authMiddelWere, chatBetweenManufacturAndDeler);
router.post("/getAllMessagesBetweenUsers", authMiddelWere, getAllMessagesBetweenUsers);



// Chat Between Coustmer and ManuFactur
router.post("/chatBetweenCoustmerAndManuFactur", authMiddelWere, chatBetweenCoustmerAndManuFactur);
router.post("/getAllMessagesBetweenCoustmerAndManufactur", authMiddelWere, getAllMessagesBetweenCoustmerAndManufactur);


// ticketclose api
router.post("/manufacturCloseTicketApi", authMiddelWere, manufacturCloseTicketApi);




// Now work on distributor sections api
router.get("/fetchDistributorAllocatedBarcode", authMiddelWere, fetchDistributorAllocatedBarcode);
router.get("/fetchDelerUnderDistributor", authMiddelWere, fetchDelerUnderDistributor);
router.post("/distributorAllocatedBarCode", authMiddelWere, distributorAllocatedBarCode);
router.get("/AllocatedListOfBarCode", authMiddelWere, AllocatedListOfBarCode);
router.post("/DistributorCreateDeler", authMiddelWere, DistributorCreateDeler);
router.get("/fetchAllDistributorDelerList", authMiddelWere, fetchAllDistributorDelerList);

// Now work on Deler API Sections
router.get("/getAllBarcodeListByCurrentDeler", authMiddelWere, getAllBarcodeListByCurrentDeler);
router.post("/technicianCreateByDeler", authMiddelWere, technicianCreateByDeler);
router.get("/fetchAllDelerTechenicien", authMiddelWere, fetchAllDelerTechenicien);
router.post("/delerMapDevice", authMiddelWere, delerMapDevice);
router.get("/fetchDelerMapDevices", authMiddelWere, fetchDelerMapDevices);
router.get("/fetchdelerSubscriptionPlans", authMiddelWere, fetchdelerSubscriptionPlans)




// work on wallet transaction routes here
router.post("/addWalletBalance",authMiddelWere,addWalletBalance);
router.get("/fetchWalletBalance",authMiddelWere,fetchWalletBalance);
router.get("/fetchManufacturPaymentHistory",authMiddelWere,fetchManufacturPaymentHistory);
router.get("/fetchDistributorPaymentHistory",authMiddelWere,fetchDistributorPaymentHistory);

module.exports = router;