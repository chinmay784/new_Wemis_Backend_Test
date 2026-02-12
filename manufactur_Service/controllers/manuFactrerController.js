const Distributor = require("../models/CreateDistributor")
const User = require("../models/UserModel");
const CreateDelerUnderDistributor = require("../models/CreateDelerUnderDistributor");
const OemModelSchema = require("../models/CreateOemModel");
const CreateOemModel = require("../models/CreateOemModel");
const CreateDelerUnderOems = require("../models/CreateDelerUnderOems");
const createBarCode = require("../models/CreateBarCodeModel");
const ManuFactur = require("../models/ManuFacturModel");
const AllocateBarCode = require("../models/AllocateBarCode");
const RollBackAlloCatedBarCodeSchema = require("../models/RollBackAlloCatedBarCode");
const createSubscription = require("../models/CreateNewSubscriptions");
const MapDevice = require("../models/mapADeviceModel");
const Technicien = require("../models/CreateTechnicien");
const { cloudinary } = require("../config/cloudinary");
// const { devices } = require("../devicesStore");
const CoustmerDevice = require("../models/coustmerDeviceModel");
const devices = require("../devicesStore");
const TicketIssue = require("../models/TicketIssueModel");
const ChatMessage = require("../models/ChatSchemaModel");
const DistributorAllocateBarcode = require("../models/DistributorAllocatedBarcode");
const DelerMapDevice = require('../models/DelerMapDevices');
const WalletTransaction = require("../models/WalletTransaction");
const liveTrackingCache = require("../utils/cache");
const WlpModel = require("../models/WlpModel");
const wlpActivation = require("../models/wlpActivationModel");
const sendActivationWalletToManuFacturer = require("../models/sendActivationWalletToManuFacturerModel");
const sendActivationWalletToDistributorOrOem = require("../models/sendActivationWalletToDistributorOrOem")
const requestForActivationWallet = require("../models/requestForActivationWallet");
const sendwalletDistDelerOemDeler = require("../models/sendActivationWalletsToDistDelerAndOemDeler");




exports.createDistributor = async (req, res) => {
    try {
        const userId = req.user.userId

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide userId"
            })
        }

        const { business_Name, contact_Person_Name, email, gender, mobile, date_of_Birth, age, Map_Device_Edit, pAN_Number, occupation, advance_Payment, languages_Known, country, state, district, address } = req.body;


        if (!business_Name || !contact_Person_Name || !email || !gender || !mobile || !date_of_Birth || !age || !Map_Device_Edit || !pAN_Number || !occupation || !advance_Payment || !languages_Known || !country || !state || !district || !address) {
            return res.status(200).json({
                sucess: false,
                message: "please provide all fields"
            })
        };

        // find allready present

        const distributor = await Distributor.findOne({ email: email });

        if (distributor) {
            return res.status(200).json({
                sucess: false,
                message: "Distributor Already Exist"
            })
        }


        const dist = new Distributor({
            manufacturId: userId,
            business_Name,
            contact_Person_Name,
            email,
            gender,
            mobile,
            date_of_Birth,
            age,
            Map_Device_Edit,
            pAN_Number,
            occupation,
            advance_Payment,
            languages_Known,
            country,
            state,
            district, address
        });


        await dist.save();

        // create user in USER Collection
        const distSaveInUser = new User({
            distributorId: dist._id,
            email: email,
            password: mobile,
            role: "distibutor",
        })

        await distSaveInUser.save();

        return res.status(200).json({
            sucess: true,
            message: "Distributor Created SucessFully"
        })


    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in createDistributor"
        })
    }
}


exports.fetchDistributor = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide userId"
            })
        }

        // find in distributor 
        const distributor = await Distributor.find({ manufacturId: userId });

        if (!distributor) {
            return res.status(200).json({
                sucess: false,
                message: "No Distributor Found"
            })
        }

        return res.status(200).json({
            sucess: true,
            message: 'Distributor fetched Sucessfully',
            distributor,
        })
    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "server error in Fetch Distributor "
        })
    }
}


exports.deleteDistributor = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: "Please Provide userId"
            });
        }

        const { id } = req.body;

        if (!id) {
            return res.status(200).json({
                success: false,
                message: "Please Provide id"
            });
        }

        // Delete Distributor
        const deletedDistributor = await Distributor.findByIdAndDelete(id);

        if (!deletedDistributor) {
            return res.status(404).json({
                success: false,
                message: "Distributor not found"
            });
        }

        // Delete linked User by distributorId
        console.log("Before User Delete in Distributor");
        const deletedUser = await User.findOneAndDelete({ distributorId: id });
        console.log("After User Delete in Distributor");

        return res.status(200).json({
            success: true,
            message: "Distributor Deleted Successfully",
            deletedDistributor,
            deletedUser
        });

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server error in deleteDistributor",
            error: error.message
        });
    }
};





exports.fetchDistributorById = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide userId",
            })
        };

        const { distributorId } = req.body;

        if (!distributorId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide distributorId",
            })
        }

        const single = await Distributor.findById(distributorId);

        if (!single) {
            return res.status(200).json({
                sucess: false,
                message: "No distributor Found",
            })
        }

        return res.status(200).json({
            sucess: true,
            message: "Fetch By Id SucessFully",
            single
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in fetchDistributorById"
        })
    }
};




exports.editDistributor = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide userId",
            })
        };

        const { distributorId, business_Name, contact_Person_Name, email, gender, mobile, date_of_Birth, age, Map_Device_Edit, pAN_Number, occupation, advance_Payment, languages_Known, country, state, district, address } = req.body;

        const dist = await Distributor.findById(distributorId);

        if (!dist) {
            return res.status(404).json({
                sucess: false,
                message: "dist not found",
            })
        }

        if (dist.business_Name) dist.business_Name = business_Name;
        if (dist.contact_Person_Name) dist.contact_Person_Name = contact_Person_Name;
        if (dist.email) dist.email = email;
        if (dist.gender) dist.gender = gender;
        if (dist.mobile) dist.mobile = mobile;
        if (dist.date_of_Birth) dist.date_of_Birth = date_of_Birth;
        if (dist.age) dist.age = age;
        if (dist.Map_Device_Edit) dist.Map_Device_Edit = Map_Device_Edit;
        if (dist.pAN_Number) dist.pAN_Number = pAN_Number;
        if (dist.occupation) dist.occupation = occupation;
        if (dist.advance_Payment) dist.advance_Payment = advance_Payment;
        if (dist.languages_Known) dist.languages_Known = languages_Known;
        if (dist.country) dist.country = country;
        if (dist.state) dist.state = state;
        if (dist.district) dist.district = district;
        if (dist.address) dist.address = address;

        await dist.save();
        return res.status(200).json({
            sucess: true,
            message: "dist edited successfully",
            dist,
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in editDistributor"
        })
    }
}





exports.createDelerUnderDistributor = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide userId"
            })
        };

        const { distributorId, select_Distributor_Name, business_Name, name, email, gender, mobile, date_of_birth, age, Is_Map_Device_Edit, pan_Number, occupation, Advance_Payment, languages_Known, country, state, district, RTO_Division, Pin_Code, area, address } = req.body;

        if (!distributorId) {
            return res.state({
                sucess: false,
                message: "Please Provide distributorId"
            })
        };


        const findDel = await CreateDelerUnderDistributor.findOne({ email: email })
        if (findDel) {
            return res.status(200).json({
                sucess: false,
                message: "Already Exist"
            })
        };

        const newDel = new CreateDelerUnderDistributor({
            manufacturId: userId,
            distributorId: distributorId,
            select_Distributor_Name,
            business_Name,
            name,
            email,
            gender,
            mobile,
            date_of_birth,
            age,
            Is_Map_Device_Edit,
            pan_Number,
            occupation,
            Advance_Payment,
            languages_Known,
            country,
            state,
            district,
            RTO_Division,
            Pin_Code,
            area,
            address
        })

        await newDel.save();
        const delerDistributor = new User({
            manufacturId: userId,
            distributorId: distributorId,
            email: email,
            password: mobile,
            role: "dealer-distributor",
            distributorDelerId: newDel._id
        });
        await delerDistributor.save();

        return res.status(200).json({
            sucess: true,
            message: "created Sucessfully"
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in createDelerUnderDistributor"
        })
    }
}





exports.fetchDelerDistributor = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide userId"
            })
        }

        // Find in CreateDelerUnderDistributor collection
        const fetchAllCreateDelerUnderDistributor = await CreateDelerUnderDistributor.find({ manufacturId: userId });

        if (!fetchAllCreateDelerUnderDistributor) {
            return res.status(200).json({
                sucess: false,
                message: "No Data Found "
            })
        }

        return res.status(200).json({
            sucess: true,
            message: "fetchDelerDistributor Data SucessFully",
            fetchAllCreateDelerUnderDistributor,
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in fetchDelerDistributor "
        })
    }
}


exports.deleteDelerDistributor = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: "Please Provide UserId"
            });
        }

        const { delerId } = req.body;

        if (!delerId) {
            return res.status(200).json({
                success: false,
                message: "Please Provide delerId"
            });
        }

        // Delete in CreateDelerUnderDistributor collection by custom field
        const deletedDeler = await CreateDelerUnderDistributor.findOneAndDelete({ delerId });

        if (!deletedDeler) {
            return res.status(404).json({
                success: false,
                message: "DelerDistributor not found"
            });
        }

        // Delete corresponding user(s) linked with this deler
        const deletedUser = await User.findOneAndDelete({ distributorDelerId: delerId });

        return res.status(200).json({
            success: true,
            message: "DelerDistributor Deleted Successfully",
            deletedDeler,
            deletedUser
        });

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server error in deleteDelerDistributor",
            error: error.message
        });
    }
};



exports.createOem = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide userId"
            })
        };


        const { business_Name, contact_Person_Name, email, gender, mobile, date_of_Birth, age, Map_Device_Edit, pAN_Number, occupation, gst_no, languages_Known, country, state, district, address } = req.body;

        if (!business_Name || !contact_Person_Name || !email || !gender || !mobile || !date_of_Birth || !age || !Map_Device_Edit || !pAN_Number || !occupation || !gst_no || !languages_Known || !country || !state || !district || !address) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide allFields"
            })
        }


        const newOem = await OemModelSchema.findOne({ email });

        if (newOem) {
            return res.status(200).json({
                sucess: false,
                message: "Oem Already Exist"
            })
        }

        const oemCreate = new OemModelSchema({
            manufacturId: userId,
            business_Name,
            contact_Person_Name,
            email,
            gender,
            mobile,
            date_of_Birth,
            age,
            Map_Device_Edit,
            pAN_Number,
            occupation,
            gst_no,
            languages_Known,
            country,
            state,
            district,
            address
        })

        console.log("Before Data Save in DataBase")

        // ✅ save to DB
        await oemCreate.save();

        // and also save in User Collections
        const oemSaveInUser = new User({
            oemId: oemCreate._id,
            email: email,
            password: mobile,
            role: "oem"
        });


        // ✅ save to DB
        await oemSaveInUser.save();
        console.log("After Data Save in DataBase")


        return res.status(200).json({
            sucess: true,
            message: "Oem Created SucessFully"
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server error in createOem"
        })
    }
}


exports.fetchOems = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide userId",
            })
        };

        // const res
        const oems = await CreateOemModel.find({ manufacturId: userId });

        if (!oems) {
            return res.status(200).json({
                sucess: false,
                message: "oems Not Found",
            })
        };

        return res.status(200).json({
            sucess: true,
            message: "Oems Fetch SucessFully",
            oems
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "server Error in fetchOems "
        })
    }
}


exports.deleteOems = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide userId",
            });
        }

        const { oemsId } = req.body;

        if (!oemsId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide oemsId",
            });
        }

        // ✅ delete in CreateOemsModel using _id
        const deleteId = await CreateOemModel.findByIdAndDelete(oemsId);

        if (!deleteId) {
            return res.status(200).json({
                sucess: false,
                message: "Oem not Found",
            });
        }

        // ✅ delete in User Collections
        await User.findOneAndDelete({ oemId: oemsId });

        return res.status(200).json({
            sucess: true,
            message: "Oem Deleted Successfully",
        });

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in deleteOems",
        });
    }
};




exports.getOemsById = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide userId",
            })
        };

        const { oemsId } = req.body;

        if (!oemsId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide oemsId",
            })
        };

        // Find in Oems Collection Model
        const oemsById = await CreateOemModel.findById(oemsId);

        if (!oemsById) {
            return res.status(200).json({
                sucess: false,
                message: "No Data Found In oemsById",
            })
        };

        return res.status(200).json({
            sucess: true,
            message: "Fetchd SucessFully",
            oemsById,
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in GetOemsBy Id"
        })
    }
}



exports.editOemsById = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide userId",
            })
        };

        const { oemsId, business_Name, contact_Person_Name, email, gender, mobile, date_of_Birth, age, Map_Device_Edit, pAN_Number, occupation, gst_no, languages_Known, country, state, district, address } = req.body;

        const oems = await CreateOemModel.findById(oemsId);

        if (!oems) {
            return res.status(200).json({
                sucess: false,
                message: "No Data Found"
            })
        };

        if (oems.business_Name) oems.business_Name = business_Name;
        if (oems.contact_Person_Name) oems.contact_Person_Name = contact_Person_Name;
        if (oems.email) oems.email = email;
        if (oems.gender) oems.gender = gender;
        if (oems.mobile) oems.mobile = mobile;
        if (oems.date_of_Birth) oems.date_of_Birth = date_of_Birth;
        if (oems.age) oems.age = age;
        if (oems.Map_Device_Edit) oems.Map_Device_Edit = Map_Device_Edit;
        if (oems.pAN_Number) oems.pAN_Number = pAN_Number;
        if (oems.occupation) oems.occupation = occupation;
        if (oems.gst_no) oems.gst_no = gst_no;
        if (oems.languages_Known) oems.languages_Known = languages_Known;
        if (oems.country) oems.country = country;
        if (oems.state) oems.state = state;
        if (oems.district) oems.district = district;
        if (oems.address) oems.address = address;


        await oems.save();

        return res.status(200).json({
            sucess: true,
            message: "oems Edited SucessFully"
        });

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "server Error in editOemsById"
        })
    }
}



exports.createDelerUnderOems = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide userId"
            })
        };

        const { oemsId, select_Oems_Name, business_Name, name, email, gender, mobile, date_of_birth, age, Is_Map_Device_Edit, pan_Number, occupation, Advance_Payment, languages_Known, country, state, district, RTO_Division, Pin_Code, area, address } = req.body;

        if (!oemsId) {
            return res.state({
                sucess: false,
                message: "Please Provide oemsId"
            })
        };


        // check already exist or Not
        const findOem = await CreateDelerUnderOems.findOne({ email: email })
        if (findOem) {
            return res.status(200).json({
                sucess: false,
                message: "Oem Already Exist"
            })
        };

        const newOem = new CreateDelerUnderOems({
            manufacturId: userId,
            oemsId: oemsId,
            select_Oems_Name,
            business_Name,
            name,
            email,
            gender,
            mobile,
            date_of_birth,
            age,
            Is_Map_Device_Edit,
            pan_Number,
            occupation,
            Advance_Payment,
            languages_Known,
            country,
            state,
            district,
            RTO_Division,
            Pin_Code,
            area,
            address
        })

        await newOem.save();

        const delerOem = new User({
            manufacturId: userId,
            oemId: oemsId,
            email: email,
            password: mobile,
            role: "dealer-oem",
            oemsDelerId: newOem._id
        });
        await delerOem.save();

        return res.status(200).json({
            sucess: true,
            message: "created Sucessfully"
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in createDelerUnderOems"
        })
    }
}



exports.fetchDelerUnderOems = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide userId"
            })
        };

        // find userId in CreateDelerUnderOems collections
        const delerOems = await CreateDelerUnderOems.find({ manufacturId: userId });

        if (!delerOems) {
            return res.status(200).json({
                sucess: false,
                message: "No Data Found"
            })
        }

        return res.status(200).json({
            sucess: true,
            message: "DelerUnderOems Fetched SucessFully",
            delerOems,
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in fetchDelerUnderOems"
        })
    }
}


exports.deleteDelerUnderOems = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide userId",
            })
        };

        const { oemsId } = req.body;

        if (!oemsId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide oemsId",
            })
        };



        // Delete in CreateDelerUnderOems Collections
        const deleteOems = await CreateDelerUnderOems.findByIdAndDelete(oemsId)

        if (!deleteOems) {
            return res.status(200).json({
                sucess: false,
                message: "Data Not Found"
            })
        };




        // Delete in User Collections
        const userDelerDelet = await User.findOneAndDelete({ oemsDelerId: oemsId });


        return res.status(200).json({
            sucess: true,
            message: 'OemDeler Deleted SucessFully'
        });

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in deleteDelerUnderOems"
        })
    }
}



exports.getDelerUnderOemsById = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide userId",
            })
        };

        const { oemsId } = req.body;

        if (!oemsId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide oemsId",
            })
        };

        const findByIdInOems = await CreateDelerUnderOems.findById(oemsId);

        if (!findByIdInOems) {
            return res.status(200).json({
                sucess: false,
                message: "No Data Found"
            })
        };

        return res.status(200).json({
            sucess: true,
            message: "Fetch By Id SucessFully",
            findByIdInOems,
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in getDelerUnderOemsById"
        })
    }
}




exports.editDelerOem = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide userId",
            })
        };

        const { oemsId, select_Oems_Name, business_Name, name, email, gender, mobile, date_of_birth, age, Is_Map_Device_Edit, pan_Number, occupation, Advance_Payment, languages_Known, country, state, district, RTO_Division, Pin_Code, area, address } = req.body;

        // find in CreateDelerUnderOems collections
        const findByIdInOems = await CreateDelerUnderOems.findById(oemsId);
        console.log(oemsId)

        if (!findByIdInOems) {
            return res.status(200).json({
                sucess: false,
                message: "No Data Found"
            })
        };

        if (findByIdInOems.select_Oems_Name) findByIdInOems.select_Oems_Name = select_Oems_Name;
        if (findByIdInOems.business_Name) findByIdInOems.business_Name = business_Name;
        if (findByIdInOems.name) findByIdInOems.name = name;
        if (findByIdInOems.email) findByIdInOems.email = email;
        if (findByIdInOems.gender) findByIdInOems.gender = gender;
        if (findByIdInOems.mobile) findByIdInOems.mobile = mobile;
        if (findByIdInOems.date_of_birth) findByIdInOems.date_of_birth = date_of_birth;
        if (findByIdInOems.age) findByIdInOems.age = age;
        if (findByIdInOems.Is_Map_Device_Edit) findByIdInOems.Is_Map_Device_Edit = Is_Map_Device_Edit;
        if (findByIdInOems.pan_Number) findByIdInOems.pan_Number = pan_Number;
        if (findByIdInOems.occupation) findByIdInOems.occupation = occupation;
        if (findByIdInOems.Advance_Payment) findByIdInOems.Advance_Payment = Advance_Payment;
        if (findByIdInOems.languages_Known) findByIdInOems.languages_Known = languages_Known;
        if (findByIdInOems.country) findByIdInOems.country = country;
        if (findByIdInOems.state) findByIdInOems.state = state;
        if (findByIdInOems.district) findByIdInOems.district = district;
        if (findByIdInOems.RTO_Division) findByIdInOems.RTO_Division = RTO_Division;
        if (findByIdInOems.Pin_Code) findByIdInOems.Pin_Code = Pin_Code;
        if (findByIdInOems.area) findByIdInOems.area = area;
        if (findByIdInOems.address) findByIdInOems.address = address;

        await findByIdInOems.save();
        console.log("Save in dataBase")

        return res.status(200).json({
            sucess: false,
            message: "Edited SucessFully"
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in editDelerOem"
        })
    }
}



exports.fetchAllAssignElementDataRelatedToCreateBarCode = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide UserId"
            })
        }


        // Find in User on the Basis of userId And Find manufacturID in manufactur in collections
        const manuF = await User.findById(userId);
        if (!manuF) {
            return res.status(200).json({
                sucess: false,
                message: "Manufactur Not Found"
            })
        };


        // find manuF.manufacturId in manufactur Collection and search in assign List Elements
        const assignelementDetails = await ManuFactur.findById(manuF.manufacturId);

        if (!assignelementDetails) {
            return res.status(200).json({
                sucess: false,
                message: "ManuFactur Not Found",
            })
        };


        return res.status(200).json({
            sucess: true,
            assignelements: assignelementDetails.assign_element_list
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in fetchAllAssignElementDataRelatedToCreateBarCode",
        })
    }
}






exports.fetchAllDistributors = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "please provide userId"
            })
        }

        // fetchAll Distributors
        const allDistributors = await Distributor.find({ manufacturId: userId });

        if (!allDistributors) {
            return res.status(200).json({
                sucess: false,
                message: "No Data Found"
            })
        };

        return res.status(200).json({
            sucess: false,
            message: "all Distributor fetched sucessfully",
            allDistributors,
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in fetchAllDistributors"
        })
    }
}

exports.fetchAlldelersUnderDistributor = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please provide userId"
            })
        };


        const { distributorId } = req.body
        if (!distributorId) {
            return res.status(200).json({
                sucess: false,
                message: "Please provide distributorId"
            })
        };

        const delers = await CreateDelerUnderDistributor.find({ distributorId: distributorId });

        if (!delers) {
            return res.status(200).json({
                sucess: false,
                message: "No Deler Found under Didtributor"
            })
        }


        return res.status(200).json({
            sucess: true,
            message: "Deler Fetched SucessFully",
            delers,
        })


    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in fetchAlldelersUnderDistributor"
        })
    }
}

// here Manufacturer can create Techenican 
exports.createTechnician = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide UserId"
            })
        }

        const { distributorName, delerName, name, gender, email, mobile, adhar, dateOfBirth, qualification, distributorId, delerId } = req.body;

        if (!distributorName || !delerName || !name || !gender || !email || !mobile || !adhar || !dateOfBirth || !qualification || !distributorId || !delerId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide All The Fields"
            })
        }


        // check already technicien exist in db
        const technician = await Technicien.findOne({ email });
        if (technician) {
            return res.status(200).json({
                sucess: false,
                message: "technician Already Exist"
            })
        }


        // Here I have to save Technicien in db collections
        const newtechnician = await Technicien.create({
            manufacturId: userId,
            distributorName,
            delerName,
            name,
            gender,
            email,
            mobile,
            adhar,
            dateOfBirth,
            qualification,
            distributorId: distributorId,
            distributorUnderDelerId: delerId
        });


        // also save in userCollections
        const newTechnicianUser = await User.create({
            technicienId: newtechnician._id,
            email: email,
            password: mobile,
            role: "technicien"
        })


        return res.status(200).json({
            sucess: true,
            message: "Technicien Created SucessFully"
        })


    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in Create Technician"
        })
    }
}

exports.fetchAllTechnicien = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please provide userId"
            })
        };

        // fetchAllTechnicien
        const technicien = await Technicien.find({ manufacturId: userId });

        if (!technicien) {
            return res.status(200).json({
                sucess: false,
                message: "No technicien Found"
            })
        };


        return res.status(200).json({
            sucess: false,
            message: "Fetch All Technicien SucessFully",
            technicien,
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in fetchAllTechnicien"
        })
    }
}












exports.createBarCode = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide UserId"
            })
        };

        // to create BarCode Things will be rquired
        const { elementName, elementType, elementModelNo, elementPartNo, elementTacNo, elementCopNo, copValid, voltage, batchNo, baecodeCreationType, barCodeNo, is_Renew, deviceSerialNo, simDetails } = req.body;

        // ✅ Required field checks
        if (!elementName) return res.status(200).json({ success: false, message: "Please provide elementName" });
        if (!elementType) return res.status(200).json({ success: false, message: "Please provide elementType" });
        if (!elementModelNo) return res.status(200).json({ success: false, message: "Please provide elementModelNo" });
        if (!elementPartNo) return res.status(200).json({ success: false, message: "Please provide elementPartNo" });
        if (!elementTacNo) return res.status(200).json({ success: false, message: "Please provide elementTacNo" });
        if (!elementCopNo) return res.status(200).json({ success: false, message: "Please provide elementCopNo" });
        if (!copValid) return res.status(200).json({ success: false, message: "Please provide copValid" });
        if (!voltage) return res.status(200).json({ success: false, message: "Please provide voltage" });
        if (!batchNo) return res.status(200).json({ success: false, message: "Please provide batchNo" });
        if (!baecodeCreationType) return res.status(200).json({ success: false, message: "Please provide baecodeCreationType" });
        if (!barCodeNo) return res.status(200).json({ success: false, message: "Please provide barCodeNo" });
        if (!is_Renew) return res.status(200).json({ success: false, message: "Please provide is_Renew" });
        if (!deviceSerialNo) return res.status(200).json({ success: false, message: "Please provide deviceSerialNo" });
        // if (!simDetails || !Array.isArray(simDetails) || simDetails.length === 0) {
        //     return res.status(200).json({ success: false, message: "Please provide at least one SIM detail" });
        // }


        // create BarCode And Save in DataBase
        // const newBarCode = new createBarCode({
        //     manufacturId: userId,
        //     elementName,
        //     elementType,
        //     elementModelNo,
        //     elementPartNo,
        //     elementTacNo,
        //     elementCopNo,
        //     copValid,
        //     voltage,
        //     batchNo,
        //     baecodeCreationType,
        //     barCodeNo,
        //     is_Renew,
        //     deviceSerialNo,
        //     simDetails // 👈 store directly as array
        // });

        // await newBarCode.save();


        const newBarCode = await createBarCode.create({
            manufacturId: userId,
            elementName,
            elementType,
            elementModelNo,
            elementPartNo,
            elementTacNo,
            elementCopNo,
            copValid,
            voltage,
            batchNo,
            baecodeCreationType,
            barCodeNo,
            is_Renew,
            deviceSerialNo,
            simDetails // 👈 store directly as array
        })

        return res.status(200).json({
            success: true,
            message: "BarCode created successfully",
        });

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in createBarCode"
        })
    }
};


exports.fetchBarCode = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide UserId"
            })
        };

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in fetch Barcode"
        })
    }
};


exports.fetchAllBarCode = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide UserId"
            })
        }


        // Next Forward to show all barCode in Ui In ManuFactur BarCode Page
        const allBarCods = await createBarCode.find({ manufacturId: userId });

        if (!allBarCods) {
            return res.status(200).json({
                sucess: false,
                message: "BarCodes Not Found",
            })
        };


        return res.status(200).json({
            sucess: true,
            message: "Barcode Fetched SucessFully",
            allBarCods,
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in FetchAllBarCode"
        })
    }
};



exports.fetchElementData = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide UserId"
            })
        }

        const elementData = await User.findById(userId);
        if (!elementData) {
            return res.status(200).json({
                sucess: false,
                message: "No Data Found"
            })
        }

        // also find in manuFactur collections 
        const manuF = await ManuFactur.findById(elementData.manufacturId);
        if (!manuF) {
            return res.status(200).json({
                sucess: false,
                message: "No Data Found in ManuFactur Collections"
            })
        }

        return res.status(200).json({
            sucess: true,
            message: "Element Data Fetched SucessFully",
            elementData: manuF.assign_element_list
        });

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error while fetching element data"
        })
    }
}



exports.fetchAllBarCodesNumber = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        // ❌ ALLOCATED barcodes are excluded here
        const barcodes = await createBarCode.find(
            {
                manufacturId: userId,
                status: { $ne: "ALLOCATED" }, // 🔥 key condition
            },
            { barCodeNo: 1, _id: 0 }
        );

        if (!barcodes.length) {
            return res.status(404).json({
                success: false,
                message: "No non-allocated barcodes found",
            });
        }

        const elementData = barcodes.map(b => b.barCodeNo);

        return res.status(200).json({
            success: true,
            elementData,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};







exports.findDistributorUnderManufactur = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide UserId"
            })
        }

        const { state } = req.body;

        // find in Distributor Collections
        // const dist = await Distributor.find({ manufacturId: userId });
        // if (!dist) {
        //     return res.status(200).json({
        //         sucess: false,
        //         message: "No Data Found in Distributor Collections"
        //     })
        // }

        const dist = await Distributor.find({ state: state });


        if (!dist) {
            return res.status(200).json({
                sucess: false,
                message: "No data Found"
            })
        }


        return res.status(200).json({
            sucess: true,
            message: "Distributor Fetched SucessFully",
            dist,
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in findDistributorUnderManufactur"
        })
    }
}



exports.findOemUnderManufactur = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide UserId"
            })
        }

        // find in OEM Collections
        const oem = await OemModelSchema.find({ manufacturId: userId });
        if (!oem) {
            return res.status(200).json({
                sucess: false,
                message: "No Data Found in oem Collections"
            })
        }

        return res.status(200).json({
            sucess: true,
            message: "oem Fetched SucessFully",
            oem,
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in findOemUnderManufactur"
        })
    }
}



exports.findDelerUnderDistributor = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide UserId"
            })
        }

        const { distributorIde } = req.body;

        if (!distributorIde) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide distributorId"
            })
        }

        // find in CreateDelerUnderDistributor Collections
        const deler = await CreateDelerUnderDistributor.find({ manufacturId: userId, distributorId: distributorIde });

        if (!deler) {
            return res.status(200).json({
                sucess: false,
                message: "No deler Found in CreateDelerUnderDistributor Collections"
            })
        }

        return res.status(200).json({
            sucess: true,
            message: "Deler Fetched SucessFully",
            deler,
        })


    } catch (error) {
        console.log(error, error.message)
        return res.status(500).json({
            sucess: false,
            message: "Server Error in findDelerUnderDistributor"
        })
    }
}




exports.findDelerUnderOem = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide UserId"
            })
        }

        const { oemId } = req.body;

        if (!oemId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide oemId"
            })
        }


        // find in CreateDelerUnderOems Collections
        const oem = await CreateDelerUnderOems.find({ manufacturId: userId, oemsId: oemId });

        if (!oem) {
            return res.status(200).json({
                sucess: false,
                message: "No Oem Found in CreateDelerUnderOems Collections"
            })
        }

        return res.status(200).json({
            sucess: true,
            message: "Deler Fetched SucessFully",
            oem,
        })

    } catch (error) {
        console.log(error, error.message)
        return res.status(500).json({
            sucess: false,
            message: "Server Error in findDelerUnderOem"
        })
    }
}






// exports.AllocateBarCode = async (req, res) => {
//     // Assuming you have imported your Mongoose models:
//     // const Distributor = require('../models/DistributorModel');
//     // const OemModelSchema = require('../models/OemModel');
//     // const createBarCode = require('../models/BarcodeModel'); // Only needed for deletion/update, not for fetching allocated barcodes

exports.AllocateBarCode = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({ // Use 401 for Unauthorized
                success: false,
                message: "Authentication failed: Please Provide UserId"
            });
        }

        // Destructure all required fields, including the partner-specific ones and 'barcodes'
        const { country, state, checkBoxValue, distributor, oem, deler, element, elementType, modelNo, Voltege, partNo, type, barcodes } = req.body;

        // --- 1. Basic Field Validation ---
        // (Combined for brevity and efficiency)
        const requiredFields = {
            country: "Country", state: "State", checkBoxValue: "Partner Type (checkBoxValue)", deler: "Dealer",
            element: "Element", elementType: "ElementType", modelNo: "ModelNo", Voltege: "Voltege",
            partNo: "PartNo", type: "Type"
        };

        for (const [key, label] of Object.entries(requiredFields)) {
            if (!req.body[key]) {
                return res.status(200).json({ // Keeping 200 status as per original code for validation errors
                    success: false,
                    message: `Please Provide ${label}`
                });
            }
        }

        // --- 2. Barcode Validation (Moved outside the 'if' block) ---
        if (!barcodes || !Array.isArray(barcodes) || barcodes.length === 0) {
            return res.status(200).json({
                success: false,
                message: "Please provide barcodes (array of strings) for allocation."
            });
        }

        // Optional: Ensure all elements in the array are non-empty strings
        if (barcodes.some(b => typeof b !== 'string' || b.trim() === '')) {
            return res.status(200).json({
                success: false,
                message: "All provided barcodes must be non-empty strings."
            });
        }


        // --- 3. Conditional Partner Logic and Allocation ---
        if (checkBoxValue === "Distributor") {
            if (!distributor) {
                return res.status(200).json({
                    success: false,
                    message: "Please Provide Distributor ID"
                });
            }

            const dist = await Distributor.findById(distributor);

            if (!dist) {
                return res.status(404).json({
                    success: false,
                    message: "Distributor not found",
                });
            }

            console.log(`Allocating ${barcodes.length} Barcodes to Distributor:`, distributor);



            // 🔍 Find barcode objects from createBarCode collection
            const barcodeObjects = await createBarCode.find({ barCodeNo: { $in: barcodes } });

            // If some barcodes are missing, warn the user
            if (barcodeObjects.length !== barcodes.length) {
                const foundCodes = barcodeObjects.map(b => b.barCodeNo);
                const missing = barcodes.filter(b => !foundCodes.includes(b));
                return res.status(404).json({
                    success: false,
                    message: `Some barcodes were not found in database.`,
                    missingBarcodes: missing
                });
            }

            // Map full barcode objects
            const formattedBarcodes = barcodeObjects.map(b => ({
                manufacturId: b.manufacturId,
                elementName: b.elementName,
                elementType: b.elementType,
                elementModelNo: b.elementModelNo,
                elementPartNo: b.elementPartNo,
                elementTacNo: b.elementTacNo,
                elementCopNo: b.elementCopNo,
                copValid: b.copValid,
                voltage: b.voltage,
                batchNo: b.batchNo,
                baecodeCreationType: b.baecodeCreationType,
                barCodeNo: b.barCodeNo,
                is_Renew: b.is_Renew,
                deviceSerialNo: b.deviceSerialNo,
                simDetails: b.simDetails,
                status: b.status
            }));

            // ✅ Ensure the array exists
            if (!Array.isArray(dist.allocateBarcodes)) {
                dist.allocateBarcodes = [];
            }

            // ✅ Push all barcode objects
            dist.allocateBarcodes.push(...formattedBarcodes);

            await dist.save();


            // console.log(deler)
            // // find deler name 
            // const delername = await CreateDelerUnderDistributor.findById(deler);

            // // ✅ Ensure the array exists
            // if (!Array.isArray(delername.allocateBarcodes)) {
            //     delername.allocateBarcodes = [];
            // }

            // // ✅ Push all barcode objects
            // delername.allocateBarcodes.push(...formattedBarcodes);

            // await delername.save()



            // ==========================
            // ⭐ Dealer Logic (Optional)
            // ==========================
            const isDealerValid = deler && deler !== "N/A";

            let delerNameValue = null;

            if (isDealerValid) {
                const dealerDoc = await CreateDelerUnderDistributor.findById(deler);

                if (dealerDoc) {
                    if (!Array.isArray(dealerDoc.allocateBarcodes)) dealerDoc.allocateBarcodes = [];
                    dealerDoc.allocateBarcodes.push(...formattedBarcodes);
                    await dealerDoc.save();

                    delerNameValue = dealerDoc.name;
                }
            }



            // ✅ Also create AllocateBarcode entry
            await AllocateBarCode.create({
                country,
                state,
                checkBoxValue,
                status: "used",
                element,
                elementType,
                modelNo,
                Voltege,
                partNo,
                type,
                allocatedBarCode: barcodeObjects, // <-- store full objects if your schema supports it
                manufacturAllocateId: userId,
                allocatedDistributorId: distributor,
                allocatedOemId: null,
                // allocatedDelerId: deler,
                // delerName: delername.name
                allocatedDelerId: isDealerValid ? deler : null,
                delerName: isDealerValid ? delerNameValue : null
            });


            // 🔁 Optionally mark these barcodes as allocated in their own collection
            await createBarCode.updateMany(
                { barCodeNo: { $in: barcodes } },
                { $set: { status: 'ALLOCATED', allocatedTo: 'Distributor', distributorId: distributor } }
            );


            return res.status(200).json({
                success: true,
                message: "Barcodes allocated successfully to Distributor",
                data: dist
            });



        }



        // --- 4. OEM Allocation ---
        else if (checkBoxValue === "OEM") {
            if (!oem) {
                return res.status(200).json({
                    success: false,
                    message: "Please Provide OEM ID"
                });
            }

            // Find OEM
            const OeM = await OemModelSchema.findById(oem);
            if (!OeM) {
                return res.status(404).json({
                    success: false,
                    message: "OEM not found",
                });
            }

            // 🧠 Find full barcode documents from createBarCode collection
            const barcodeObjects = await createBarCode.find({ barCodeNo: { $in: barcodes } });

            if (!barcodeObjects || barcodeObjects.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No valid barcodes found in database."
                });
            }




            const formattedBarcodes = barcodeObjects.map(b => ({
                manufacturId: b.manufacturId,
                elementName: b.elementName,
                elementType: b.elementType,
                elementModelNo: b.elementModelNo,
                elementPartNo: b.elementPartNo,
                elementTacNo: b.elementTacNo,
                elementCopNo: b.elementCopNo,
                copValid: b.copValid,
                voltage: b.voltage,
                batchNo: b.batchNo,
                baecodeCreationType: b.baecodeCreationType,
                barCodeNo: b.barCodeNo,
                is_Renew: b.is_Renew,
                deviceSerialNo: b.deviceSerialNo,
                simDetails: b.simDetails,
                status: b.status
            }));

            // ✅ Ensure the array exists
            if (!Array.isArray(OeM.allocateBarcodes)) {
                OeM.allocateBarcodes = [];
            }

            // ✅ Push the full barcode objects into OeM.allocatedBarCode array
            OeM.allocateBarcodes.push(...formattedBarcodes);

            await OeM.save();

            // console.log(deler)
            // // find deler name 
            // const delername = await CreateDelerUnderOems.findById(deler);

            // // ✅ Ensure the array exists
            // if (!Array.isArray(delername.allocateBarcodes)) {
            //     delername.allocateBarcodes = [];
            // }

            // // ✅ Push the full barcode objects
            // delername.allocateBarcodes.push(...formattedBarcodes)

            // await delername.save();


            // ==========================
            // ⭐ Dealer Logic (Optional)
            // ==========================
            const isDealerValid = deler && deler !== "N/A";
            let delerNameValue = null;

            if (isDealerValid) {
                const dealerDoc = await CreateDelerUnderOems.findById(deler);

                if (dealerDoc) {
                    if (!Array.isArray(dealerDoc.allocateBarcodes)) dealerDoc.allocateBarcodes = [];
                    dealerDoc.allocateBarcodes.push(...formattedBarcodes);
                    await dealerDoc.save();

                    delerNameValue = dealerDoc.name;
                }
            }

            // 🧾 Also create AllocateBarCode record for tracking
            const allocated = await AllocateBarCode.create({
                country,
                state,
                checkBoxValue,
                status: "used",
                element,
                elementType,
                modelNo,
                Voltege,
                partNo,
                type,
                allocatedBarCode: barcodeObjects, // store full objects, not just codes
                manufacturAllocateId: userId,
                allocatedDistributorId: null,
                allocatedOemId: oem,
                // allocatedDelerId: deler,
                // delerName: delername.name
                allocatedDelerId: isDealerValid ? deler : null,
                delerName: isDealerValid ? delerNameValue : null
            });

            // 🔁 Optionally mark these barcodes as allocated in their own collection
            await createBarCode.updateMany(
                { barCodeNo: { $in: barcodes } },
                { $set: { status: 'ALLOCATED', allocatedTo: 'OEM', oemId: oem } }
            );

            return res.status(200).json({
                success: true,
                message: "Barcodes allocated successfully to OEM",
                allocatedCount: barcodeObjects.length,
                data: OeM
            });


        } else {
            // Handle case where checkBoxValue is neither "Distributor" nor "OEM"
            return res.status(200).json({
                success: false,
                message: "Invalid Partner Type specified by CheckBoxValue. Must be 'Distributor' or 'OEM'."
            });
        }

    } catch (error) {
        console.error("Error in AllocateBarCode:", error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in AllocateBarcode"
        });
    }
}



exports.fetchAllAllocatedBarcode = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide UserId"
            })
        }

        // find AllocatedBarCodes
        // const userLogin = await User.findById(userId);

        // if(!userLogin){
        //     return res.status(200).json({
        //         sucess: false,
        //         message: "No Data Found in User Collections"
        //     })
        // }

        // In Barcodes Collection is work Now
        // const allAllocatedBarcodes = await Distributor.find({
        //     "allocateBarcodes.manufacturId": userId
        // });



        // Here I have to find in AllocatedBarcode Schema collections

        const allAllocatedBarcodes = await AllocateBarCode.find()
            .populate("allocatedDistributorId", "contact_Person_Name")
            .populate("allocatedOemId", "contact_Person_Name")
            .populate({
                path: "allocatedDelerId",
                select: "name business_Name email",
            })
            .select("allocatedBarCode status createdAt delerName");




        if (!allAllocatedBarcodes) {
            return res.status(200).json({
                sucess: false,
                message: "No Data Found in AllocateBarCode Collections"
            })
        }

        return res.status(200).json({
            sucess: true,
            message: "All Allocated BarCodes Fetched SucessFully",
            allAllocatedBarcodes,
        })


    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in FetchAllBarcode"
        })
    }
}



//in this code will give copilot (not write by me or)
exports.rollBackAllocatedBarCode = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: "Please Provide UserId"
            });
        }

        const { state, distributor, element, barCode_Type } = req.body;

        // 🔸 Validation
        if (!state || !distributor || !element || !barCode_Type) {
            return res.status(200).json({
                success: false,
                message: "Please Provide State, Distributor, Element and barCode_Type"
            });
        }

        // 🔸 Find Distributor
        const dist = await Distributor.findById(distributor);
        if (!dist) {
            return res.status(200).json({
                success: false,
                message: "No Data Found in Distributor Collection"
            });
        }

        // 🔸 Find allocated barcodes in AllocateBarCode collection
        const allocatedRecords = await AllocateBarCode.find({
            allocatedDistributorId: distributor,
            state,
            element,
            // type: barCode_Type
        });

        if (!allocatedRecords || allocatedRecords.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No allocated barcodes found for this distributor and element"
            });
        }

        // 🔸 Collect all barcodes to rollback
        const barcodesToRemove = allocatedRecords.flatMap(rec => rec.barcodes);

        // 🔸 Remove barcodes from distributor.allocateBarcodes
        dist.allocateBarcodes = dist.allocateBarcodes.filter(b => !barcodesToRemove.includes(b));
        await dist.save();

        // 🔸 Delete those allocations from AllocateBarCode collection
        await AllocateBarCode.deleteMany({
            allocatedDistributorId: distributor,
            state,
            element,
            type: barCode_Type
        });

        return res.status(200).json({
            success: true,
            message: "Rolled back all allocated barcodes for this distributor successfully",
            removedBarcodes: barcodesToRemove,
            updatedDistributor: dist
        });

    } catch (error) {
        console.error("Error in rollBackAllocatedBarCode:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error in rollBackAllocatedBarCode"
        });
    }
};



// This is Code is Not Be Complited right Now
exports.fetchAllRealloCatedBarCode = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please UserId"
            })
        }

        let ReallocateBarCode;

        const reallocated = await ReallocateBarCode.find({ manufacturReallocateId: userId });

        if (!reallocated) {
            return res.status(200).json({
                sucess: false,
                message: "No Data Found in ReallocateBarCode Collections"
            })
        }

        return res.status(200).json({
            sucess: true,
            message: "Reallocated BarCode Fetched SucessFully",
            reallocated,
        });


    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in fetchRealloCatedBarCode"
        })
    }
}












// Here we started new Subscriptions Plans API
exports.createNewSubscription = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please UserId"
            })
        }

        const { elementName, packageType, packageName, billingCycle, price, description, renewal } = req.body;

        // createSubscription

        if (!packageType) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide PackageType"
            })
        }
        if (!packageName) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide PackageName"
            })
        }

        if (!billingCycle) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide BillingCycle"
            })
        }
        if (!price) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide Price"
            })
        }
        if (!description) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide Description"
            })
        }
        if (!renewal) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide Renewal"
            })
        }


        // some changes here
        const elementNameId = await User.findById(userId).select("wlpId");

        // find in wlp schema or model 
        const wlpData = await WlpModel.findById(elementNameId.wlpId).select("assign_element_list");


        const matchedElement = wlpData.assign_element_list.find(
            (item) => item.elementName === elementName
        );

        if (!matchedElement) {
            return res.status(400).json({
                success: false,
                message: "Element not found for given elementName"
            });
        }

        const checkelementId = matchedElement._id; // ObjectId



        const newSubscription = new createSubscription({
            // manuFacturId: userId,
            wlpId: userId,
            elementName,
            elementNameId: checkelementId,
            packageType,
            packageName,
            billingCycle,
            price,
            description,
            renewal,
        });

        await newSubscription.save();

        return res.status(200).json({
            sucess: true,
            message: "New Subscription Created SucessFully",
        })


    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in createNewSubscription"
        })
    }
}




exports.fetchAllSubscriptionPlans = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please UserId"
            })
        }

        // Fetch AllSubscriptionPlans on The Basis of ManufacturerId
        // const allSubscription = await createSubscription.find({ manuFacturId: userId });

        const allSubscription = await createSubscription.find({ wlpId: userId });

        if (!allSubscription) {
            return res.status(200).json({
                sucess: false,
                message: "No Data Found in createSubscription Collections"
            })
        }

        return res.status(200).json({
            sucess: true,
            message: "All Subscription Fetched SucessFully",
            allSubscription,
        })


    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in fetchAllSubscriptionPlans"
        })
    }
};





exports.findSubScriptionById = async (req, res) => {
    try {
        const userId = req.user.userId;


        if (!userId) {
            return res.status(200).json({
                sucess: false,
                mess
            })
        }


        const { subscriptionId } = req.body;

        if (!subscriptionId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide subscriptionId"
            })
        }


        const findSubscription = await createSubscription.findById(subscriptionId);

        if (!findSubscription) {
            return res.status(200).json({
                sucess: false,
                message: "No Data Found in createSubscription Collections"
            })
        }

        return res.status(200).json({
            sucess: true,
            message: "Subscription Fetched SucessFully",
            findSubscription,
        })


    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in findSubScriptionById"
        })
    }
}



exports.editSubscriptionById = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide UserId"
            })
        }


        const { subscriptionId, packageType, packageName, billingCycle, price, description, renewal } = req.body;

        if (!subscriptionId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide subscriptionId"
            })
        }

        const findByIdInSubscription = await createSubscription.findById(subscriptionId);

        if (!findByIdInSubscription) {
            return res.status(200).json({
                sucess: false,
                message: "No Data Found in createSubscription Collections"
            })
        }


        // Edit Here
        if (findByIdInSubscription.packageType) findByIdInSubscription.packageType = packageType;
        if (findByIdInSubscription.packageName) findByIdInSubscription.packageName = packageName;
        if (findByIdInSubscription.billingCycle) findByIdInSubscription.billingCycle = billingCycle;
        if (findByIdInSubscription.price) findByIdInSubscription.price = price;
        if (findByIdInSubscription.description) findByIdInSubscription.description = description;
        if (findByIdInSubscription.renewal) findByIdInSubscription.renewal = renewal;

        await findByIdInSubscription.save();

        return res.status(200).json({
            sucess: true,
            message: "Subscription Edited SucessFully",
            findByIdInSubscription,
        })


    } catch (error) {
        console.log(error, error.message)
        return res.status(500).json({
            sucess: false,
            message: "Server Error in editSubscriptionById"
        })
    }
}



// Activation code logic 
exports.addActivationLogic = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: "Please Provide UserId"
            });
        }

        const { elementName, packageName, packageType, billingCycle, description } = req.body;

        if (!elementName || !packageName || !packageType || !billingCycle || !description) {
            return res.status(200).json({
                success: false,
                message: "Please Provide All Fields"
            })
        }

        const checkExistingActivation = await wlpActivation.findOne({ packageName });

        if (checkExistingActivation) {
            return res.status(200).json({
                success: false,
                message: "Activation with this Package Name already exists"
            })
        }

        const newActivation = new wlpActivation({
            wlpCreatorId: userId,
            elementName,
            packageName,
            packageType,
            billingCycle,
            description
        });

        await newActivation.save();

        // return response
        return res.status(200).json({
            success: true,
            message: "Activation Created SuccessFully!"
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in addActivationLogic"
        })
    }
}

exports.fetchAllActivationPlans = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: "Please Provide UserId"
            });
        }

        const allActivationPlans = await wlpActivation.find({ wlpCreatorId: userId });

        if (!allActivationPlans || allActivationPlans.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No Data Found in wlpActivation Collections"
            });
        }

        return res.status(200).json({
            success: true,
            count: allActivationPlans.length,
            data: allActivationPlans,
            message: "Fetched SuccessFully"
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in fetchAllActivationPlans"
        })
    }
}

// Here i have to do Assign ActivationWallet to Manufacturer logic
exports.fetchManufacturerOnBasisOsState = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Please Provide UserId"
            });
        }

        const { state } = req.body;

        if (!state) {
            return res.status(400).json({
                success: false,
                message: "Please Provide State"
            });
        }

        const manufactur = await ManuFactur.find(
            { wlpId: userId, city: state },
            //{ business_Name: 1, manufacturer_Name: 1 } // projection
            { business_Name: 1 }
        );

        if (manufactur.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Manufacturer Found for this State"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Manufacturer Fetched Successfully",
            data: manufactur
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};


exports.ActivationWalletToManufactur = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: "Please Provide UserId "
            })
        }

        const { state, manufacturer, elementType, element, activationWallet } = req.body;

        if (!state || !manufacturer || !elementType || !element || !activationWallet) {
            return res.status(200).json({
                success: false,
                message: "Please Provide All Fields"
            })
        }

        // save in sendActivationWalletToManuFacturer collections
        const saveDbActivationWaaletManufacturer = await sendActivationWalletToManuFacturer.create({
            state,
            manufacturer,
            elementType,
            element,
            activationWallet
        });

        // Also push to manufacture activationWallets array (Not Complete)
        const realManufacturer = await ManuFactur.findOne({ business_Name: manufacturer });

        if (!realManufacturer) {
            return res.status(200).json({
                success: false,
                message: "No Manufacturer Found in ManuFactur Collections"
            })
        }

        // Push to activationWallets array
        realManufacturer.activationWallets.push(activationWallet);

        await realManufacturer.save();

        return res.status(200).json({
            success: true,
            message: "Activation Wallet Assigned to Manufacturer Successfully"
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in ActivationWalletToManufactur"
        })
    }
}

exports.fetchAssignActivationWallet = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Please Provide UserId"
            });
        }

        // some work will be here updated
        const fetchAssignActivation = await sendActivationWalletToManuFacturer
            .find({})
        // .populate({
        //     path: "wlpActivation",
        //     select: "elementName packageName packageType billingCycle price activationStatus"
        // });

        if (!fetchAssignActivation || fetchAssignActivation.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Data Found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Fetch Assign Activation Wallet Successfully",
            fetchAssignActivation
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server Error in fetchAssignActivationWallet"
        });
    }
};

exports.fetchManufacturActivatioWallet = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Please provide UserID",
            });
        }

        // Manufacturer user
        const manufacturUser = await User.findById(userId);
        if (!manufacturUser) {
            return res.status(404).json({
                success: false,
                message: "Manufacturer user not found",
            });
        }

        // Manufacturer
        const manuf = await ManuFactur.findById(manufacturUser.manufacturId);
        if (!manuf) {
            return res.status(404).json({
                success: false,
                message: "Manufacturer not found",
            });
        }

        // 🔥 Aggregation
        // const activationWallets = await wlpActivation.aggregate([
        //     {
        //         $match: {
        //             _id: { $in: manuf.activationWallets }
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: "sendactivationwallettomanufacturers", // collection name
        //             localField: "_id",
        //             foreignField: "activationWallet",
        //             as: "assignment"
        //         }
        //     },
        //     {
        //         $unwind: {
        //             path: "$assignment",
        //             preserveNullAndEmptyArrays: true
        //         }
        //     },
        //     {
        //         $addFields: {
        //             noOfActivationWallets: {
        //                 $ifNull: ["$assignment.noOfActivationWallets", 0]
        //             }
        //         }
        //     },
        //     {
        //         $project: {
        //             assignment: 0
        //         }
        //     }
        // ]);

        // 🔥 Aggregation
        const activationWallets = await wlpActivation.aggregate([
            {
                $match: {
                    _id: { $in: manuf.activationWallets }
                }
            },
            {
                $lookup: {
                    from: "sendactivationwallettomanufacturers",
                    localField: "_id",
                    foreignField: "activationWallet",
                    as: "assignment"
                }
            },
            {
                $unwind: {
                    path: "$assignment",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    // Pulls the count from the assignment collection
                    noOfActivationWallets: {
                        $ifNull: ["$assignment.noOfActivationWallets", 0]
                    },
                    // 👇 This pulls the actual assignment/wallet ID you requested
                    activationWallet: {
                        $ifNull: ["$assignment.activationWallet", null]
                    }
                }
            },
            {
                $project: {
                    assignment: 0 // Remove the raw joined object to keep response clean
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            message: "Activation wallets fetched successfully",
            activationWallets
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server Error in fetchManufacturActivatioWallet",
        });
    }
};


exports.manufacturCanAddPriceAndNoOfWallet = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { price, totalPrice, distributorAndOemMarginPrice, delerMarginPrice, noOfActivationWallets, activationId } = req.body;

        if (!userId || !activationId) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const manufacturUser = await User.findById(userId);
        if (!manufacturUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const manuf = await ManuFactur.findById(manufacturUser.manufacturId);
        if (!manuf) {
            return res.status(404).json({ success: false, message: "Manufacturer record not found" });
        }

        // ✅ Improved Security Check (Handles ObjectId vs String comparison)
        const isAssigned = manuf.activationWallets.some(id => id.toString() === activationId.toString());
        if (!isAssigned) {
            return res.status(403).json({
                success: false,
                message: "Activation wallet not assigned to this manufacturer"
            });
        }

        // ✅ Update 1: WLP Activation
        const updatedActivation = await wlpActivation.findByIdAndUpdate(
            activationId,
            { price, distributorAndOemMarginPrice, delerMarginPrice, totalPrice },
            { new: true }
        );

        if (!updatedActivation) {
            return res.status(404).json({ success: false, message: "Activation wallet doc not found" });
        }

        // ✅ Update 2: Manufacturer's Send Collection
        const sendActivation = await sendActivationWalletToManuFacturer.findOneAndUpdate(
            { activationWallet: activationId },
            { noOfActivationWallets: noOfActivationWallets },
            { new: true }
        );

        // Optional: Check if Update 2 actually found a record
        if (!sendActivation) {
            console.warn(`⚠️ Price updated, but sendActivation record for ${activationId} not found.`);
        }



        // Here Add wallet count logic to Manufacturer collection (Not Complete)
        // manuf.walletPriceForActivation.avaliableStock += noOfActivationWallets;
        manuf.walletPriceForActivation.avaliableStock += noOfActivationWallets;
        await manuf.save(); // Save the updated manufacturer document
        // also for balance
        manuf.walletPriceForActivation.balance = (manuf.walletPriceForActivation.balance || 0) + (price * noOfActivationWallets);
        await manuf.save(); // Save the updated manufacturer document


        return res.status(200).json({
            success: true,
            message: "Price and wallet count updated successfully",
            data: { updatedActivation, sendActivation } // Good practice to return the updated data
        });

    } catch (error) {
        console.error("Error in manufacturCanAddPriceAndNoOfWallet:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


exports.plansShowOEMandDistributor = async (req, res) => {
    try {
        const plans = await sendActivationWalletToManuFacturer
            .find({})
            .populate({
                path: "activationWallet",
                select: `
                    elementName
                    packageName
                    packageType
                    billingCycle
                    description
                    distributorAndOemMarginPrice
                    price
                `
            })
            .sort({ createdAt: -1 });

        // 🔹 Add price to distributorAndOemMarginPrice
        const updatedPlans = plans.map(plan => {
            if (plan.activationWallet) {
                const wallet = plan.activationWallet;
                wallet.distributorAndOemMarginPrice = Number(wallet.distributorAndOemMarginPrice || 0) + Number(wallet.price || 0);
            }

            return plan;
        });

        return res.status(200).json({
            success: true,
            message: "OEM & Distributor plans fetched successfully",
            total: updatedPlans.length,
            data: updatedPlans
        });

    } catch (error) {
        console.error("plansShowOEMandDistributor error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error in plansShowOEMandDistributor"
        });
    }
};


exports.distributorAndOemRequestForActivationWallet = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Please provide UserID",
            });
        }

        const { activationPlanId, requestedWalletCount, totalPrice, paymentMethod, utrNumber } = req.body;

        if (!activationPlanId || !requestedWalletCount || !totalPrice || !paymentMethod || !utrNumber) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        const roleBaseUser = await User.findById(userId);
        if (!roleBaseUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // start logic
        if (roleBaseUser.role === "distibutor") {
            const distributor = await Distributor.findById(roleBaseUser.distributorId);
            if (!distributor) {
                return res.status(404).json({
                    success: false,
                    message: "Distributor not found",
                });
            }
            const newRequest = new requestForActivationWallet({
                manufaturId: distributor.manufacturId,
                distributorId: userId,
                requestedWalletCount,
                activationPlanId,
                totalPrice,
                paymentMethod,
                utrNumber
            });

            await newRequest.save();
            distributor.requestForActivationWallets.push(newRequest._id);
            await distributor.save();


            // also push in manufactur
            const userManf = await User.findById(distributor.manufacturId);
            const manufactur = await ManuFactur.findById(userManf.manufacturId);
            if (!manufactur) {
                return res.status(404).json({
                    success: false,
                    message: "Manufactur Not Found"
                })
            }
            manufactur.requestForActivationWallets.push(newRequest._id);
            await manufactur.save();


            // send response
            return res.status(200).json({
                success: true,
                message: "Request for activation wallet sent successfully"
            })

        } else if (roleBaseUser.role === "oem") {
            const oem = await OemModelSchema.findById(roleBaseUser.oemId);
            if (!oem) {
                return res.status(404).json({
                    success: false,
                    message: "OEM not found",
                });
            }

            const newRequest = new requestForActivationWallet({
                manufaturId: oem.manufacturId,
                oemId: userId,
                requestedWalletCount,
                activationPlanId,
                totalPrice,
                paymentMethod,
                utrNumber
            });

            await newRequest.save();
            oem.requestForActivationWallets.push(newRequest._id);
            await oem.save();


            // also push in manufactur
            const userOem = await User.findById(oem.manufacturId);
            const manufactur = await ManuFactur.findById(userOem.manufacturId);
            if (!manufactur) {
                return res.status(404).json({
                    success: false,
                    message: "Manufactur Not Found"
                })
            }
            manufactur.requestForActivationWallets.push(newRequest._id);
            await manufactur.save();


            // send response
            return res.status(200).json({
                success: true,
                message: "Request for activation wallet sent successfully"
            })

        } else if (roleBaseUser.role === "dealer-distributor") {
            const dealerDist = await CreateDelerUnderDistributor.findById(roleBaseUser.distributorDelerId);
            if (!dealerDist) {
                return res.status(404).json({
                    success: false,
                    message: "Dealer under Distributor not found",
                });
            }

            const newRequest = new requestForActivationWallet({
                distributorId: dealerDist.distributorId,
                DistributordelerId: userId,
                requestedWalletCount,
                activationPlanId,
                totalPrice,
                paymentMethod,
                utrNumber
            })

            await newRequest.save();

            dealerDist.requestForActivationWallets.push(newRequest._id);
            await dealerDist.save();

            // also push in distributor
            // const userdist = await User.findById(dealerDist.distributorId);
            const distributor = await Distributor.findById(dealerDist.distributorId);
            if (!distributor) {
                return res.status(404).json({
                    success: false,
                    message: "Distributor Not Found"
                })
            }

            distributor.requestForActivationWallets.push(newRequest._id);
            await distributor.save();


            // send response
            return res.status(200).json({
                success: true,
                message: "Request for activation wallet sent successfully"
            })
        } else {

            const delerOem = await CreateDelerUnderOems.findById(roleBaseUser.oemsDelerId);
            if (!delerOem) {
                return res.status(200).json({
                    success: false,
                    message: "DelerOem Not Found"
                })
            }

            const newRequest = new requestForActivationWallet({
                oemId: delerOem.oemsId,
                oemDelerId: userId,
                requestedWalletCount,
                activationPlanId,
                totalPrice,
                paymentMethod,
                utrNumber
            })

            await newRequest.save();

            delerOem.requestForActivationWallets.push(newRequest._id);
            await delerOem.save()


            // also push in oem 
            const oem = await CreateOemModel.findById(delerOem.oemsId);
            if (!oem) {
                return res.status(200).json({
                    success: false,
                    message: "Oem Not Found"
                })
            }

            oem.requestForActivationWallets.push(newRequest._id);
            await oem.save();

            // send response
            return res.status(200).json({
                success: true,
                message: "Request for activation wallet sent successfully from deler-oem to oem"
            })
        }


    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in distributorAndOemRequestForActivationWallet"
        })
    }
}


exports.manufacturCanSeeRequestwallets = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Please provide UserID",
            });
        }

        // 1️⃣ Get logged-in user
        const manufacturUser = await User.findById(userId);
        if (!manufacturUser || !manufacturUser.manufacturId) {
            return res.status(404).json({
                success: false,
                message: "Manufacturer not linked with user",
            });
        }

        // 2️⃣ (Optional safety check)
        const manufactur = await ManuFactur.findById(manufacturUser.manufacturId);
        if (!manufactur) {
            return res.status(404).json({
                success: false,
                message: "Manufacturer not found",
            });
        }

        // ✅ 3️⃣ IMPORTANT FIX: use manufacturUser.manufacturId
        const requests = await requestForActivationWallet.find({ manufaturId: userId })

        // In this i want distributorId and Oem Id and activation Id

        let result = [];
        for (const request of requests) {
            const dist = await User.findById(request.distributorId);
            const oem = await User.findById(request.oemId);
            const activationPlan = await wlpActivation.findById(request.activationPlanId);

            // find in every collections
            const realDist = await Distributor.findById(dist?.distributorId);
            const realOem = await OemModelSchema.findById(oem?.oemId);

            const requestDetails = {
                ...request.toObject(),
                distributorName: realDist ? realDist.business_Name : null,
                oemName: realOem ? realOem.business_Name : null,
                activationPlanDetails: activationPlan || null
            };

            result.push(requestDetails);
        };

        if (!requests || requests.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Requests found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Requests fetched successfully",
            length: result.length,
            result,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server Error in manufacturCanSeeRequestwallets",
        });
    }
};



exports.distributor_OrOem_OrdelerDistributor_OrdelerOem = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Please provide UserID",
            });
        }

        // 1️⃣ Logged-in user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // 2️⃣ Build query based on role
        let filter = {};
        if (user.role === "distibutor") {
            filter = { distributorId: userId };
        } else if (user.role === "oem") {
            filter = { oemId: userId };
        } else if (user.role === "dealer-distributor") {
            filter = { DistributordelerId: userId };
        } else if (user.role === "dealer-oem") {
            filter = { oemDelerId: userId };
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid user role for this operation",
            });
        }

        // 3️⃣ Fetch requests
        const requests = await requestForActivationWallet.find(filter);

        if (!requests.length) {
            return res.status(404).json({
                success: false,
                message: "No Requests found",
            });
        }

        // 4️⃣ Enrich response (manufacturer + activation + names)
        const result = [];

        for (const request of requests) {
            //    for distributor request fetch distributor name and manufactur Name Oem name and activation plan details
            if (user.role === "distributor" || user.role === "oem") {
                // Manufacturer
                const manufacturerUser = await User.findById(request.manufaturId);
                const manufacturer = await ManuFactur.findById(manufacturerUser?.manufacturId);

                // Distributor
                let distributorName = null;
                if (request.distributorId) {
                    const distUser = await User.findById(request.distributorId);
                    const realDist = await Distributor.findById(distUser?.distributorId);
                    distributorName = realDist?.business_Name || null;
                }

                // OEM
                let oemName = null;
                if (request.oemId) {
                    const oemUser = await User.findById(request.oemId);
                    const realOem = await OemModelSchema.findById(oemUser?.oemId);
                    oemName = realOem?.business_Name || null;
                }

                // Activation Plan
                const activationPlan = await wlpActivation.findById(
                    request.activationPlanId
                );

                result.push({
                    ...request.toObject(),
                    manufacturerName: manufacturer?.business_Name || null,
                    distributorName,
                    oemName,
                    activationPlanDetails: activationPlan || null,
                });
            }
            if (user.role === "dealer-distributor" || user.role === "dealer-oem") {
                // Distributor
                let distributorName = null;
                if (request.distributorId) {
                    // const distUser = await User.findById(request.distributorId);
                    const realDist = await Distributor.findById(request.distributorId);
                    distributorName = realDist?.business_Name || null;

                }
                // OEM
                let oemName = null;
                if (request.oemId) {
                    // const oemUser = await User.findById(request.oemId);
                    const realOem = await OemModelSchema.findById(request.oemId);
                    oemName = realOem?.business_Name || null;
                }

                // also for delerDistributor and delerOem
                let delerDistributorName = null;
                if (request.DistributordelerId) {
                    const delerDistUser = await User.findById(request.DistributordelerId);
                    const realDelerDist = await CreateDelerUnderDistributor.findById(delerDistUser?.distributorDelerId);
                    delerDistributorName = realDelerDist?.business_Name || null;
                }

                let delerOemName = null;
                if (request.oemDelerId) {
                    const delerOemUser = await User.findById(request.oemDelerId);
                    const realDelerOem = await CreateDelerUnderOems.findById(delerOemUser?.oemsDelerId);
                    delerOemName = realDelerOem?.business_Name || null;
                }


                // Also Send Activation Plan Details
                const activationPlan = await wlpActivation.findById(
                    request.activationPlanId
                );
                result.push({
                    ...request.toObject(),
                    distributorName,
                    oemName,
                    delerDistributorName,
                    delerOemName,
                    activationPlanDetails: activationPlan || null,
                });

            }
        }

        return res.status(200).json({
            success: true,
            message: "Requests fetched successfully",
            length: result.length,
            requests: result,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server Error in distributor_OrOem_OrdelerDistributor_OrdelerOem",
        });
    }
};



// // // // // // // // // // // //    //  //  // /  //
// Before moving to send wallet to next do one thing that fetch all related data
exports.fetchActivationDisptachData = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Please provide UserID",
            });
        }

        const { requestId } = req.body;

        if (!requestId) {
            return res.status(400).json({
                success: false,
                message: "Please provide requestId",
            });
        }

        // in requestForActivationWallet collections fetch all data
        const request = await requestForActivationWallet.findById(requestId);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found",
            });
        }

        // i want all details in inside request
        if (request.distributorId) {
            const manufacturerUser = await User.findById(request.distributorId);
            if (!manufacturerUser) {
                return res.status(404).json({
                    success: false,
                    message: "Manufacturer user not found",
                });
            }

            const manufacturer = await Distributor.findById(manufacturerUser?.distributorId);
            if (!manufacturer) {
                return res.status(404).json({
                    success: false,
                    message: "Manufacturer not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Request data fetched successfully",
                data: {
                    role: "distributor",
                    state: manufacturer.state,
                    partnerName: manufacturer.business_Name,
                    activationPlanId: request.activationPlanId,
                    requestedWalletCount: request.requestedWalletCount,
                }
            });
        }

        if (request.oemId) {
            // also for oem
            const oemUser = await User.findById(request.oemId);
            const oem = await OemModelSchema.findById(oemUser?.oemId);
            if (!oem) {
                return res.status(404).json({
                    success: false,
                    message: "OEM not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Request data fetched successfully",
                data: {
                    role: "oem",
                    state: oem.state,
                    partnerName: oem.business_Name,
                    activationPlanId: request.activationPlanId,
                    requestedWalletCount: request.requestedWalletCount,
                }
            });
        }


    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in fetchData"
        })
    }
}

exports.sendActivationWalletToDistributorOrOem = async (req, res) => {
    try {
        const userId = req.user?.userId;

        const {
            state,
            partnerName,
            distributorId,
            oemId,
            activationPlanId,
            sentWalletAmount,
            sentStockQuantity
        } = req.body;

        if (
            !userId ||
            !state ||
            !partnerName ||
            !activationPlanId ||
            !sentWalletAmount ||
            !sentStockQuantity
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // ❌ Already sent check
        // const alreadySent = await sendActivationWalletToDistributorOrOem.findOne({
        //     partnerName,
        //     activationPlanId
        // });

        // if (alreadySent) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Activation wallet already sent to this partner"
        //     });
        // }

        // 🔹 Manufacturer wallet update
        const manufacturUser = await User.findById(userId);
        const manuf = await ManuFactur.findById(manufacturUser.manufacturId);

        const manufWallet = manuf.walletPriceForActivation;

        if (manufWallet.avaliableStock < sentStockQuantity) {
            return res.status(400).json({
                success: false,
                message: "Insufficient stock in manufacturer's wallet"
            });
        }

        if (manufWallet.balance < sentWalletAmount) {
            return res.status(400).json({
                success: false,
                message: "Insufficient balance in manufacturer's wallet"
            });
        }

        // deduct manufacturer stock & balance
        manufWallet.avaliableStock -= Number(sentStockQuantity);
        manufWallet.balance -= Number(sentWalletAmount);

        if (manufWallet.avaliableStock < 0) manufWallet.avaliableStock = 0;
        if (manufWallet.balance < 0) manufWallet.balance = 0;

        await manuf.save();


        // also do one thing here deduct noOfActivationWallets in sendActivationWalletToManuFacturer collections
        const sendActivationToManu = await sendActivationWalletToManuFacturer.findOne({
            activationWallet: activationPlanId
        });

        if (sendActivationToManu) {
            sendActivationToManu.noOfActivationWallets -= Number(sentStockQuantity);
            if (sendActivationToManu.noOfActivationWallets < 0) {
                sendActivationToManu.noOfActivationWallets = 0;
            }

            await sendActivationToManu.save();
        }


        // 🔹 Save activation transfer record
        const newSendActivation = new sendActivationWalletToDistributorOrOem({
            manufaturId: userId,
            state,
            partnerName,
            distributorId,
            oemId,
            activationPlanId,
            sentWalletAmount,
            sentStockQuantity
        });

        await newSendActivation.save();

        // 🔹 Distributor wallet update
        if (distributorId) {
            const distributor = await Distributor.findById(distributorId);

            if (distributor) {
                distributor.assign_Activation_Packages.push({
                    activationId: activationPlanId
                });

                const wallet = distributor.walletforActivation;

                wallet.availableStock =
                    (wallet.availableStock || 0) + Number(sentStockQuantity);

                wallet.balance =
                    (wallet.balance || 0) + Number(sentWalletAmount);

                await distributor.save();

                // find in user collections
                const userDist = await User.findOne({ distributorId: distributorId });
                // also do in requestForActivationWallet collections update requestStatus to "completed"
                const requestWallet = await requestForActivationWallet.findOne({
                    activationPlanId: activationPlanId,
                    distributorId: userDist?._id
                });
                console.log(requestWallet)

                if (requestWallet) {
                    requestWallet.requestStatus = "completed";
                    await requestWallet.save();
                }
            }
        }

        // 🔹 OEM wallet update
        if (oemId) {
            const oem = await OemModelSchema.findById(oemId);

            if (oem) {
                oem.assign_Activation_Packages.push({
                    activationId: activationPlanId
                });

                const wallet = oem.walletforActivation;

                wallet.availableStock =
                    (wallet.availableStock || 0) + Number(sentStockQuantity);

                wallet.balance =
                    (wallet.balance || 0) + Number(sentWalletAmount);

                await oem.save();

                // find in user collections
                const userOem = await User.findOne({ oemId: oemId });

                // also do in requestForActivationWallet collections update requestStatus to "completed"
                const requestWallet = await requestForActivationWallet.findOne({
                    activationPlanId: activationPlanId,
                    oemId: userOem?._id
                });
                console.log(requestWallet)

                if (requestWallet) {
                    requestWallet.requestStatus = "completed";
                    await requestWallet.save();
                }
            }
        }

        return res.status(200).json({
            success: true,
            message: "Activation wallet sent successfully",
            data: newSendActivation
        });

    } catch (error) {
        console.error("Error in sendActivationWalletToDistributorOrOem:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

exports.fetchmanufacturwalletValues = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Please provide UserID",
            });
        }

        const manufacturUser = await User.findById(userId);

        const manuf = await ManuFactur.findById(manufacturUser.manufacturId);
        if (!manuf) {
            return res.status(404).json({
                success: false,
                message: "Manufacturer not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Manufacturer wallet values fetched successfully",
            walletValues: manuf.walletPriceForActivation
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error in fetchmanufacturwalletValues"
        })
    }
}

exports.fetchdistributorwalletValues = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Please provide UserID",

            });
        }

        const distributorUser = await User.findById(userId);

        const distributor = await Distributor.findById(distributorUser.distributorId);

        if (!distributor) {
            return res.status(404).json({
                success: false,
                message: "Distributor not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Distributor wallet values fetched successfully",
            walletValues: distributor.walletforActivation
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error in fetchdistributorwalletValues"
        })
    }
}

exports.fetchOEMwalletValues = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Please provide UserID",
            });
        }

        const oemUser = await User.findById(userId);
        const oem = await OemModelSchema.findById(oemUser.oemId);
        if (!oem) {
            return res.status(404).json({
                success: false,
                message: "OEM not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "OEM wallet values fetched successfully",
            walletValues: oem.walletforActivation
        });


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Server Error in fetchOEMwalletValues"
        })
    }
}


exports.fetchdelerDistAnddelerOemwalletValues = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: 'Please Provide UserID'
            })
        };

        const user = await User.findById(userId);
        if (!user) {
            return res.status(200).json({
                success: false,
                message: 'User Not Found'
            })
        };

        if (user.role === "dealer-distributor") {
            const deler = await CreateDelerUnderDistributor.findById(user.distributorDelerId);
            if (!deler) {
                return res.status(200).json({
                    success: false,
                    message: 'deler Not Found'
                })
            }

            return res.status(200).json({
                success: true,
                message: "Balanced Fetched SuccessFully",
                walletValues: deler.walletforActivation
            })
        } else {
            const oem = await CreateDelerUnderOems.findById(user.oemsDelerId);
            if (!oem) {
                return res.status(200).json({
                    success: false,
                    message: 'deler Not Found'
                })
            }

            return res.status(200).json({
                success: true,
                message: "Balanced Fetched SuccessFully",
                walletValues: oem.walletforActivation
            })
        }

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server error in fetchdelerDistAnddelerOemwalletValues"
        })
    }
}


exports.fetchManufacturSentActivationWallets = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Please provide UserID",
            });
        }

        const sentWallets = await sendActivationWalletToDistributorOrOem.find({ manufaturId: userId }).populate("activationPlanId");
        if (!sentWallets || sentWallets.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Sent Wallets found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Sent wallets fetched successfully",
            length: sentWallets.length,
            sentWallets,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error in fetchManufacturSentActivationWallets"
        })
    }
}

// fetch Distributor or Oem received activation wallets
exports.fetchDistributorOrOemReceivedActivationWallets = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Please provide UserID",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        let activationIds = [];

        // 🟢 DISTRIBUTOR
        if (user.role === "dealer-distributor") {
            const dist = await Distributor.findById(user.distributorId);
            if (!dist) {
                return res.status(404).json({
                    success: false,
                    message: "Distributor not found",
                });
            }

            activationIds = [
                ...new Set(
                    dist.assign_Activation_Packages.map(item =>
                        item.activationId.toString()
                    )
                )
            ];
        }

        // 🟢 OEM
        else if (user.role === "dealer-oem") {
            const oem = await OemModelSchema.findById(user.oemId);
            if (!oem) {
                return res.status(404).json({
                    success: false,
                    message: "OEM not found",
                });
            }

            activationIds = [
                ...new Set(
                    oem.assign_Activation_Packages.map(item =>
                        item.activationId.toString()
                    )
                )
            ];
        }

        // ❌ Invalid role
        else {
            return res.status(400).json({
                success: false,
                message: "Invalid user role for this operation",
            });
        }

        // 🔥 FETCH ACTIVATION PLAN DETAILS
        const activationPlans = await wlpActivation.find({
            _id: { $in: activationIds }
        });

        return res.status(200).json({
            success: true,
            message: "Activation plans fetched successfully",
            data: activationPlans
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server Error in fetchDistributorOrOemReceivedActivationWallets",
        });
    }
};



// Here i do that distributor and oem can see all request comming from dealer-distributor and dealer-oem
exports.fetchAllRequestsFromDealer = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Please provide UserID",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        let requests = [];

        // 🟢 DISTRIBUTOR
        if (user.role === "distibutor") {
            // populate delerId and also populate activationPlanId
            requests = await requestForActivationWallet.find({ distributorId: user.distributorId }).populate("activationPlanId");

            // find in USER COllections 
            for (let dealerId of requests.map(r => r.DistributordelerId).filter(Boolean)) {

                const userDist = await User.findById(dealerId);
                const delerDist = await CreateDelerUnderDistributor.findById(
                    userDist?.distributorDelerId
                );

                requests = requests.map(r => {
                    if (
                        r.DistributordelerId &&
                        r.DistributordelerId.toString() === dealerId.toString()
                    ) {
                        return {
                            ...(r._doc ?? r),   // ✅ SAFE replacement for toObject()
                            dealerName: delerDist?.business_Name || null
                        };
                    }
                    return r;
                });
            }

        }

        // 🟢 OEM
        else if (user.role === "oem") {
            requests = await requestForActivationWallet.find({ oemId: user.oemId }).populate("activationPlanId");

            /// find in USER COllections 
            for (let dealerId of requests.map(r => r.oemDelerId).filter(Boolean)) {
                const userOem = await User.findById(dealerId);
                const delerOem = await CreateDelerUnderOems.findById(
                    userOem?.oemsDelerId
                );

                requests = requests.map(r => {
                    if (
                        r.oemDelerId &&
                        r.oemDelerId.toString() === dealerId.toString()
                    ) {
                        return {
                            ...(r._doc ?? r),   // ✅ SAFE replacement for toObject()
                            dealerName: delerOem?.business_Name || null
                        };
                    }
                    return r;
                });
            }
        }

        // ❌ Invalid role
        else {
            return res.status(400).json({
                success: false,
                message: "Invalid user role for this operation",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Requests fetched successfully",
            length: requests.length,
            data: requests
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server Error in fetchAllRequestsFromDealer",
        });
    }
};
// some oem work pending in just this above api


exports.distributorSendToManufacturORoemSendToManufacturer = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: "Please Provide UserID"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(200).json({
                success: false,
                message: "User Not found"
            });
        }

        let manufacturName = null;
        let request = [];
        let realMan = null;

        if (user.role === "distibutor") {
            const dist = await Distributor.findById(user.distributorId);
            if (!dist) {
                return res.status(200).json({
                    success: false,
                    message: "Distributor not found"
                });
            }

            // manufacturer user
            realMan = await User.findById(dist.manufacturId);

            if (realMan?.manufacturId) {
                const manu = await ManuFactur.findById(realMan.manufacturId);
                manufacturName = manu?.business_Name || null;
            }

            request = await requestForActivationWallet.find({
                manufaturId: realMan?._id,
                distributorId: userId
            });

            // ✅ manufacturName ALWAYS returned
            return res.status(200).json({
                success: true,
                message: "Received Successfully",
                request,
                manufacturName
            });
        }
        if (user.role === "oem") {
            const oem = await CreateOemModel.findById(user.oemId);
            // manufacturer user
            realMan = await User.findById(oem.manufacturId);

            if (realMan?.manufacturId) {
                const manu = await ManuFactur.findById(realMan.manufacturId);
                manufacturName = manu?.business_Name || null;
            }

            request = await requestForActivationWallet.find({
                manufaturId: realMan?._id,
                oemId: userId
            });
            // ✅ manufacturName ALWAYS returned
            return res.status(200).json({
                success: true,
                message: "Received Successfully",
                request,
                manufacturName
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error in distributorSendToManufacturORoemSendToManufacturer"
        });
    }
};


exports.fetchParticularDelerRequestForSendWallet = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: "Please Provide UserId"
            })
        }

        const { requestId } = req.body;

        if (!requestId) {
            return res.status(200).json({
                success: false,
                message: "Please Provide requestId"
            })
        }

        // find in request Schema for delerDistributor and delerOem
        const allReq = await requestForActivationWallet.findById(requestId);
        if (!allReq) {
            return res.status(200).json({
                success: false,
                message: "Request Not Found"
            })
        }

        if (allReq.DistributordelerId) {
            // main logic for find distributorDelerUser
            const distributorDelerUser = await User.findById(allReq.DistributordelerId);
            if (!distributorDelerUser) {
                return res.status(200).json({
                    success: false,
                    message: "User Not Found",
                })
            }

            // also find in real deler
            const realDeler = await CreateDelerUnderDistributor.findById(distributorDelerUser.distributorDelerId);
            if (!realDeler) {
                return res.status(200).json({
                    success: false,
                    message: "Real Deler Not Found",
                })
            }
            return res.status(200).json({
                success: true,
                message: "Fetched Successfully",
                data: {
                    role: "distributor-deler",
                    state: realDeler.state,
                    partnerName: realDeler.business_Name,
                    activationPlanId: allReq.activationPlanId,
                    requestedWalletCount: allReq.requestedWalletCount,
                }
            })
        } else {

            // main logic
            const oemDelerUser = await User.findById(allReq.oemDelerId)
            if (!oemDelerUser) {
                return res.status(200).json({
                    success: false,
                    message: "User Not Found",
                })
            }

            // also find in real deler
            const realDeler = await CreateDelerUnderOems.findById(oemDelerUser.oemsDelerId);
            if (!realDeler) {
                return res.status(200).json({
                    success: false,
                    message: "Real Deler Not Found",
                })
            }
            return res.status(200).json({
                success: true,
                message: "Fetched Successfully",
                data: {
                    role: "distributor-deler",
                    state: realDeler.state,
                    partnerName: realDeler.business_Name,
                    activationPlanId: allReq.activationPlanId,
                    requestedWalletCount: allReq.requestedWalletCount,
                }
            })

        }

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in fetchParticularDelerRequestForSendWallet"
        })
    }
}
// Some Pending work is there not complite






// distributor send wallet to deler
exports.sendWalletDistributorToDeler = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: "Please Provide UserId"
            })
        }

        const {
            state,
            partnerName,
            distDelerId,
            activationPlanId,
            sentWalletAmount,
            sentStockQuantity
        } = req.body;

        if (
            !userId ||
            !state ||
            !partnerName ||
            !activationPlanId ||
            !sentWalletAmount ||
            !sentStockQuantity
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // This means Distributor
        const userDist = await User.findById(userId);
        if (!userDist) {
            return res.status(200).json({
                success: false,
                message: "User Not Found"
            })
        }

        // find in distributor collections
        const realDist = await Distributor.findById(userDist.distributorId);
        if (!realDist) {
            return res.status(200).json({
                success: false,
                message: "Distributor Not Found"
            })
        }

        // deduct the price and stock from distributor
        const distDelerWallet = realDist.walletforActivation;

        if (distDelerWallet.availableStock < sentStockQuantity) {
            return res.status(400).json({
                success: false,
                message: "Insufficient stock in Distributor's wallet"
            });
        }

        if (distDelerWallet.balance < sentWalletAmount) {
            return res.status(400).json({
                success: false,
                message: "Insufficient balance in Distributor's wallet"
            });
        }

        distDelerWallet.availableStock -= Number(sentStockQuantity);
        distDelerWallet.balance -= Number(sentWalletAmount);

        if (distDelerWallet.availableStock < 0) distDelerWallet.availableStock = 0;
        if (distDelerWallet.balance < 0) distDelerWallet.balance = 0;


        // ✅ save parent document
        await realDist.save();

        // also do one thing here deduct noOfActivationWallets in sendActivationWalletToManuFacturer collections
        const sendActivationToManu = await sendActivationWalletToManuFacturer.findOne({
            activationWallet: activationPlanId
        });

        if (sendActivationToManu) {
            sendActivationToManu.noOfActivationWallets -= Number(sentStockQuantity);
            if (sendActivationToManu.noOfActivationWallets < 0) {
                sendActivationToManu.noOfActivationWallets = 0;
            }

            await sendActivationToManu.save();
        }



        // Here for add stock and balance to delerId
        const deler = await User.findById(distDelerId);
        if (!deler) {
            return res.status(200).json({
                success: false,
                message: "deler User Not FOund"
            })
        }

        // find in deler Collection
        const realNewDeler = await CreateDelerUnderDistributor.findById(deler.distributorDelerId);
        if (!realNewDeler) {
            return res.status(200).json({
                success: false,
                message: "Real deler Not FOund"
            })
        }

        // add stock and balance
        realNewDeler.assign_Activation_Packages.push({
            activationId: activationPlanId
        })

        const wallet = realNewDeler.walletforActivation;

        wallet.availableStock =
            (wallet.availableStock || 0) + Number(sentStockQuantity);

        wallet.balance =
            (wallet.balance || 0) + Number(sentWalletAmount);

        await realNewDeler.save();

        const newSendActivation = new sendwalletDistDelerOemDeler({
            distributorId: userId,
            distDelerId: distDelerId,
            state,
            partnerName,
            activationPlanId,
            sentWalletAmount,
            sentStockQuantity
        });

        await newSendActivation.save();

        const requestWallet = await requestForActivationWallet.findOne({
            activationPlanId: activationPlanId,
            DistributordelerId: distDelerId,
            requestedWalletCount: sentStockQuantity
        });

        if (requestWallet) {
            requestWallet.requestStatus = "completed";
            await requestWallet.save();
        }


        return res.status(200).json({
            success: true,
            message: "Fetched SuccessFully",
            distDelerWallet
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in sendWalletDistributorToDeler"
        })
    }
}





// exports.manuFacturMAPaDevice = async (req, res) => {

//     try {
//         const userId = req.user.userId;

//         if (!userId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Please provide userId",
//             });
//         }

//         // ✅ Extract fields
//         let {
//             country,
//             state,
//             distributorName,
//             delerName,
//             deviceType,
//             deviceNo,
//             voltage,
//             elementType,
//             batchNo,
//             simDetails,
//             VechileBirth,
//             RegistrationNo,
//             date,
//             ChassisNumber,
//             EngineNumber,
//             VehicleType,
//             MakeModel,
//             ModelYear,
//             InsuranceRenewDate,
//             PollutionRenewdate,
//             fullName,
//             email,
//             mobileNo,
//             GstinNo,
//             Customercountry,
//             Customerstate,
//             Customerdistrict,
//             Rto,
//             PinCode,
//             CompliteAddress,
//             AdharNo,
//             PanNo,
//             Packages,
//             InvoiceNo,
//             VehicleKMReading,
//             DriverLicenseNo,
//             MappedDate,
//             NoOfPanicButtons,
//         } = req.body;

//         console.log("Before SON.parse")

//         if (typeof simDetails === "string") {
//             simDetails = JSON.parse(simDetails);
//         }

//         console.log("After SON.parse")




//         const requiredFiles = [
//             "Vechile_Doc",
//             "Rc_Doc",
//             "Pan_Card",
//             "Device_Doc",
//             "Adhar_Card",
//             "Invious_Doc",
//             "Signature_Doc",
//             "Panic_Sticker",
//         ];

//         // for (let field of requiredFiles) {
//         //     if (!req.files?.[field] || req.files[field].length === 0) {
//         //         return res.status(400).json({
//         //             success: false,
//         //             message: `${field} file is required`,
//         //         });
//         //     }
//         // }

//         // ✅ Upload all files to Cloudinary
//         const uploadToCloudinary = async (fieldName) => {
//             if (!req.files || !req.files[fieldName] || req.files[fieldName].length === 0) {
//                 return null; // ✅ No file uploaded
//             }

//             const file = req.files[fieldName][0];
//             const uploaded = await cloudinary.uploader.upload(file.path, {
//                 folder: "profile_pics",
//                 resource_type: "raw"
//             });

//             return uploaded.secure_url;
//         };



//         const [
//             vc,
//             Rc,
//             Pc,
//             Dc,
//             Ac,
//             Ic,
//             Sc,
//             Ps
//         ] = await Promise.all([
//             uploadToCloudinary("Vechile_Doc"),
//             uploadToCloudinary("Rc_Doc"),
//             uploadToCloudinary("Pan_Card"),
//             uploadToCloudinary("Device_Doc"),
//             uploadToCloudinary("Adhar_Card"),
//             uploadToCloudinary("Invious_Doc"),
//             uploadToCloudinary("Signature_Doc"),
//             uploadToCloudinary("Panic_Sticker"),
//         ]);

//         // ✅ Create a new MapDevice document
//         const newMapDevice = new MapDevice({
//             manufacturId: userId,
//             country,
//             state,
//             distributorName,
//             delerName,
//             deviceType,
//             deviceNo,
//             voltage,
//             elementType,
//             batchNo,
//             simDetails,
//             VechileBirth,
//             RegistrationNo,
//             date,
//             ChassisNumber,
//             EngineNumber,
//             VehicleType,
//             MakeModel,
//             ModelYear,
//             InsuranceRenewDate,
//             PollutionRenewdate,
//             fullName,
//             email,
//             mobileNo,
//             GstinNo,
//             Customercountry,
//             Customerstate,
//             Customerdistrict,
//             Rto,
//             PinCode,
//             CompliteAddress,
//             AdharNo,
//             PanNo,
//             Packages,
//             InvoiceNo,
//             VehicleKMReading,
//             DriverLicenseNo,
//             MappedDate,
//             NoOfPanicButtons,
//             VechileIDocument: vc,
//             RcDocument: Rc,
//             DeviceDocument: Dc,
//             PanCardDocument: Pc,
//             AdharCardDocument: Ac,
//             InvoiceDocument: Ic,
//             SignatureDocument: Sc,
//             PanicButtonWithSticker: Ps,
//         });

//         await newMapDevice.save();

// console.log("Device Mapped")
//         const newDeviceObject = {
//             deviceType,
//             deviceNo,
//             voltage,
//             elementType,
//             batchNo,
//             simDetails,
//             Packages,
//             VechileBirth,
//             RegistrationNo,
//             date,
//             ChassisNumber,
//             EngineNumber,
//             VehicleType,
//             MakeModel,
//             ModelYear,
//             InsuranceRenewDate,
//             PollutionRenewdate,
//         };

//         // ✅ Check if customer already exists
//         let customer = await CoustmerDevice.findOne({
//             mobileNo: mobileNo
//         });

//         // ✅ If customer not exist → create
//         if (!customer) {
//             console.log("Before coustmer")
//             customer = new  CoustmerDevice({
//                 manufacturId: userId,
//                 delerId: null,
//                 fullName,
//                 email,
//                 mobileNo,
//                 GstinNo,
//                 Customercountry,
//                 Customerstate,
//                 Customerdistrict,
//                 Rto,
//                 PinCode,
//                 CompliteAddress,
//                 AdharNo,
//                 PanNo,
//                 devicesOwened: [newDeviceObject], // ✅ FIRST DEVICE
//             });

//             await customer.save();
//             console.log("✅ CUSTOMER CREATED:", customer);
//         }
//         // ✅ If exists → push device to devicesOwened array
//         else {
//             await CoustmerDevice.findByIdAndUpdate(customer._id, {
//                 $push: {
//                     devicesOwened: newDeviceObject
//                 }
//             });
//             console.log("✅ DEVICE ADDED TO EXISTING CUSTOMER:", customer._id);
//         }

//         console.log('coustmer done')
//         // and here save in user collections also
//         const user = await User.findOne({ email });

//         if (user) {
//             return res.status(200).json({
//                 success: false,
//                 message: "user already exists with this email",
//             });
//         }

//         const newUser = await User.create({
//             email: email,
//             password: mobileNo,
//             role: "coustmer",
//             coustmerId: customer._id,
//         });

//         console.log("userDone")

//         return res.status(200).json({
//             success: true,
//             message: "Device mapped successfully",
//             data: newMapDevice,
//         });
//     } catch (error) {
//         console.error("Error in manuFacturMAPaDevice:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Server error while mapping device",
//             error: error.message,
//         });
//     }
// };
// exports.manuFacturMAPaDevice = async (req, res) => {
//     try {
//         const userId = req.user.userId;

//         if (!userId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Please provide userId",
//             });
//         }

//         // ✅ Extract fields
//         let {
//             country, state, distributorName, delerName, deviceType,
//             deviceNo, voltage, elementType, batchNo, simDetails,
//             VechileBirth, RegistrationNo, date, ChassisNumber,
//             EngineNumber, VehicleType, MakeModel, ModelYear,
//             InsuranceRenewDate, PollutionRenewdate, fullName,
//             email, mobileNo, GstinNo, Customercountry,
//             Customerstate, Customerdistrict, Rto, PinCode,
//             CompliteAddress, AdharNo, PanNo, Packages,
//             InvoiceNo, VehicleKMReading, DriverLicenseNo,
//             MappedDate, NoOfPanicButtons,
//         } = req.body;

//         // ✅ Check if user already exists BEFORE creating anything
//         if (email) {
//             const existingUser = await User.findOne({ email });
//             if (existingUser) {
//                 return res.status(400).json({
//                     success: false,
//                     message: "User already exists with this email",
//                 });
//             }
//         }

//         console.log("Before JSON.parse");

//         // ✅ Parse simDetails safely
//         try {
//             if (typeof simDetails === "string") {
//                 simDetails = JSON.parse(simDetails);
//             }
//         } catch (parseError) {
//             console.error("Error parsing simDetails:", parseError);
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid simDetails format",
//             });
//         }

//         console.log("After JSON.parse");

//         // ✅ Upload all files to Cloudinary
//         const uploadToCloudinary = async (fieldName) => {
//             if (!req.files || !req.files[fieldName] || req.files[fieldName].length === 0) {
//                 return null;
//             }

//             try {
//                 const file = req.files[fieldName][0];
//                 const uploaded = await cloudinary.uploader.upload(file.path, {
//                     folder: "profile_pics",
//                     resource_type: "raw"
//                 });
//                 return uploaded.secure_url;
//             } catch (uploadError) {
//                 console.error(`Error uploading ${fieldName}:`, uploadError);
//                 return null;
//             }
//         };

//         console.log("Uploading files to Cloudinary...");

//         const [vc, Rc, Pc, Dc, Ac, Ic, Sc, Ps] = await Promise.all([
//             uploadToCloudinary("Vechile_Doc"),
//             uploadToCloudinary("Rc_Doc"),
//             uploadToCloudinary("Pan_Card"),
//             uploadToCloudinary("Device_Doc"),
//             uploadToCloudinary("Adhar_Card"),
//             uploadToCloudinary("Invious_Doc"),
//             uploadToCloudinary("Signature_Doc"),
//             uploadToCloudinary("Panic_Sticker"),
//         ]);

//         console.log("Files uploaded successfully");

//         // ✅ Create a new MapDevice document
//         const newMapDevice = new MapDevice({
//             manufacturId: userId,
//             country, state, distributorName, delerName,
//             deviceType, deviceNo, voltage, elementType,
//             batchNo, simDetails, VechileBirth, RegistrationNo,
//             date, ChassisNumber, EngineNumber, VehicleType,
//             MakeModel, ModelYear, InsuranceRenewDate,
//             PollutionRenewdate, fullName, email, mobileNo,
//             GstinNo, Customercountry, Customerstate,
//             Customerdistrict, Rto, PinCode, CompliteAddress,
//             AdharNo, PanNo, Packages, InvoiceNo,
//             VehicleKMReading, DriverLicenseNo, MappedDate,
//             NoOfPanicButtons, VechileIDocument: vc,
//             RcDocument: Rc, DeviceDocument: Dc,
//             PanCardDocument: Pc, AdharCardDocument: Ac,
//             InvoiceDocument: Ic, SignatureDocument: Sc,
//             PanicButtonWithSticker: Ps,
//         });

//         // const newMapDevice = new MapDevice({
//         //     manufacturId: userId,
//         //     country, state, distributorName, delerName,
//         //     deviceType, deviceNo, voltage, elementType,
//         //     batchNo, simDetails, VechileBirth, RegistrationNo,
//         //     date, ChassisNumber, EngineNumber, VehicleType,
//         //     MakeModel, ModelYear, InsuranceRenewDate,
//         //     PollutionRenewdate, fullName, email, mobileNo,
//         //     GstinNo, Customercountry, Customerstate,
//         //     Customerdistrict, Rto, PinCode, CompliteAddress,
//         //     AdharNo, PanNo, Packages, InvoiceNo,
//         //     VehicleKMReading, DriverLicenseNo, MappedDate,
//         //     NoOfPanicButtons, VechileIDocument: null,
//         //     RcDocument: null, DeviceDocument: null,
//         //     PanCardDocument: null, AdharCardDocument: null,
//         //     InvoiceDocument: null, SignatureDocument: null,
//         //     PanicButtonWithSticker: null,
//         // });

//         await newMapDevice.save();
//         console.log("✅ Device Mapped successfully");

//         // ✅ Convert Packages to ObjectId if it's a string
//         let packageId = null;
//         if (Packages) {
//             try {
//                 packageId = mongoose.Types.ObjectId(Packages);
//                 console.log("Package ID converted:", packageId);
//             } catch (err) {
//                 console.log("⚠️ Invalid Package ID, setting to null");
//                 packageId = null;
//             }
//         }

//         // // ✅ Create device object with proper ObjectId for Packages
//         // const newDeviceObject = {
//         //     deviceType,
//         //     deviceNo,
//         //     voltage,
//         //     elementType,
//         //     batchNo,
//         //     simDetails,
//         //     Packages: packageId, // ✅ Now it's ObjectId or null
//         //     VechileBirth,
//         //     RegistrationNo,
//         //     date,
//         //     ChassisNumber,
//         //     EngineNumber,
//         //     VehicleType,
//         //     MakeModel,
//         //     ModelYear,
//         //     InsuranceRenewDate,
//         //     PollutionRenewdate,
//         // };

//         //    Here I have  to create coustmer

//         // ✅ Check if customer already exists by mobileNo
//         let customer = await CoustmerDevice.findOne({ mobileNo });

//         if (!customer) {
//             // ✅ Create new customer
//             customer = new CoustmerDevice({
//                 manufacturId: userId,
//                 delerId: null,
//                 fullName,
//                 email,
//                 mobileNo,
//                 GstinNo,
//                 Customercountry,
//                 Customerstate,
//                 Customerdistrict,
//                 Rto,
//                 PinCode,
//                 CompliteAddress,
//                 AdharNo,
//                 PanNo,
//                 devicesOwened: []  // initially empty
//             });

//             await customer.save();
//             console.log("✅ New customer created");
//         }

//         // ✅ Build device object as per schema
//         const deviceObject = {
//             deviceType,
//             deviceNo,
//             voltage,
//             elementType,
//             batchNo,
//             simDetails,       // ← this is already parsed earlier
//             Packages: packageId,
//             VechileBirth,
//             RegistrationNo,
//             date,
//             ChassisNumber,
//             EngineNumber,
//             VehicleType,
//             MakeModel,
//             ModelYear,
//             InsuranceRenewDate,
//             PollutionRenewdate
//         };

//         // ✅ Push device into customer's devicesOwened array
//         customer.devicesOwened.push(deviceObject);
//         await customer.save();

//         console.log("✅ Device added to customer's devicesOwened");



//         return res.status(200).json({
//             success: true,
//             message: "Device mapped successfully and customer account created",
//             data: newMapDevice,
//             customer,
//         });

//     } catch (error) {
//         console.error("❌ Error in manuFacturMAPaDevice:");
//         console.error("Error name:", error.name);
//         console.error("Error message:", error.message);
//         console.error("Error stack:", error.stack);

//         return res.status(500).json({
//             success: false,
//             message: "Server error while mapping device",
//             error: error.message,
//             errorType: error.name,
//         });
//     }
// };


// NOTE: Assuming models (User, MapDevice, CoustmerDevice) and
// utilities (cloudinary, mongoose) are correctly imported in your environment.



// exports.manuFacturMAPaDevice = async (req, res) => {
//     try {
//         const userId = req.user.userId;

//         if (!userId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Please provide userId",
//             });
//         }

//         // ✅ Extract fields
//         let {
//             country, state, distributorName, delerName, deviceType,
//             deviceNo, voltage, elementType, batchNo, simDetails,
//             VechileBirth, RegistrationNo, date, ChassisNumber,
//             EngineNumber, VehicleType, MakeModel, ModelYear,
//             InsuranceRenewDate, PollutionRenewdate, fullName,
//             email, mobileNo, GstinNo, Customercountry,
//             Customerstate, Customerdistrict, Rto, PinCode,
//             CompliteAddress, AdharNo, PanNo, Packages,
//             InvoiceNo, VehicleKMReading, DriverLicenseNo,
//             MappedDate, NoOfPanicButtons,
//         } = req.body;

//         // ✅ Parse simDetails safely
//         try {
//             if (typeof simDetails === "string") {
//                 simDetails = JSON.parse(simDetails);
//             }
//         } catch (err) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid simDetails format",
//             });
//         }

//         // ✅ File upload helper
//         // const uploadToCloudinary = async (fieldName) => {
//         //     if (!req.files || !req.files[fieldName] || req.files[fieldName].length === 0) {
//         //         return null;
//         //     }

//         //     const file = req.files[fieldName][0];
//         //     try {
//         //         const uploaded = await cloudinary.uploader.upload(file.path, {
//         //             folder: "profile_pics",
//         //             resource_type: "raw",
//         //         });
//         //         return uploaded.secure_url;
//         //     } catch (error) {
//         //         return null;
//         //     }
//         // };

//         // // ✅ Upload all files
//         // const [vc, Rc, Pc, Dc, Ac, Ic, Sc, Ps] = await Promise.all([
//         //     uploadToCloudinary("Vechile_Doc"),
//         //     uploadToCloudinary("Rc_Doc"),
//         //     uploadToCloudinary("Pan_Card"),
//         //     uploadToCloudinary("Device_Doc"),
//         //     uploadToCloudinary("Adhar_Card"),
//         //     uploadToCloudinary("Invious_Doc"),
//         //     uploadToCloudinary("Signature_Doc"),
//         //     uploadToCloudinary("Panic_Sticker"),
//         // ]);

//         // ✅ Step 1: Create MapDevice
//         // const newMapDevice = new MapDevice({
//         //     manufacturId: userId,
//         //     country, state, distributorName, delerName,
//         //     deviceType, deviceNo, voltage, elementType,
//         //     batchNo, simDetails, VechileBirth, RegistrationNo,
//         //     date, ChassisNumber, EngineNumber, VehicleType,
//         //     MakeModel, ModelYear, InsuranceRenewDate,
//         //     PollutionRenewdate, fullName, email, mobileNo,
//         //     GstinNo, Customercountry, Customerstate,
//         //     Customerdistrict, Rto, PinCode, CompliteAddress,
//         //     AdharNo, PanNo, Packages, InvoiceNo,
//         //     VehicleKMReading, DriverLicenseNo, MappedDate,
//         //     NoOfPanicButtons, VechileIDocument: vc,
//         //     RcDocument: Rc, DeviceDocument: Dc,
//         //     PanCardDocument: Pc, AdharCardDocument: Ac,
//         //     InvoiceDocument: Ic, SignatureDocument: Sc,
//         //     PanicButtonWithSticker: Ps,
//         // });

//         const newMapDevice = new MapDevice({
//             manufacturId: userId,
//             country, state, distributorName, delerName,
//             deviceType, deviceNo, voltage, elementType,
//             batchNo, simDetails, VechileBirth, RegistrationNo,
//             date, ChassisNumber, EngineNumber, VehicleType,
//             MakeModel, ModelYear, InsuranceRenewDate,
//             PollutionRenewdate, fullName, email, mobileNo,
//             GstinNo, Customercountry, Customerstate,
//             Customerdistrict, Rto, PinCode, CompliteAddress,
//             AdharNo, PanNo, Packages, InvoiceNo,
//             VehicleKMReading, DriverLicenseNo, MappedDate,
//             NoOfPanicButtons, VechileIDocument: null,
//             RcDocument: null, DeviceDocument: null,
//             PanCardDocument: null, AdharCardDocument: null,
//             InvoiceDocument: null, SignatureDocument: null,
//             PanicButtonWithSticker: null,
//         });

//         await newMapDevice.save();

//         // ✅ Step 2: Check if customer already exists
//         let customer = await CoustmerDevice.findOne({ mobileNo });

//         if (!customer) {
//             // ✅ New customer
//             customer = new CoustmerDevice({
//                 manufacturId: userId,
//                 fullName,
//                 email,
//                 mobileNo,
//                 GstinNo,
//                 Customercountry,
//                 Customerstate,
//                 Customerdistrict,
//                 Rto,
//                 PinCode,
//                 CompliteAddress,
//                 AdharNo,
//                 PanNo,
//                 devicesOwened: [],
//             });
//         }

//         // ✅ Step 3: Prepare device object for customer schema
//         const deviceObject = {
//             deviceType,
//             deviceNo,
//             voltage,
//             elementType,
//             batchNo,
//             simDetails,
//             Packages,
//             VechileBirth,
//             RegistrationNo,
//             date,
//             ChassisNumber,
//             EngineNumber,
//             VehicleType,
//             MakeModel,
//             ModelYear,
//             InsuranceRenewDate,
//             PollutionRenewdate,
//         };

//         // ✅ Step 4: Push device into customer's devicesOwened[]
//         customer.devicesOwened.push(deviceObject);

//         // ✅ Step 5: Save customer
//         await customer.save();

//         // also save in user collections
//         const user = await User.findOne({ email });

//         if (!user) {
//             const newUser = await User.create({
//                 email: email,
//                 password: mobileNo,
//                 role: "coustmer",
//                 coustmerId: customer._id,
//             });
//         }


//         return res.status(200).json({
//             success: true,
//             message: "Device mapped & customer updated successfully",
//             mapDevice: newMapDevice,
//             customer,
//         });

//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: "Server error while mapping device",
//             error: error.message,
//         });
//     }
// };


exports.manuFacturMAPaDevice = async (req, res) => {
    try {
        const userId = req.user && req.user.userId;
        if (!userId) {
            return res.status(400).json({ success: false, message: "Please provide userId" });
        }

        // Extract fields
        let {
            country, state, distributorName, delerName, deviceType,
            deviceNo, voltage, elementType, batchNo, simDetails,
            VechileBirth, RegistrationNo, date, ChassisNumber,
            EngineNumber, VehicleType, MakeModel, ModelYear,
            InsuranceRenewDate, PollutionRenewdate, fullName,
            email, mobileNo, GstinNo, Customercountry,
            Customerstate, Customerdistrict, Rto, PinCode,
            CompliteAddress, AdharNo, PanNo, Packages,
            InvoiceNo, VehicleKMReading, DriverLicenseNo,
            MappedDate, NoOfPanicButtons, vechileNo
        } = req.body;

        // Parse simDetails if string
        try {
            if (typeof simDetails === "string" && simDetails.trim() !== "") {
                simDetails = JSON.parse(simDetails);
            }
        } catch (err) {
            return res.status(400).json({ success: false, message: "Invalid simDetails format" });
        }

        // Convert Packages to ObjectId if possible (keep as string/null otherwise)


        // Create and save MapDevice quickly (no file uploads in this path)
        const newMapDevice = new MapDevice({
            manufacturId: userId,
            country, state, distributorName, delerName,
            deviceType, deviceNo, voltage, elementType,
            batchNo, simDetails, VechileBirth, RegistrationNo,
            date, ChassisNumber, EngineNumber, VehicleType,
            MakeModel, ModelYear, InsuranceRenewDate,
            PollutionRenewdate, fullName, email, mobileNo,
            GstinNo, Customercountry, Customerstate,
            Customerdistrict, Rto, PinCode, CompliteAddress,
            AdharNo, PanNo, Packages, InvoiceNo,
            VehicleKMReading, DriverLicenseNo, MappedDate,
            NoOfPanicButtons,
            vechileNo,
            // documents left null for now (upload separately if needed)
            VechileIDocument: null,
            RcDocument: null,
            DeviceDocument: null,
            PanCardDocument: null,
            AdharCardDocument: null,
            InvoiceDocument: null,
            SignatureDocument: null,
            PanicButtonWithSticker: null,
        });

        const savedMapDevice = await newMapDevice.save();
        // Immediate response to client (fast)
        res.status(200).json({
            success: true,
            message: "Device mapped successfully (background customer/user processing started)",
            mapDeviceId: savedMapDevice._id
        });

        // Background processing (non-blocking)
        setImmediate(async () => {
            console.time(`manuFacturMAPaDevice:${savedMapDevice._id}`);

            try {
                const deviceObject = {
                    deviceType,
                    deviceNo,
                    voltage,
                    elementType,
                    batchNo,
                    simDetails,
                    Packages,
                    VechileBirth,
                    RegistrationNo,
                    date,
                    ChassisNumber,
                    EngineNumber,
                    VehicleType,
                    MakeModel,
                    ModelYear,
                    InsuranceRenewDate,
                    PollutionRenewdate,
                    vechileNo,
                };

                // ✅ Create or update customer AND return customer document
                const savedCustomer = await CoustmerDevice.findOneAndUpdate(
                    { mobileNo },
                    {
                        $setOnInsert: {
                            manufacturId: userId,
                            fullName,
                            email,
                            mobileNo,
                            GstinNo,
                            Customercountry,
                            Customerstate,
                            Customerdistrict,
                            Rto,
                            PinCode,
                            CompliteAddress,
                            AdharNo,
                            PanNo
                        },
                        $push: { devicesOwened: deviceObject }
                    },
                    {
                        upsert: true,
                        new: true // ✅ returns the document
                    }
                );

                console.timeLog(`manuFacturMAPaDevice:${savedMapDevice._id}`, "customer saved");

                // ✅ Now insert coustmerId = savedCustomer._id
                // ✅ Check if user already exists

                // await User.updateOne(
                //     { email },
                //     {
                //         $setOnInsert: {
                //             email,
                //             password: mobileNo,
                //             role: "coustmer",
                //             coustmerId: savedCustomer._id
                //         }
                //     },
                //     { upsert: true }
                // );


                const existingUser = await User.findOne({ email });

                if (!existingUser) {
                    // ✅ Create new user
                    await User.create({
                        email,
                        password: mobileNo,
                        role: "coustmer",
                        coustmerId: savedCustomer._id
                    });

                    console.log("✅ New user created");
                } else {
                    console.log("✅ User already exists, not creating again");
                }


                console.timeLog(`manuFacturMAPaDevice:${savedMapDevice._id}`, "user processed");
                console.timeEnd(`manuFacturMAPaDevice:${savedMapDevice._id}`);

            } catch (err) {
                console.error("Background processing error:", err);
            }
        });


        // done – immediate response was already sent above

    } catch (error) {
        console.error("Error in manuFacturMAPaDevice (main):", error);
        // If we haven't sent a response yet
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: "Server error while mapping device",
                error: error.message
            });
        }
        // otherwise just log
    }
};



exports.fetchCoustmerallDevices = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Please provide userId",
            });
        }

        // fetch coustmer on the basis of userId
        const user = await User.findById(userId);

        if (!user) {
            return res.status(200).json({
                success: false,
                message: "No Coustmer Found",
            });
        }


        // find in coustmer device collections
        const coustmer = await CoustmerDevice.findById(user.coustmerId);

        if (!coustmer) {
            return res.status(200).json({
                success: false,
                message: "No Coustmer Device Found",
            });
        }



        return res.status(200).json({
            success: true,
            message: "Coustmer Fetched Successfully",
            devicesOwened: coustmer.devicesOwened,
        });

    } catch (error) {
        console.error("❌ Error in createCoustmer:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while creating coustmer",
            error: error.message,
        });
    }
};

exports.fetchCoustmerSingleDevice = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Please provide userId",
            });
        }

        const { deviceNo } = req.body;

        if (!deviceNo) {
            return res.status(200).json({
                success: false,
                message: "Please Provide deviceNo",
            });
        }

        // fetch coustmer on the basis of userId
        const device = await CoustmerDevice.findOne({ "devicesOwened.deviceNo": deviceNo }, { "devicesOwened.$": 1 });

        if (!device) {
            return res.status(200).json({
                success: false,
                message: "No Device Found with this deviceNo",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Device Fetched Successfully",
            device: device.devicesOwened[0],
        });

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in fetchCoustmerSingleDevice"
        })
    }
};





// Fetch Map Device On Basis of manufacturId 
exports.fetchAllMapDevice = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide UserId"
            })
        }

        // find in MpaADevice Document Or Collections on the basis of manufactur ID
        const mapDevice = await MapDevice.find({ manufacturId: userId })

        if (!mapDevice) {
            return res.status(200).json({
                sucess: false,
                message: "No Data Found In Map Device"
            })
        }

        return res.status(200).json({
            sucess: true,
            mapDevice,
            message: "Fetched All MapDevice"
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in FetchAllMapDevice",
        })
    }
}



exports.viewAMapDeviceInManufactur = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide UserId"
            })
        }


        const { deviceNo } = req.body;

        if (!deviceNo) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide deviceNo"
            })
        }


        // On the Basis of mapDeviceId find all details
        const mapDevice = await MapDevice.findOne({ deviceNo: deviceNo });

        if (!mapDevice) {
            return res.status(200).json({
                sucess: false,
                message: "No Data Found In mapDevice"
            })
        }


        return res.status(200).json({
            sucess: true,
            mapDevice,
            message: "View SucessFully"
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in viewAMApDevice",
        })
    }
}



exports.viewDocumentsOnMapDevice = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Server error in viewDocumentsOnMapDevice"
            })
        }

        const { deviceNo } = req.body;

        if (!deviceNo) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide deviceNo"
            })
        }


        // On the Basis of mapDeviceId find all details
        const mapDevice = await MapDevice.findOne({ deviceNo: deviceNo })

        if (!mapDevice) {
            return res.status(200).json({
                sucess: false,
                message: "No Data Found In mapDevice"
            })
        }

        return res.status(200).json({
            sucess: true,
            vechileDucument: mapDevice.VechileIDocument,
            rcDocument: mapDevice.RcDocument,
            deviceDocument: mapDevice.DeviceDocument,
            panDocument: mapDevice.PanCardDocument,
            adharDocument: mapDevice.AdharCardDocument,
            invoiceDocument: mapDevice.InvoiceDocument,
            signatureDocument: mapDevice.SignatureDocument,
            panicButtonDocument: mapDevice.PanicButtonWithSticker,

            message: "All Documents Realted To Particular Device Fetched SucessFully"
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in viewDocumentsOnMapDevice"
        })
    }
}




// this for only distributors deler only not implemented (Oem dele)
exports.fetchDeviceNoOnBasisOfDeler = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Please provide userId",
            });
        }

        const { delerName } = req.body;

        if (!delerName) {
            return res.status(400).json({
                success: false,
                message: "Please provide delerName in request body",
            });
        }

        // Find all dealers matching this name
        const dealers = await CreateDelerUnderDistributor.find({ name: delerName });

        if (!dealers || dealers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No dealers found with this name",
            });
        }

        // Extract all device info with sim details
        const deviceDetails = dealers.flatMap((dealer) =>
            dealer.allocateBarcodes.map((barcode) => ({
                deviceSerialNo: barcode.deviceSerialNo,
                barCodeNo: barcode.barCodeNo,
                status: barcode.status || "unknown",
                simDetails: Array.isArray(barcode.simDetails) ? barcode.simDetails : [],
            }))
        );

        return res.status(200).json({
            success: true,
            message: "Device details fetched successfully",
            count: deviceDetails.length,
            devices: deviceDetails,
        });
    } catch (error) {
        console.error("Error in fetchDeviceNoOnBasisOfDeler:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error in fetchDeviceNoOnBasisOfDeler",
        });
    }
};


// this for Subscriptions Packages api
exports.fetchSubScriptionPackages = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: 'Please Provide userId'
            })
        };

        // find SubScription packages document or Collections
        const SubScriptionPackage = await createSubscription.find({ manuFacturId: userId });

        if (!SubScriptionPackage) {
            return res.status(200).json({
                sucess: false,
                message: "No Data Found In This Collections"
            })
        };


        return res.status(200).json({
            sucess: true,
            message: "All SubscriptionsPackages Fetched SucessFully",
            SubScriptionPackage
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error In fetchSubScriptionPackages"
        })
    }
}


// this for fetchTechnicien on the basis of delerName // Not Implement right now
exports.fetchTechnicienAllRelatedData = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide UserId"
            })
        };

        const { delerName } = req.body;

        if (!delerName) {
            return res.status(200).json({
                sucess: false,
                message: `Please Provide delerName`
            })
        }

        // db call in 
        const dataIn = await CreateDelerUnderDistributor.find({})

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in fetchTechnicienAllRelatedData"
        })
    }
}



exports.fetchDistributorOnBasisOfState = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide UserId"
            })
        }

        const { state } = req.body;

        if (!state) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide state"
            })
        }


        // find in in distributor collection on the basis of state
        const distributors = await Distributor.find({ state: state });

        if (!distributors) {
            return res.status(200).json({
                sucess: false,
                message: "No Data Found in Distributors",
            })
        }


        return res.status(200).json({
            sucess: true,
            message: "fetch all distributors on Basis of state",
            distributors,
        })


    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in fetchDistributorOnBasisOfState"
        })
    }
}

exports.fetchdelerOnBasisOfDistributor = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide UserId"
            })
        }

        const { distributorId } = req.body;

        if (!distributorId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide distributorId"
            })
        };


        // find all deler under distributor
        const delers = await CreateDelerUnderDistributor.find({ distributorId: distributorId });


        if (!delers) {
            return res.status(200).json({
                sucess: false,
                message: "No Data Found in delers",
            })
        }



        return res.status(200).json({
            sucess: true,
            delers,
            message: "fetch all delers on Basis of distributor",
        })


    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in fetchdelerOnBasisOfDistributor"
        })
    }
};

// ================= LIVE TRACKING SINGLE DEVICE WITH SMOOTH MOVEMENT =================

// let lastLocation = {};   // { imei: { previous, current, speed, heading } }
// let lastTimestamp = {};
// let vehicleState = {};
// let parkedState = {}; // 🔥 NEW

// function generateSmoothPath(prev, curr, steps = 5) {
//     if (!prev || !curr) return [];

//     let path = [];
//     let latStep = (curr.latitude - prev.latitude) / steps;
//     let lngStep = (curr.longitude - prev.longitude) / steps;

//     for (let i = 1; i <= steps; i++) {
//         path.push({
//             latitude: prev.latitude + latStep * i,
//             longitude: prev.longitude + lngStep * i
//         });
//     }

//     return path;
// }

// exports.liveTrackingSingleDevice = async (req, res) => {
//     try {
//         const userId = req.user?.userId;
//         if (!userId) {
//             return res.status(400).json({ success: false, message: "User authentication required" });
//         }

//         const { deviceNo } = req.body;
//         if (!deviceNo) {
//             return res.status(400).json({ success: false, message: "Device number is required" });
//         }

//         const device = await CoustmerDevice.findOne(
//             { "devicesOwened.deviceNo": deviceNo },
//             { "devicesOwened.$": 1 }
//         );

//         if (!device) {
//             return res.status(404).json({ success: false, message: "Device not found" });
//         }

//         const matchedDevice = device.devicesOwened[0];
//         const imei = matchedDevice.deviceNo;
//         let liveData = devices[imei];

//         // ============== DEVICE OFFLINE BUT WE HAVE LAST LOCATION ==============
//         if (!liveData) {
//             if (!lastLocation[imei]) {
//                 return res.status(200).json({
//                     success: false,
//                     message: "Device offline and no last known location"
//                 });
//             }

//             const last = lastLocation[imei];

//             const smoothPath = generateSmoothPath(last.previous, last.current);

//             return res.status(200).json({
//                 success: true,
//                 message: "Device offline, returning last known smooth movement",
//                 previousLocation: last.previous,
//                 currentLocation: last.current,
//                 smoothPath, // NEW FOR SMOOTH MOVEMENT
//                 deviceInfo: {
//                     deviceNo, imei, vehicleName: matchedDevice.vehicleName || "Unknown",
//                     status: "offline"
//                 },
//                 location: {
//                     latitude: last.current.latitude,
//                     longitude: last.current.longitude,
//                     speed: last.speed,
//                     heading: last.heading
//                 },
//                 stopInfo: vehicleState[imei] || null,
//                 rawData: null
//             });
//         }

//         // ======================== FORMAT LIVE DATA ==========================
//         let lat = liveData.lat;
//         let lng = liveData.lng;

//         if (liveData.latDir === "S") lat = -lat;
//         if (liveData.lngDir === "W") lng = -lng;

//         const currentLocation = { latitude: lat, longitude: lng };
//         const previousLocation = lastLocation[imei]?.current || currentLocation;

//         // ======================== CREATE SMOOTH PATH ========================
//         const smoothPath = generateSmoothPath(previousLocation, currentLocation);

//         // save data
//         lastLocation[imei] = {
//             previous: previousLocation,
//             current: currentLocation,
//             speed: liveData.speed || 0,
//             heading: liveData.heading || 0
//         };
//         lastTimestamp[imei] = liveData.lastUpdate;

//         // ========================= STOP / MOVEMENT LOGIC =========================
//         if (!vehicleState[imei]) {
//             vehicleState[imei] = { isStopped: false, stopStartTime: null, totalStoppedSeconds: 0 };
//         }

//         let speed = liveData.speed || 0;

//         if (speed === 0 && !vehicleState[imei].isStopped) {
//             vehicleState[imei].isStopped = true;
//             vehicleState[imei].stopStartTime = Date.now();
//         }

//         if (speed > 0 && vehicleState[imei].isStopped) {
//             vehicleState[imei].isStopped = false;
//             let stoppedFor = Math.floor((Date.now() - vehicleState[imei].stopStartTime) / 1000);
//             vehicleState[imei].totalStoppedSeconds += stoppedFor;
//             vehicleState[imei].stopStartTime = null;
//         }

//         // ======================== FINAL RESPONSE ========================
//         const dataAge = Date.now() - new Date(liveData.lastUpdate).getTime();

//         console.log(liveData)

//         return res.status(200).json({
//             success: true,
//             message: "Live GPS data retrieved successfully",
//             VehicleType: matchedDevice.VehicleType || "Unknown",
//             previousLocation,
//             currentLocation,
//             smoothPath, // IMPORTANT
//             deviceInfo: {
//                 deviceNo, imei,
//                 vehicleName: matchedDevice.vehicleName || "Unknown",
//                 status: dataAge < 60000 ? "online" : "stale"
//             },
//             location: {
//                 latitude: lat, longitude: lng,
//                 speed: speed, heading: liveData.heading
//             },
//             stopInfo: {
//                 ...vehicleState[imei],
//                 currentStopSeconds: vehicleState[imei].isStopped
//                     ? Math.floor((Date.now() - vehicleState[imei].stopStartTime) / 1000)
//                     : 0
//             },
//             timestamp: {
//                 lastUpdate: liveData.lastUpdate,
//                 dataAgeSeconds: Math.floor(dataAge / 1000)
//             },
//             rawData: liveData
//         });

//     } catch (error) {
//         console.error("❌ Controller Error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Server error while fetching live GPS data"
//         });
//     }
// };




function formatDuration(seconds) {
    const d = Math.floor(seconds / 86400);
    seconds %= 86400;
    const h = Math.floor(seconds / 3600);
    seconds %= 3600;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;

    return {
        days: d,
        hours: h,
        minutes: m,
        seconds: s,
        formatted: `${d ? d + "d " : ""}${h ? h + "h " : ""}${m ? m + "m " : ""}${s}s`.trim()
    };
}

function formatStartTime(ts) {
    if (!ts) return null;
    const d = new Date(ts);
    return {
        timestamp: ts,
        iso: d.toISOString(),
        local: d.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        })
    };
}




let lastLocation = {};   // { imei: { previous, current, speed, heading } }
let lastTimestamp = {};
let vehicleState = {};
let parkedState = {}; // ✅ PARK STATE

function generateSmoothPath(prev, curr, steps = 5) {
    if (!prev || !curr) return [];

    let path = [];
    let latStep = (curr.latitude - prev.latitude) / steps;
    let lngStep = (curr.longitude - prev.longitude) / steps;

    for (let i = 1; i <= steps; i++) {
        path.push({
            latitude: prev.latitude + latStep * i,
            longitude: prev.longitude + lngStep * i
        });
    }
    return path;
}

exports.liveTrackingSingleDevice = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User authentication required" });
        }

        const { deviceNo } = req.body;
        if (!deviceNo) {
            return res.status(400).json({ success: false, message: "Device number is required" });
        }

        const device = await CoustmerDevice.findOne(
            { "devicesOwened.deviceNo": deviceNo },
            { "devicesOwened.$": 1 }
        );

        if (!device) {
            return res.status(404).json({ success: false, message: "Device not found" });
        }

        const matchedDevice = device.devicesOwened[0];
        const imei = matchedDevice.deviceNo;
        let liveData = devices[imei];

        // ================= OFFLINE =================
        if (!liveData && lastLocation[imei]) {
            const last = lastLocation[imei];
            return res.status(200).json({
                success: true,
                message: "Device offline, returning last known data",
                previousLocation: last.previous,
                currentLocation: last.current,
                smoothPath: generateSmoothPath(last.previous, last.current),
                deviceInfo: { deviceNo, imei, status: "offline" },
                location: last,
                stopInfo: vehicleState[imei] || null,
                parkInfo: parkedState[imei] || null
            });
        }

        if (!liveData) {
            return res.status(200).json({
                success: false,
                message: "Device offline and no last known location"
            });
        }

        // ================= FORMAT LIVE DATA =================
        let lat = liveData.lat;
        let lng = liveData.lng;

        if (liveData.latDir === "S") lat = -lat;
        if (liveData.lngDir === "W") lng = -lng;

        const currentLocation = { latitude: lat, longitude: lng };
        const previousLocation = lastLocation[imei]?.current || currentLocation;
        const smoothPath = generateSmoothPath(previousLocation, currentLocation);

        const speed = Number(liveData.speed) || 0;

        // 🔥 Normalize ignition ("0"/"1")
        const ignition =
            liveData.ignition === 1 ||
            liveData.ignition === "1" ||
            liveData.ignition === true;

        lastLocation[imei] = {
            previous: previousLocation,
            current: currentLocation,
            speed,
            heading: liveData.heading || 0
        };

        lastTimestamp[imei] = liveData.lastUpdate;

        // ================= STOP LOGIC =================
        if (!vehicleState[imei]) {
            vehicleState[imei] = {
                isStopped: false,
                stopStartTime: null,
                totalStoppedSeconds: 0
            };
        }

        if (speed === 0 && !vehicleState[imei].isStopped) {
            vehicleState[imei].isStopped = true;
            vehicleState[imei].stopStartTime = Date.now();
        }

        if (speed > 0 && vehicleState[imei].isStopped) {
            vehicleState[imei].isStopped = false;
            const stoppedFor = Math.floor(
                (Date.now() - vehicleState[imei].stopStartTime) / 1000
            );
            vehicleState[imei].totalStoppedSeconds += stoppedFor;
            vehicleState[imei].stopStartTime = null;
        }

        // ================= PARK LOGIC (NEW) =================
        if (!parkedState[imei]) {
            parkedState[imei] = {
                isParked: false,
                parkStartTime: null,
                totalParkedSeconds: 0
            };
        }

        // Park start → ignition OFF + speed 0
        if (!ignition && speed === 0 && !parkedState[imei].isParked) {
            parkedState[imei].isParked = true;
            parkedState[imei].parkStartTime = Date.now();
        }

        // Park end → ignition ON
        if (ignition && parkedState[imei].isParked) {
            parkedState[imei].isParked = false;
            const parkedFor = Math.floor(
                (Date.now() - parkedState[imei].parkStartTime) / 1000
            );
            parkedState[imei].totalParkedSeconds += parkedFor;
            parkedState[imei].parkStartTime = null;
        }

        const dataAge = Date.now() - new Date(liveData.lastUpdate).getTime();


        // ================= FORMAT TIMES =================
        const currentStopSeconds = vehicleState[imei].isStopped
            ? Math.floor((Date.now() - vehicleState[imei].stopStartTime) / 1000)
            : 0;

        const currentParkSeconds = parkedState[imei].isParked
            ? Math.floor((Date.now() - parkedState[imei].parkStartTime) / 1000)
            : 0;

        // ================= RESPONSE =================
        return res.status(200).json({
            success: true,
            message: "Live GPS data retrieved successfully",
            VehicleType: matchedDevice.VehicleType || "Unknown",
            vechileNo: matchedDevice.vechileNo, // add new
            previousLocation,
            currentLocation,
            smoothPath,
            deviceInfo: {
                deviceNo,
                imei,
                vehicleName: matchedDevice.vehicleName || "Unknown",
                status: dataAge < 60000 ? "online" : "stale"
            },
            location: {
                latitude: lat,
                longitude: lng,
                speed,
                heading: liveData.heading
            },
            // stopInfo: {
            //     ...vehicleState[imei],
            //     currentStopSeconds: vehicleState[imei].isStopped
            //         ? Math.floor((Date.now() - vehicleState[imei].stopStartTime) / 1000)
            //         : 0
            // },
            // parkInfo: {
            //     ...parkedState[imei],
            //     currentParkedSeconds: parkedState[imei].isParked
            //         ? Math.floor((Date.now() - parkedState[imei].parkStartTime) / 1000)
            //         : 0
            // },

            stopInfo: {
                isStopped: vehicleState[imei].isStopped,
                startTime: formatStartTime(vehicleState[imei].stopStartTime),
                totalSeconds: vehicleState[imei].totalStoppedSeconds,
                totalTime: formatDuration(vehicleState[imei].totalStoppedSeconds).formatted,
                currentSeconds: currentStopSeconds,
                currentTime: formatDuration(currentStopSeconds).formatted
            },
            parkInfo: {
                isParked: parkedState[imei].isParked,
                startTime: formatStartTime(parkedState[imei].parkStartTime),
                totalSeconds: parkedState[imei].totalParkedSeconds,
                totalTime: formatDuration(parkedState[imei].totalParkedSeconds).formatted,
                currentSeconds: currentParkSeconds,
                currentTime: formatDuration(currentParkSeconds).formatted
            },
            timestamp: {
                lastUpdate: liveData.lastUpdate,
                dataAgeSeconds: Math.floor(dataAge / 1000)
            },
            rawData: liveData
        });

    } catch (error) {
        console.error("❌ Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching live GPS data"
        });
    }
};






const formatDateTime = (timestamp) => {
    if (!timestamp) return null;
    return new Date(timestamp).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });
};

// exports.liveTrackingAllDevices = async (req, res) => {
//     try {
//         const userId = req.user?.userId;

//         if (!userId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User authentication required",
//             });
//         }

//         const user = await User.findById(userId);
//         if (!user || !user.coustmerId) {
//             return res.status(404).json({
//                 success: false,
//                 message: "No customer found for this user",
//             });
//         }

//         const customer = await CoustmerDevice.findById(user.coustmerId);
//         if (!customer || !customer.devicesOwened || customer.devicesOwened.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "No devices found for this customer",
//             });
//         }

//         const devicesOwened = customer.devicesOwened;

//         const finalDeviceList = devicesOwened.map((dev) => {
//             const imei = dev.deviceNo;
//             const liveData = devices[imei];

//             let status = "offline";
//             let formattedLat = null;
//             let formattedLng = null;
//             let speed = 0;
//             let ignition = "0";
//             let gpsFix = "0";
//             let satellites = "0";
//             let lastUpdate = null;
//             let movementStatus = "stopped";

//             // ================= LIVE DATA =================
//             if (liveData) {
//                 const diff = Date.now() - new Date(liveData.lastUpdate).getTime();
//                 status = diff <= 60000 ? "online" : "stale";

//                 formattedLat = liveData.lat;
//                 formattedLng = liveData.lng;
//                 if (liveData.latDir === "S" && formattedLat > 0) formattedLat = -formattedLat;
//                 if (liveData.lngDir === "W" && formattedLng > 0) formattedLng = -formattedLng;

//                 speed = liveData.speed || 0;
//                 ignition = liveData.ignition || "0";
//                 gpsFix = liveData.gpsFix || "0";
//                 satellites = liveData.satellites || "0";
//                 lastUpdate = liveData.lastUpdate;

//                 if (speed > 5) movementStatus = "moving";
//                 else if (speed > 0) movementStatus = "slow moving";
//                 else movementStatus = "stopped";
//             }

//             // ================= STOP INFO LOGIC =================
//             if (!vehicleState[imei]) {
//                 vehicleState[imei] = {
//                     isStopped: false,
//                     stopStartTime: null,
//                     totalStoppedSeconds: 0
//                 };
//             }

//             if (speed === 0 && !vehicleState[imei].isStopped) {
//                 vehicleState[imei].isStopped = true;
//                 vehicleState[imei].stopStartTime = Date.now();
//             }

//             if (speed > 0 && vehicleState[imei].isStopped) {
//                 vehicleState[imei].isStopped = false;
//                 const stoppedFor = Math.floor(
//                     (Date.now() - vehicleState[imei].stopStartTime) / 1000
//                 );
//                 vehicleState[imei].totalStoppedSeconds += stoppedFor;
//                 vehicleState[imei].stopStartTime = null;
//             }

//             // ================= PARK INFO LOGIC =================
//             if (!parkedState[imei]) {
//                 parkedState[imei] = {
//                     isParked: false,
//                     parkStartTime: null,
//                     totalParkedSeconds: 0
//                 };
//             }

//             const ignitionOn =
//                 ignition === "1" || ignition === 1 || ignition === true;

//             if (!ignitionOn && speed === 0 && !parkedState[imei].isParked) {
//                 parkedState[imei].isParked = true;
//                 parkedState[imei].parkStartTime = Date.now();
//             }

//             if (ignitionOn && parkedState[imei].isParked) {
//                 parkedState[imei].isParked = false;
//                 const parkedFor = Math.floor(
//                     (Date.now() - parkedState[imei].parkStartTime) / 1000
//                 );
//                 parkedState[imei].totalParkedSeconds += parkedFor;
//                 parkedState[imei].parkStartTime = null;
//             }

//             // ================= RESPONSE =================
//             return {
//                 dev,
//                 deviceNo: dev.deviceNo,
//                 deviceType: dev.deviceType,
//                 RegistrationNo: dev.RegistrationNo,
//                 MakeModel: dev.MakeModel,
//                 ModelYear: dev.ModelYear,
//                 batchNo: dev.batchNo,
//                 date: dev.date,
//                 simDetails: dev.simDetails || [],

//                 liveTracking: liveData || null,

//                 status,
//                 lat: formattedLat,
//                 lng: formattedLng,
//                 speed,
//                 ignition,
//                 gpsFix,
//                 satellites,
//                 lastUpdate,
//                 movementStatus,

//                 // 🔥 STOP INFO (Formatted)
//                 stopInfo: {
//                     isStopped: vehicleState[imei].isStopped,
//                     stopStartTime: vehicleState[imei].stopStartTime,
//                     stopStartTimeFormatted: formatDateTime(vehicleState[imei].stopStartTime),

//                     totalStoppedSeconds: vehicleState[imei].totalStoppedSeconds,
//                     totalStoppedTime: formatDuration(vehicleState[imei].totalStoppedSeconds),

//                     currentStopSeconds: vehicleState[imei].isStopped
//                         ? Math.floor((Date.now() - vehicleState[imei].stopStartTime) / 1000)
//                         : 0,
//                     currentStopTime: vehicleState[imei].isStopped
//                         ? formatDuration(
//                             Math.floor((Date.now() - vehicleState[imei].stopStartTime) / 1000)
//                         )
//                         : "0s"
//                 },

//                 // 🔥 PARK INFO (Formatted)
//                 parkInfo: {
//                     isParked: parkedState[imei].isParked,
//                     parkStartTime: parkedState[imei].parkStartTime,
//                     parkStartTimeFormatted: formatDateTime(parkedState[imei].parkStartTime),

//                     totalParkedSeconds: parkedState[imei].totalParkedSeconds,
//                     totalParkedTime: formatDuration(parkedState[imei].totalParkedSeconds),

//                     currentParkedSeconds: parkedState[imei].isParked
//                         ? Math.floor((Date.now() - parkedState[imei].parkStartTime) / 1000)
//                         : 0,
//                     currentParkedTime: parkedState[imei].isParked
//                         ? formatDuration(
//                             Math.floor((Date.now() - parkedState[imei].parkStartTime) / 1000)
//                         )
//                         : "0s"
//                 }
//             };
//         });

//         return res.status(200).json({
//             success: true,
//             message: "Live tracking data for all customer devices retrieved successfully",
//             totalDevices: finalDeviceList.length,
//             devices: finalDeviceList,
//         });

//     } catch (error) {
//         console.error("❌ Controller Error (All Devices):", error);
//         return res.status(500).json({
//             success: false,
//             message: "Server error while fetching live tracking data for all devices",
//             error: error.message,
//         });
//     }
// };



// const formatDateTime = (timestamp) => {
//     if (!timestamp) return null;
//     return new Date(timestamp).toLocaleString("en-IN", {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//         second: "2-digit",
//         hour12: true
//     });
// };

exports.liveTrackingAllDevices = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User authentication required",
            });
        }

        // 🔥 CACHE KEY (per user)
        const cacheKey = `liveTrackingAllDevices:${userId}`;

        // 🔥 RETURN FROM CACHE
        const cachedResponse = liveTrackingCache.get(cacheKey);
        if (cachedResponse) {
            return res.status(200).json(cachedResponse);
        }

        const user = await User.findById(userId);
        if (!user || !user.coustmerId) {
            return res.status(404).json({
                success: false,
                message: "No customer found for this user",
            });
        }

        const customer = await CoustmerDevice.findById(user.coustmerId);
        if (!customer || !customer.devicesOwened || customer.devicesOwened.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No devices found for this customer",
            });
        }

        const devicesOwened = customer.devicesOwened;

        const finalDeviceList = devicesOwened.map((dev) => {
            const imei = dev.deviceNo;
            const liveData = devices[imei];

            let status = "offline";
            let formattedLat = null;
            let formattedLng = null;
            let speed = 0;
            let ignition = "0";
            let gpsFix = "0";
            let satellites = "0";
            let lastUpdate = null;
            let movementStatus = "stopped";

            // ================= LIVE DATA =================
            if (liveData) {
                const diff = Date.now() - new Date(liveData.lastUpdate).getTime();
                status = diff <= 60000 ? "online" : "stale";

                formattedLat = liveData.lat;
                formattedLng = liveData.lng;
                if (liveData.latDir === "S" && formattedLat > 0) formattedLat = -formattedLat;
                if (liveData.lngDir === "W" && formattedLng > 0) formattedLng = -formattedLng;

                speed = liveData.speed || 0;
                ignition = liveData.ignition || "0";
                gpsFix = liveData.gpsFix || "0";
                satellites = liveData.satellites || "0";
                lastUpdate = liveData.lastUpdate;

                if (speed > 5) movementStatus = "moving";
                else if (speed > 0) movementStatus = "slow moving";
                else movementStatus = "stopped";
            }

            // ================= STOP INFO =================
            if (!vehicleState[imei]) {
                vehicleState[imei] = {
                    isStopped: false,
                    stopStartTime: null,
                    totalStoppedSeconds: 0
                };
            }

            if (speed === 0 && !vehicleState[imei].isStopped) {
                vehicleState[imei].isStopped = true;
                vehicleState[imei].stopStartTime = Date.now();
            }

            if (speed > 0 && vehicleState[imei].isStopped) {
                vehicleState[imei].isStopped = false;
                const stoppedFor = Math.floor(
                    (Date.now() - vehicleState[imei].stopStartTime) / 1000
                );
                vehicleState[imei].totalStoppedSeconds += stoppedFor;
                vehicleState[imei].stopStartTime = null;
            }

            // ================= PARK INFO =================
            if (!parkedState[imei]) {
                parkedState[imei] = {
                    isParked: false,
                    parkStartTime: null,
                    totalParkedSeconds: 0
                };
            }

            const ignitionOn =
                ignition === "1" || ignition === 1 || ignition === true;

            if (!ignitionOn && speed === 0 && !parkedState[imei].isParked) {
                parkedState[imei].isParked = true;
                parkedState[imei].parkStartTime = Date.now();
            }

            if (ignitionOn && parkedState[imei].isParked) {
                parkedState[imei].isParked = false;
                const parkedFor = Math.floor(
                    (Date.now() - parkedState[imei].parkStartTime) / 1000
                );
                parkedState[imei].totalParkedSeconds += parkedFor;
                parkedState[imei].parkStartTime = null;
            }

            // ================= RESPONSE =================
            return {
                dev,
                deviceNo: dev.deviceNo,
                deviceType: dev.deviceType,
                RegistrationNo: dev.RegistrationNo,
                MakeModel: dev.MakeModel,
                ModelYear: dev.ModelYear,
                batchNo: dev.batchNo,
                date: dev.date,
                simDetails: dev.simDetails || [],
                liveTracking: liveData || null,
                status,
                lat: formattedLat,
                lng: formattedLng,
                speed,
                ignition,
                gpsFix,
                satellites,
                lastUpdate,
                movementStatus,

                stopInfo: {
                    isStopped: vehicleState[imei].isStopped,
                    stopStartTime: vehicleState[imei].stopStartTime,
                    stopStartTimeFormatted: formatDateTime(vehicleState[imei].stopStartTime),
                    totalStoppedSeconds: vehicleState[imei].totalStoppedSeconds,
                    totalStoppedTime: formatDuration(vehicleState[imei].totalStoppedSeconds),
                    currentStopSeconds: vehicleState[imei].isStopped
                        ? Math.floor((Date.now() - vehicleState[imei].stopStartTime) / 1000)
                        : 0,
                    currentStopTime: vehicleState[imei].isStopped
                        ? formatDuration(
                            Math.floor((Date.now() - vehicleState[imei].stopStartTime) / 1000)
                        )
                        : "0s"
                },

                parkInfo: {
                    isParked: parkedState[imei].isParked,
                    parkStartTime: parkedState[imei].parkStartTime,
                    parkStartTimeFormatted: formatDateTime(parkedState[imei].parkStartTime),
                    totalParkedSeconds: parkedState[imei].totalParkedSeconds,
                    totalParkedTime: formatDuration(parkedState[imei].totalParkedSeconds),
                    currentParkedSeconds: parkedState[imei].isParked
                        ? Math.floor((Date.now() - parkedState[imei].parkStartTime) / 1000)
                        : 0,
                    currentParkedTime: parkedState[imei].isParked
                        ? formatDuration(
                            Math.floor((Date.now() - parkedState[imei].parkStartTime) / 1000)
                        )
                        : "0s"
                }
            };
        });

        const responsePayload = {
            success: true,
            message: "Live tracking data for all customer devices retrieved successfully",
            totalDevices: finalDeviceList.length,
            devices: finalDeviceList,
        };

        // 🔥 SAVE TO CACHE
        liveTrackingCache.set(cacheKey, responsePayload);

        return res.status(200).json(responsePayload);

    } catch (error) {
        console.error("❌ Controller Error (All Devices):", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching live tracking data for all devices",
            error: error.message,
        });
    }
};


// const NodeCache = require("node-cache");

// // 🧠 In-memory cache (FAST)
// const liveTrackingCache = new NodeCache({
//     stdTTL: 10,        // cache valid for 10 seconds
//     checkperiod: 5,   // cleanup every 5 seconds
//     useClones: false  // better performance
// });

// // 🌍 Runtime states (NOT recreated)
// global.vehicleState ||= {};
// global.parkedState ||= {};

// // 🕒 Date formatter
// const formatDateTime = (timestamp) => {
//     if (!timestamp) return null;
//     return new Date(timestamp).toLocaleString("en-IN", {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//         second: "2-digit",
//         hour12: true
//     });
// };

// exports.liveTrackingAllDevices = async (req, res) => {
//     try {
//         const userId = req.user?.userId;

//         if (!userId) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Unauthorized"
//             });
//         }

//         // ================== CACHE CHECK ==================
//         // 🔑 One cache per user
//         const cacheKey = `liveTracking:${userId}`;

//         const cachedResponse = liveTrackingCache.get(cacheKey);
//         if (cachedResponse) {
//             // ⚡ FAST RESPONSE (no DB, no loop)
//             return res.json(cachedResponse);
//         }

//         const realUser = await User.findById(userId);
//         if (!realUser) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }

//         // ================== DB QUERY ==================
//         // 🔒 User can see ONLY his own devices
//         const customer = await CoustmerDevice
//             .findById(realUser.coustmerId)
//             .select("devicesOwened")
//             .lean();

//         if (!customer?.devicesOwened?.length) {
//             return res.json({
//                 success: true,
//                 totalDevices: 0,
//                 devices: []
//             });
//         }

//         const now = Date.now();
//         const finalDeviceList = [];

//         // ================== DEVICE LOOP ==================
//         for (const dev of customer.devicesOwened) {

//             const imei = dev.deviceNo;
//             const liveData = devices[imei]; // live TCP data

//             let status = "offline";
//             let lat = null;
//             let lng = null;
//             let speed = 0;
//             let ignition = "0";
//             let movementStatus = "stopped";

//             // -------- LIVE GPS DATA --------
//             if (liveData) {
//                 const diff = now - new Date(liveData.lastUpdate).getTime();
//                 status = diff <= 60000 ? "online" : "stale";

//                 lat = liveData.lat;
//                 lng = liveData.lng;
//                 if (liveData.latDir === "S" && lat > 0) lat = -lat;
//                 if (liveData.lngDir === "W" && lng > 0) lng = -lng;

//                 speed = liveData.speed || 0;
//                 ignition = liveData.ignition || "0";

//                 if (speed > 5) movementStatus = "moving";
//                 else if (speed > 0) movementStatus = "slow moving";
//             }

//             // -------- STOP STATE --------
//             vehicleState[imei] ||= {
//                 isStopped: false,
//                 stopStartTime: null
//             };

//             if (speed === 0 && !vehicleState[imei].isStopped) {
//                 vehicleState[imei].isStopped = true;
//                 vehicleState[imei].stopStartTime = now;
//             }

//             if (speed > 0 && vehicleState[imei].isStopped) {
//                 vehicleState[imei].isStopped = false;
//                 vehicleState[imei].stopStartTime = null;
//             }

//             // -------- PARK STATE --------
//             parkedState[imei] ||= {
//                 isParked: false,
//                 parkStartTime: null
//             };

//             const ignitionOn =
//                 ignition === "1" || ignition === 1 || ignition === true;

//             if (!ignitionOn && speed === 0 && !parkedState[imei].isParked) {
//                 parkedState[imei].isParked = true;
//                 parkedState[imei].parkStartTime = now;
//             }

//             if (ignitionOn && parkedState[imei].isParked) {
//                 parkedState[imei].isParked = false;
//                 parkedState[imei].parkStartTime = null;
//             }

//             // -------- RESPONSE OBJECT --------
//             finalDeviceList.push({
//                 deviceNo: dev.deviceNo,
//                 deviceType: dev.deviceType,
//                 RegistrationNo: dev.RegistrationNo,
//                 MakeModel: dev.MakeModel,

//                 status,
//                 lat,
//                 lng,
//                 speed,
//                 ignition,
//                 movementStatus,

//                 stopInfo: {
//                     isStopped: vehicleState[imei].isStopped,
//                     stopStartTimeFormatted: formatDateTime(
//                         vehicleState[imei].stopStartTime
//                     )
//                 },

//                 parkInfo: {
//                     isParked: parkedState[imei].isParked,
//                     parkStartTimeFormatted: formatDateTime(
//                         parkedState[imei].parkStartTime
//                     )
//                 }
//             });
//         }

//         // ================== FINAL RESPONSE ==================
//         const responsePayload = {
//             success: true,
//             totalDevices: finalDeviceList.length,
//             devices: finalDeviceList
//         };

//         // 💾 SAVE TO CACHE (10 sec)
//         liveTrackingCache.set(cacheKey, responsePayload);

//         return res.json(responsePayload);

//     } catch (error) {
//         console.error("❌ liveTrackingAllDevices Error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Server error",
//             error: error.message
//         });
//     }
// };




const RoutePlayback = require("../models/RouteHistory");

exports.fetchSingleRoutePlayback = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const { deviceNo, startTime, endTime } = req.body;

        if (!deviceNo || !startTime || !endTime) {
            return res.status(400).json({
                success: false,
                message: "deviceNo, startTime and endTime are required"
            });
        }

        // 🔍 Validate device
        const device = await CoustmerDevice.findOne(
            { "devicesOwened.deviceNo": deviceNo },
            { "devicesOwened.$": 1 }
        );

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Device not found"
            });
        }

        const imei = device.devicesOwened[0].deviceNo;

        // 📌 Fetch route data
        const points = await RoutePlayback.find({
            imei,
            timestamp: {
                $gte: new Date(startTime),
                $lte: new Date(endTime)
            }
        })
            .sort({ timestamp: 1 }) // IMPORTANT
            .select("latitude longitude speed raw.headDegree timestamp");

        if (!points.length) {
            return res.status(200).json({
                success: true,
                deviceNo,
                totalPoints: 0,
                route: []
            });
        }

        let lastHeading = 0;

        const route = points.map((p, index) => {
            let heading = lastHeading;

            // ✅ 1. Use device heading if available
            if (p.raw?.headDegree) {
                heading = parseFloat(p.raw.headDegree);
                lastHeading = heading;
            }
            // ✅ 2. Calculate heading from coordinates
            else if (index > 0) {
                heading = calculateHeading(points[index - 1], p);
                lastHeading = heading;
            }
            // ✅ 3. Vehicle stopped → keep last heading
            else {
                heading = lastHeading;
            }

            return {
                latitude: p.latitude,
                longitude: p.longitude,
                speed: p.speed,
                heading,
                timestamp: p.timestamp
            };
        });

        return res.status(200).json({
            success: true,
            deviceNo,
            totalPoints: route.length,
            route
        });

    } catch (error) {
        console.error("❌ Route Playback Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch route playback"
        });
    }
};

// ===============================
// 🧭 HEADING CALCULATION FUNCTION
// ===============================
function calculateHeading(from, to) {
    const lat1 = from.latitude * Math.PI / 180;
    const lat2 = to.latitude * Math.PI / 180;
    const dLng = (to.longitude - from.longitude) * Math.PI / 180;

    const y = Math.sin(dLng) * Math.cos(lat2);
    const x =
        Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}



// const RoutePlayback = require("../models/RouteHistory");

// exports.fetchSingleRoutePlayback = async (req, res) => {
//     try {
//         const userId = req.user?.userId;
//         if (!userId) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Unauthorized"
//             });
//         }

//         const { deviceNo, startTime, endTime } = req.body;

//         if (!deviceNo || !startTime || !endTime) {
//             return res.status(400).json({
//                 success: false,
//                 message: "deviceNo, startTime and endTime are required"
//             });
//         }

//         // 🔍 Validate device
//         const device = await CoustmerDevice.findOne(
//             { "devicesOwened.deviceNo": deviceNo },
//             { "devicesOwened.$": 1 }
//         );

//         if (!device) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Device not found"
//             });
//         }

//         const imei = device.devicesOwened[0].deviceNo;

//         const start = new Date(startTime);
//         const end = new Date(endTime);

//         // ======================================
//         // MAIN DATA between start & end
//         // ======================================
//         const mainPoints = await RoutePlayback.find({
//             imei,
//             timestamp: { $gte: start, $lte: end }
//         })
//         .sort({ timestamp: 1 })
//         .select("latitude longitude speed raw.headDegree timestamp");

//         // ======================================
//         // BEFORE startTime (nearest previous point)
//         // ======================================
//         const beforePoint = await RoutePlayback.findOne({
//             imei,
//             timestamp: { $lt: start }
//         })
//         .sort({ timestamp: -1 })
//         .select("latitude longitude speed raw.headDegree timestamp");

//         // ======================================
//         // AFTER endTime (nearest next point)
//         // ======================================
//         const afterPoint = await RoutePlayback.findOne({
//             imei,
//             timestamp: { $gt: end }
//         })
//         .sort({ timestamp: 1 })
//         .select("latitude longitude speed raw.headDegree timestamp");

//         // If no main data, return empty
//         if (!mainPoints.length && !beforePoint && !afterPoint) {
//             return res.status(200).json({
//                 success: true,
//                 totalPoints: 0,
//                 route: []
//             });
//         }

//         // ======================================
//         // COMBINE RESULT
//         // ======================================

//         let finalPoints = [];

//         if (beforePoint) finalPoints.push(beforePoint);

//         finalPoints = finalPoints.concat(mainPoints);

//         if (afterPoint) finalPoints.push(afterPoint);

//         // ======================================
//         // HEADING PROCESSING
//         // ======================================
//         let lastHeading = 0;

//         const route = finalPoints.map((p, index) => {
//             let heading = lastHeading;

//             if (p.raw?.headDegree) {
//                 heading = parseFloat(p.raw.headDegree);
//                 lastHeading = heading;
//             }
//             else if (index > 0) {
//                 heading = calculateHeading(finalPoints[index - 1], p);
//                 lastHeading = heading;
//             }

//             return {
//                 latitude: p.latitude,
//                 longitude: p.longitude,
//                 speed: p.speed,
//                 heading,
//                 timestamp: p.timestamp
//             };
//         });

//         return res.status(200).json({
//             success: true,
//             deviceNo,
//             totalPoints: route.length,
//             route
//         });

//     } catch (error) {
//         console.error("❌ Route Playback Error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to fetch route playback"
//         });
//     }
// };


// // ===============================
// // 🧭 HEADING CALCULATION
// // ===============================
// function calculateHeading(from, to) {
//     const lat1 = from.latitude * Math.PI / 180;
//     const lat2 = to.latitude * Math.PI / 180;
//     const dLng = (to.longitude - from.longitude) * Math.PI / 180;

//     const y = Math.sin(dLng) * Math.cos(lat2);
//     const x =
//         Math.cos(lat1) * Math.sin(lat2) -
//         Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

//     return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
// }





// -----------------------------------------------//
// work on Ticket-Issue System Or Feture
exports.ticketIssueByCoustmer = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "UserId missing"
            });
        }

        const { vechileNo, issueType, issueDescription, address } = req.body;

        if (!vechileNo || !issueType || !issueDescription || !address) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // ----------------------------------------------
        // 🚀 1. Single optimized query to get:
        //    - Parent CustomerDevice Document
        //    - Nested device _id
        // ----------------------------------------------
        const deviceMatch = await CoustmerDevice.aggregate([
            { $unwind: "$devicesOwened" },
            { $match: { "devicesOwened.vechileNo": vechileNo } },
            {
                $project: {
                    parentId: "$_id",
                    deviceId: "$devicesOwened._id",
                    manufacturId: "$manufacturId"
                }
            },
            { $limit: 1 } // faster on AWS
        ]);

        if (!deviceMatch.length) {
            return res.status(404).json({
                success: false,
                message: "Device not found for this vehicle number"
            });
        }

        const { parentId, deviceId, manufacturId } = deviceMatch[0];

        // ----------------------------------------------
        // 🚀 2. Fetch manufacturer directly (no double lookup)
        // ----------------------------------------------
        // 1. Get manufacturUser (not ManuFactur directly)
        const manufacturUser = await User.findById(manufacturId).lean();
        if (!manufacturUser) {
            return res.status(404).json({
                success: false,
                message: "Manufactur User not found"
            });
        }

        // 2. Retrieve ManuFactur model
        const manuFactur = await ManuFactur.findById(manufacturUser.manufacturId).lean();
        if (!manuFactur) {
            return res.status(404).json({
                success: false,
                message: "Manufacturer not found"
            });
        }

        // ----------------------------------------------
        // 🚀 3. Create ticket in one step
        // ----------------------------------------------
        const newTicketIssue = await TicketIssue.create({
            coustmerTicketIssueId: userId,
            ticketIssueNo: Math.floor(100000 + Math.random() * 900000),
            vechileNo,
            issueType,
            issueDescription,
            address,
            issuseAssignTo: manuFactur._id,
            issuseAssignToModel: "ManuFactur",
            issueStatus: "Open",
        });

        // ----------------------------------------------
        // 🚀 4. Update nested device ticketIssues quickly using arrayFilters
        // ----------------------------------------------
        const deviceUpdate = CoustmerDevice.updateOne(
            { _id: parentId },
            {
                $push: {
                    "devicesOwened.$[dev].ticketIssues": newTicketIssue._id
                }
            },
            {
                arrayFilters: [{ "dev._id": deviceId }]
            }
        );

        // ----------------------------------------------
        // 🚀 5. Push ticket to manufacturer
        // ----------------------------------------------
        const manufacturerUpdate = ManuFactur.updateOne(
            { _id: manuFactur._id },
            { $push: { ticketIssues: newTicketIssue._id } }
        );

        await Promise.all([deviceUpdate, manufacturerUpdate]); // parallel execution for speed 🚀

        return res.status(200).json({
            success: true,
            message: "Ticket created successfully",
            ticketIssue: newTicketIssue,
            parentId,
            deviceId
        });

    } catch (error) {
        console.error("Ticket Issue Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while creating ticket"
        });
    }
};


exports.fetchAllCoustmerVechileNo = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide UserId"
            })
        }

        // find in user collections
        const coustmerUser = await User.findById(userId);

        if (!coustmerUser) {
            return res.status(200).json({
                sucess: false,
                message: "No Coustmer User Found"
            })
        }

        const coustmer = await CoustmerDevice.findById(coustmerUser.coustmerId);

        if (!coustmer) {
            return res.status(200).json({
                sucess: false,
                message: "No Coustmer Device Found"
            })
        }

        return res.status(200).json({
            sucess: true,
            vechileNumbers: coustmer.devicesOwened.map(device => device.vechileNo),
            imeiNos: coustmer.devicesOwened.map(device => device.deviceNo),
            message: "Fecthed All Vechile Numbers SucessFully"
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in fetchAllCoustmerVechileNo"
        })
    }
}


exports.getCustomerTicketIssues = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide UserId"
            })
        }

        const coustmerUser = await User.findById(userId);
        if (!coustmerUser) {
            return res.status(404).json({ success: false, message: "Customer User Not Found" });
        }

        const coustmer = await CoustmerDevice.findById(coustmerUser.coustmerId)
            .populate({
                path: "devicesOwened.ticketIssues",
                model: "TicketIssue"
            });

        if (!coustmer) {
            return res.status(404).json({ success: false, message: "Customer Device Not Found" });
        }

        let allTickets = [];

        coustmer.devicesOwened.forEach(device => {
            if (device.ticketIssues.length > 0) {
                allTickets.push(...device.ticketIssues);
            }
        });

        return res.status(200).json({
            success: true,
            totalTickets: allTickets.length,
            tickets: allTickets
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error in getCustomerTicketIssues" });
    }
};


exports.getTicketIssuesListManufactur = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Please provide userId"
            });
        }

        const manufacturUser = await User.findById(userId);

        if (!manufacturUser || !manufacturUser.manufacturId) {
            return res.status(404).json({
                success: false,
                message: "Manufacturer not found"
            });
        }

        const manufactur = await ManuFactur.findById(manufacturUser.manufacturId)
            .populate("ticketIssues");

        return res.status(200).json({
            success: true,
            ticketIssues: manufactur.ticketIssues
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
// -----------------------------------------------//



// work on Ticket Issue System For Deler
exports.ticketIssueByDeler = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "UserId missing"
            });
        }

        const { vechileNo, issueType, issueDescription, address } = req.body;

        if (!vechileNo || !issueType || !issueDescription || !address) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // ----------------------------------------------------
        // 1️⃣ Find dealer user
        // ----------------------------------------------------
        const dealerUser = await User.findById(userId).lean();
        if (!dealerUser) {
            return res.status(404).json({
                success: false,
                message: "Dealer not found"
            });
        }

        // ----------------------------------------------------
        // 2️⃣ Find manufacturer user (this is stored in dealer.manufacturId)
        // ----------------------------------------------------
        const manufacturUser = await User.findById(dealerUser.manufacturId).lean();
        if (!manufacturUser) {
            return res.status(404).json({
                success: false,
                message: "Manufacturer user not found"
            });
        }

        // ----------------------------------------------------
        // 3️⃣ Find manufacturer company (ManuFactur)
        //     This is stored inside manufacturUser.manufacturId
        // ----------------------------------------------------
        const manufacturer = await ManuFactur.findById(manufacturUser.manufacturId).lean();
        if (!manufacturer) {
            return res.status(404).json({
                success: false,
                message: "Manufacturer not found"
            });
        }

        // ----------------------------------------------------
        // 4️⃣ Create ticket
        // ----------------------------------------------------
        const newTicketIssue = await TicketIssue.create({
            delerTicketIssueId: userId,
            ticketIssueNo: Math.floor(100000 + Math.random() * 900000),
            vechileNo,
            issueType,
            issueDescription,
            address,
            issuseAssignTo: manufacturer._id,
            issuseAssignToModel: "ManuFactur",
            issueStatus: "Open",
        });

        // ----------------------------------------------------
        // 5️⃣ Push ticket into manufacturer + dealer (parallel)
        // ----------------------------------------------------
        await Promise.all([
            ManuFactur.updateOne(
                { _id: manufacturer._id },
                { $push: { ticketIssues: newTicketIssue._id } }
            ),
            CreateDelerUnderDistributor.updateOne(
                { _id: dealerUser.distributorDelerId },
                { $push: { ticketIssues: newTicketIssue._id } }
            )
        ]);

        return res.status(200).json({
            success: true,
            message: "Ticket created successfully",
            ticket: newTicketIssue
        });

    } catch (error) {
        console.error("Ticket Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

exports.fetchAllDelerTicketIssue = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide UserId"
            })
        }


        // find in user collections
        const delerUser = await User.findById(userId);
        if (!delerUser) {
            return res.status(200).json({
                sucess: false,
                message: "No Deler User Found"
            })
        }

        // find in deler collections
        const deler = await CreateDelerUnderDistributor.findById(delerUser.distributorDelerId)
            .populate("ticketIssues");

        if (!deler) {
            return res.status(200).json({
                sucess: false,
                message: "No Deler Found"
            })
        }

        return res.status(200).json({
            sucess: true,
            totalTickets: deler.ticketIssues.length,
            tickets: deler.ticketIssues,
            message: "Fecthed All Ticket Issues SucessFully"
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in fetchAllDelerTicketIssue"
        })
    }
}

exports.fetchAllVechileNoByDeler = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "UserId missing"
            });
        }

        // 1️⃣ Fetch dealer user (lean = faster)
        const dealerUser = await User.findById(userId)
            .select("manufacturId")
            .lean();

        if (!dealerUser) {
            return res.status(404).json({
                success: false,
                message: "Dealer not found"
            });
        }

        // 2️⃣ Fetch manufacturer user
        const manufacturUser = await User.findById(dealerUser.manufacturId)
            .select("_id")
            .lean();

        if (!manufacturUser) {
            return res.status(404).json({
                success: false,
                message: "Manufacturer user not found"
            });
        }

        // 3️⃣ Fetch only `vechileNo` with projection
        const vehicles = await MapDevice.find(
            { manufacturId: manufacturUser._id },
            { vechileNo: 1, _id: 0 } // only required field → faster
        ).lean();

        if (!vehicles.length) {
            return res.status(200).json({
                success: false,
                message: "No vehicle numbers found",
                vechileNos: []
            });
        }

        return res.status(200).json({
            success: true,
            vechileNos: vehicles.map(v => v.vechileNo),
            message: "Fetched all vehicle numbers successfully"
        });

    } catch (error) {
        console.error("Fetch Vehicle Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error in fetchAllVechileNoByDeler"
        });
    }
};


// Here Chatting for manufactur and deler 
// -----------------------------------------------//
// exports.chatBetweenManufacturAndDeler = async (req, res) => {
//     try {
//         const userId = req.user.userId;
//         if (!userId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "UserId missing"
//             });
//         }


//         const { receiverId, message, ticketIssueId } = req.body;
//         if (!receiverId || !message || !ticketIssueId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "receiverId and message and ticketIssueId are required"
//             });
//         }

//         // Here I have to Convert receiverId to User.manufacturId (For user is Deler)
//         const user = await User.findById(userId);
//         const rec = await User.findOne({ manufacturId: receiverId })

//         if (!res) {
//             return res.status(200).json({
//                 success: false,
//                 message: "ReciverId Not Found"
//             })
//         }

//         if (user.role === "dealer-distributor") {
//             // create new chat message
//             const newChat = await ChatMessage.create({
//                 senderId: userId,
//                 receiverId: rec._id,
//                 ticketIssueId,
//                 message,
//                 timestamp: new Date()
//             });


//             return res.status(200).json({
//                 success: true,
//                 message: "Message sent successfully",
//                 chat: newChat
//             });
//         } else {
//             // create new chat message
//             const newChat = await ChatMessage.create({
//                 senderId: userId,
//                 receiverId,
//                 ticketIssueId,
//                 message,
//                 timestamp: new Date()
//             });

//             return res.status(200).json({
//                 success: true,
//                 message: "Message sent successfully",
//                 chat: newChat
//             });
//         }

//     } catch (error) {
//         console.error("Chat Error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Server error in chatBetweenManufacturAndDeler"
//         });
//     }
// }


exports.chatBetweenManufacturAndDeler = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "UserId missing"
            });
        }

        const { receiverId, message, ticketIssueId } = req.body;

        if (!receiverId || !message || !ticketIssueId) {
            return res.status(400).json({
                success: false,
                message: "receiverId, message and ticketIssueId are required"
            });
        }

        // Fetch the logged-in user
        const currentUser = await User.findById(userId).lean();
        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        let finalReceiverId;

        // -----------------------------
        // If sender is DEALER:
        // receiverId = manufacturerId (not User._id!)
        // We convert it into actual User._id
        // -----------------------------
        if (currentUser.role === "dealer-distributor") {
            const manufacturer = await User.findOne({ manufacturId: receiverId }).lean();

            if (!manufacturer) {
                return res.status(404).json({
                    success: false,
                    message: "Manufacturer not found for provided receiverId"
                });
            }

            finalReceiverId = manufacturer._id;

        } else {
            // -----------------------------
            // If sender is MANUFACTURER:
            // receiverId is already User._id of dealer
            // -----------------------------
            const dealer = await User.findById(receiverId).lean();

            if (!dealer) {
                return res.status(404).json({
                    success: false,
                    message: "Dealer not found for receiverId"
                });
            }

            finalReceiverId = receiverId;
        }

        // -----------------------------
        // Create message
        // -----------------------------
        const newChat = await ChatMessage.create({
            senderId: userId,
            receiverId: finalReceiverId,
            ticketIssueId,
            message,
            delivered: false,
            read: false,
            messageType: "text",
            timestamp: Date.now()
        });

        return res.status(200).json({
            success: true,
            message: "Message sent successfully",
            chat: newChat
        });

    } catch (error) {
        console.error("Chat Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error in chatBetweenManufacturAndDeler",
            error: error.message
        });
    }
};



exports.getAllMessagesBetweenUsers = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "UserId missing"
            });
        }

        const { otherUserId, ticketIssueId } = req.body;

        if (!otherUserId || !ticketIssueId) {
            return res.status(400).json({
                success: false,
                message: "otherUserId and ticketIssueId are required"
            });
        }

        // --------------------------------------------
        // Resolve receiver like chatBetweenManufacturAndDeler
        // If sender is dealer, otherUserId = manufacturId
        // If sender is manufacturer, otherUserId = dealer userId
        // --------------------------------------------
        const currentUser = await User.findById(userId);

        let otherUser;

        if (currentUser.role === "dealer-distributor") {
            // dealer → manufacturer
            otherUser = await User.findOne({ manufacturId: otherUserId });
        } else {
            // manufacturer → dealer
            otherUser = await User.findById(otherUserId);
        }

        if (!otherUser) {
            return res.status(404).json({
                success: false,
                message: "Chat user not found"
            });
        }

        // --------------------------------------------
        // Fetch messages between these two users
        // --------------------------------------------
        const messages = await ChatMessage.find({
            ticketIssueId,
            $or: [
                { senderId: userId, receiverId: otherUser._id },
                { senderId: otherUser._id, receiverId: userId }
            ]
        })
            .sort({ timestamp: 1 })
            .lean();

        return res.status(200).json({
            success: true,
            message: "Messages fetched successfully",
            total: messages.length,
            messages
        });

    } catch (error) {
        console.error("Fetch Chat Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error in getAllMessagesBetweenUsers"
        });
    }
};



// Here work on Chatting In between Coustmer and Manufactur 
exports.chatBetweenCoustmerAndManuFactur = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid userId"
            });
        }

        const { receiverId, message, ticketIssueId } = req.body;

        // Basic validation
        if (!receiverId || !message || !ticketIssueId) {
            return res.status(400).json({
                success: false,
                message: "receiverId, message and ticketIssueId are required"
            });
        }

        // Fetch current user
        const currentUser = await User.findById(userId).lean();
        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: "Sender user not found"
            });
        }

        let finalReceiverId;

        /**
         * ➤ If the sender is a customer:
         * receiverId = manufacturId → Convert to actual User._id
         */
        if (currentUser.role === "coustmer") {
            const receiverUser = await User.findOne({ manufacturId: receiverId }).lean();

            if (!receiverUser) {
                return res.status(404).json({
                    success: false,
                    message: "Receiver user not found (Invalid manufacturId)"
                });
            }

            finalReceiverId = receiverUser._id;
        }
        else {
            // Any other role: direct message with provided receiverId
            finalReceiverId = receiverId;
        }

        // Save Chat Message
        const newChat = await ChatMessage.create({
            senderId: userId,
            receiverId: finalReceiverId,
            ticketIssueId,
            message,
            delivered: false,
            read: false,
            messageType: "text",
            timestamp: new Date()
        });

        return res.status(200).json({
            success: true,
            message: "Message sent successfully",
            chat: newChat
        });

    } catch (error) {
        console.error("Chat Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error in chatBetweenCoustmerAndManuFactur"
        });
    }
};


exports.getAllMessagesBetweenCoustmerAndManufactur = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "UserId missing"
            });
        }

        const { receiverId, ticketIssueId } = req.body;

        if (!receiverId || !ticketIssueId) {
            return res.status(400).json({
                success: false,
                message: "receiverId and ticketIssueId are required"
            });
        }

        // Fetch sender (current user)
        const currentUser = await User.findById(userId).lean();
        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: "Sender user not found"
            });
        }

        let finalReceiverId;

        /**
         * If current user is a customer:
         * receiverId = manufacturId → convert to actual User._id
         */
        if (currentUser.role === "coustmer") {
            const receiverUser = await User.findOne({ manufacturId: receiverId }).lean();

            if (!receiverUser) {
                return res.status(404).json({
                    success: false,
                    message: "Receiver user not found"
                });
            }

            finalReceiverId = receiverUser._id;
        } else {
            // For manufacturer or admin just use receiverId directly
            finalReceiverId = receiverId;
        }

        // Verify user is allowed to view these messages
        if (userId !== finalReceiverId && userId !== currentUser._id.toString()) {
            // already validated but extra protection
        }

        // Fetch the chat messages
        const messages = await ChatMessage.find({
            ticketIssueId,
            $or: [
                { senderId: userId, receiverId: finalReceiverId },
                { senderId: finalReceiverId, receiverId: userId }
            ]
        })
            .sort({ timestamp: 1 })    // ascending → oldest to newest
            .lean();

        return res.status(200).json({
            success: true,
            message: "Messages fetched successfully",
            total: messages.length,
            messages
        });

    } catch (error) {
        console.log("Error in getAllMessagesBetweenCoustmerAndManufactur:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in getAllMessagesBetweenCoustmerAndManufactur"
        });
    }
};



// close the Ticket API
exports.manufacturCloseTicketApi = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Please Provide UserId"
            });
        }

        const { ticketId } = req.body;

        if (!ticketId) {
            return res.status(400).json({
                success: false,
                message: "Please Provide ticketId"
            });
        }

        // Validate User
        const user = await User.findById(userId).lean();
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Only manufacturer allowed
        if (user.role !== "manufacturer") {
            return res.status(403).json({
                success: false,
                message: "You are unauthorized to close this ticket"
            });
        }

        // Fetch ticket
        const ticket = await TicketIssue.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        // Update ticket status → Close
        ticket.issueStatus = "Close";  // or "Closed" if your system uses that
        ticket.closedAt = new Date();  // optional: track time
        await ticket.save();

        return res.status(200).json({
            success: true,
            message: "Ticket closed successfully",
            ticket
        });

    } catch (error) {
        console.log("Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in ManufacturCloseTicket"
        });
    }
};







// now working on distributor fetch all allocated Barcode
exports.fetchDistributorAllocatedBarcode = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: "Please Provide UserId"
            });
        };


        const distUser = await User.findById(userId);

        if (!distUser) {
            return res.status(200).json({
                success: false,
                message: "Distributor User Not Found"
            });
        };

        const dist = await Distributor.findById(distUser.distributorId);
        if (!dist) {
            return res.status(200).json({
                success: false,
                message: "Distributor Not Found"
            });
        };

        return res.status(200).json({
            success: true,
            message: "Barcode Fetched SucessFully",
            distributor: dist.allocateBarcodes
        })

    } catch (error) {
        console.log("Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in fetchDistributorAllocatedBarcode"
        });
    }
}


// exports.distributorAllocatedBarCode = async (req, res) => {
//     try {
//         const userId = req.user.userId;

//         if (!userId) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Unauthorized: Please Provide UserID"
//             });
//         }

//         const { delerId, barcodeNos } = req.body;

//         if (!delerId) {
//             return res.status(200).json({
//                 success: false,
//                 message: "Please Provide delerId"
//             });
//         }

//         if (!barcodeNos || !Array.isArray(barcodeNos) || barcodeNos.length === 0) {
//             return res.status(200).json({
//                 success: false,
//                 message: "Please Provide barcodeNos as a non-empty array"
//             });
//         }

//         // Find Dealer
//         const realDeler = await CreateDelerUnderDistributor.findById(delerId);
//         if (!realDeler) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Dealer Not Found"
//             });
//         }

//         // Fetch barcode objects
//         const barcodeObjects = await createBarCode.find({
//             barCodeNo: { $in: barcodeNos }
//         });

//         if (barcodeObjects.length !== barcodeNos.length) {
//             const found = barcodeObjects.map(b => b.barCodeNo);
//             const missing = barcodeNos.filter(b => !found.includes(b));

//             return res.status(404).json({
//                 success: false,
//                 message: "Some barcodes not found",
//                 missing
//             });
//         }

//         // Prevent double allocation
//         const alreadyAllocated = barcodeObjects.filter(b =>
//             b.allocatedTo || b.allocatedDistributorId || b.allocatedDelerId
//         );

//         if (alreadyAllocated.length > 0) {
//             return res.status(200).json({
//                 success: false,
//                 message: "Some barcodes are already allocated",
//                 alreadyAllocated: alreadyAllocated.map(b => b.barCodeNo)
//             });
//         }

//         // ------------------- CREATE FULL BARCODE OBJECTS -------------------
//         const formattedBarcodes = barcodeObjects.map(b => ({
//             manufacturId: b.manufacturId,
//             elementName: b.elementName,
//             elementType: b.elementType,
//             elementModelNo: b.elementModelNo,
//             elementPartNo: b.elementPartNo,
//             elementTacNo: b.elementTacNo,
//             elementCopNo: b.elementCopNo,
//             copValid: b.copValid,
//             voltage: b.voltage,
//             batchNo: b.batchNo,
//             baecodeCreationType: b.baecodeCreationType,
//             barCodeNo: b.barCodeNo,
//             is_Renew: b.is_Renew,
//             deviceSerialNo: b.deviceSerialNo,
//             simDetails: b.simDetails,
//             status: b.status
//         }));

//         // ------------------- UPDATE BARCODE COLLECTION -------------------
//         await createBarCode.updateMany(
//             { barCodeNo: { $in: barcodeNos } },
//             {
//                 $set: {
//                     status: "ALLOCATED",
//                     allocatedTo: "DEALER",
//                     allocatedDistributorId: userId,
//                     allocatedDelerId: delerId,
//                     allocatedAt: new Date()
//                 }
//             }
//         );

//         // ------------------- PUSH FULL BARCODE OBJECTS TO DEALER -------------------
//         if (!Array.isArray(realDeler.allocateBarcodes)) {
//             realDeler.allocateBarcodes = [];
//         }

//         realDeler.allocateBarcodes.push(...formattedBarcodes);
//         await realDeler.save();

//         return res.status(200).json({
//             success: true,
//             message: "Barcodes allocated successfully to dealer",
//             dealerName: realDeler.name,
//             allocatedCount: formattedBarcodes.length,
//             allocatedBarcodes: formattedBarcodes
//         });

//     } catch (error) {
//         console.log("Error:", error.message);
//         return res.status(500).json({
//             success: false,
//             message: "Server Error in distributorAllocatedBarCode",
//             error: error.message
//         });
//     }
// };


exports.fetchDelerUnderDistributor = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: "Please Provide UserId"
            });
        }

        const distUser = await User.findById(userId);
        if (!distUser) {
            return res.status(200).json({
                success: false,
                message: "No Distributor User Found"
            });
        }

        // Fetch all dealers under this distributor
        const delerList = await CreateDelerUnderDistributor.find({
            distributorId: distUser.distributorId
        });

        if (delerList.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No Dealers Found"
            });
        }

        // Format dealer list response
        const formattedDelerList = delerList.map(deler => ({
            _id: deler._id,
            dealerName: deler.business_Name,
            mobile: deler.mobile,
            email: deler.email
        }));

        return res.status(200).json({
            success: true,
            delerList: formattedDelerList
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error in fetchDelerUnderDistributor",
            error: error.message
        });
    }
};


exports.distributorAllocatedBarCode = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Please Provide UserID"
            });
        }

        const { delerId, barcodeNos } = req.body;

        if (!delerId) {
            return res.status(200).json({
                success: false,
                message: "Please Provide delerId"
            });
        }

        if (!barcodeNos || !Array.isArray(barcodeNos) || barcodeNos.length === 0) {
            return res.status(200).json({
                success: false,
                message: "Please Provide barcodeNos as a non-empty array"
            });
        }

        // ---------------- FIND DEALER ----------------
        const realDeler = await CreateDelerUnderDistributor.findById(delerId);
        if (!realDeler) {
            return res.status(404).json({
                success: false,
                message: "Dealer Not Found"
            });
        }

        // ---------------- FETCH BARCODE OBJECTS ----------------
        const barcodeObjects = await createBarCode.find({
            barCodeNo: { $in: barcodeNos }
        });

        if (barcodeObjects.length !== barcodeNos.length) {
            const found = barcodeObjects.map(b => b.barCodeNo);
            const missing = barcodeNos.filter(b => !found.includes(b));

            return res.status(404).json({
                success: false,
                message: "Some barcodes not found",
                missing
            });
        }

        // ---------------- PREVENT DOUBLE ALLOCATION ----------------
        const alreadyAllocated = barcodeObjects.filter(b =>
            b.allocatedTo || b.allocatedDistributorId || b.allocatedDelerId
        );

        if (alreadyAllocated.length > 0) {
            return res.status(200).json({
                success: false,
                message: "Some barcodes are already allocated",
                alreadyAllocated: alreadyAllocated.map(b => b.barCodeNo)
            });
        }

        // ---------------- CREATE FULL BARCODE OBJECTS ----------------
        const formattedBarcodes = barcodeObjects.map(b => ({
            manufacturId: b.manufacturId,
            elementName: b.elementName,
            elementType: b.elementType,
            elementModelNo: b.elementModelNo,
            elementPartNo: b.elementPartNo,
            elementTacNo: b.elementTacNo,
            elementCopNo: b.elementCopNo,
            copValid: b.copValid,
            voltage: b.voltage,
            batchNo: b.batchNo,
            baecodeCreationType: b.baecodeCreationType,
            barCodeNo: b.barCodeNo,
            is_Renew: b.is_Renew,
            deviceSerialNo: b.deviceSerialNo,
            simDetails: b.simDetails,
            status: b.status
        }));

        // ---------------- UPDATE BARCODE COLLECTION ----------------
        await createBarCode.updateMany(
            { barCodeNo: { $in: barcodeNos } },
            {
                $set: {
                    status: "ALLOCATED",
                    allocatedTo: "DEALER",
                    allocatedDistributorId: userId,
                    allocatedDelerId: delerId,
                    allocatedAt: new Date()
                }
            }
        );

        // ---------------- SAVE TO DEALER MODEL ----------------
        if (!Array.isArray(realDeler.allocateBarcodes)) {
            realDeler.allocateBarcodes = [];
        }

        realDeler.allocateBarcodes.push(...formattedBarcodes);
        await realDeler.save();

        // ---------------- SAVE TO DistributorAllocateBarcode COLLECTION ----------------

        const distributorBarcode = new DistributorAllocateBarcode({
            distributorId: userId,
            allocatedDelerId: delerId,
            allocatedBarcode: formattedBarcodes,
            delerName: realDeler.name,
            country: realDeler.country,
            state: realDeler.state,
            element: formattedBarcodes[0].elementName
        });

        await distributorBarcode.save();

        return res.status(200).json({
            success: true,
            message: "Barcodes allocated successfully to dealer",
            dealerName: realDeler.name,
            allocatedCount: formattedBarcodes.length,
            allocatedBarcodes: formattedBarcodes
        });

    } catch (error) {
        console.log("Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in distributorAllocatedBarCode",
            error: error.message
        });
    }
};


exports.AllocatedListOfBarCode = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: "UserId Is Missing",
            })
        }

        // find user in User Collections
        const user = await User.findById(userId);
        if (!user) {
            return res.status(200).json({
                success: false,
                message: "user Is Not Found",
            })
        }

        // find in DistributorAllocated Barcode
        const listOfDistrinutorAllocatedBarCode = await DistributorAllocateBarcode.find({ distributorId: user._id });

        if (!listOfDistrinutorAllocatedBarCode) {
            return res.status(200).json({
                success: false,
                message: "listOfDistrinutorAllocatedBarCode Is Not Found",
            })
        };

        // return res To Client
        return res.status(200).json({
            success: true,
            message: "Fetched SucessFully",
            listOfDistrinutorAllocatedBarCode,
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in AllocatedListOfBarCode"
        })
    }
}


exports.DistributorCreateDeler = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Missing userId"
            });
        }

        const {
            business_Name, name, email, gender, mobile, date_of_birth,
            age, Is_Map_Device_Edit, pan_Number, occupation,
            Advance_Payment, languages_Known, country, state,
            district, RTO_Division, Pin_Code, area, address
        } = req.body;

        // 🟥 REQUIRED fields list
        const requiredFields = {
            business_Name: "Business Name",
            name: "Name",
            email: "Email",
            gender: "Gender",
            mobile: "Mobile",
            date_of_birth: "Date of Birth",
            age: "Age",
            Is_Map_Device_Edit: "Is_Map_Device_Edit",
            pan_Number: "PAN Number",
            occupation: "Occupation",
            Advance_Payment: "Advance Payment",
            languages_Known: "Languages Known",
            country: "Country",
            state: "State",
            district: "District",
            RTO_Division: "RTO Division",
            Pin_Code: "Pin Code",
            area: "Area",
            address: "Address"
        };

        // 🟦 Loop through validation
        for (const [key, label] of Object.entries(requiredFields)) {
            if (!req.body[key]) {
                return res.status(200).json({
                    success: false,
                    message: `Please provide ${label}`
                });
            }
        }

        // 🟩 Email Format Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(200).json({
                success: false,
                message: "Invalid email format"
            });
        }

        // 🟩 Mobile Validation (10 digits)
        if (mobile.length !== 10) {
            return res.status(200).json({
                success: false,
                message: "Mobile number must be 10 digits"
            });
        }

        // ❗ Check if Dealer Email Already Exists
        const existsInDealerTable = await CreateDelerUnderDistributor.findOne({ email });
        const existsInUserTable = await User.findOne({ email });

        if (existsInDealerTable || existsInUserTable) {
            return res.status(200).json({
                success: false,
                message: "Dealer already exists"
            });
        }

        // Fetch distributor user
        const userDist = await User.findById(userId);
        if (!userDist) {
            return res.status(200).json({
                success: false,
                message: "Distributor user not found"
            });
        }

        if (!userDist.distributorId) {
            return res.status(200).json({
                success: false,
                message: "Distributor ID missing for this user"
            });
        }

        // ⭐ Create Dealer in CreateDelerUnderDistributor collection
        const saveDeler = new CreateDelerUnderDistributor({
            distributorId: userDist.distributorId,
            business_Name,
            name,
            email,
            gender,
            mobile,
            date_of_birth,
            age,
            Is_Map_Device_Edit,
            pan_Number,
            occupation,
            Advance_Payment,
            languages_Known,
            country,
            state,
            district,
            RTO_Division,
            Pin_Code,
            area,
            address,
        });

        await saveDeler.save();

        // ⭐ Create Login User for dealer
        const newUser = new User({
            distributorId: userDist.distributorId,
            email,
            password: mobile,   // password = mobile number
            role: "dealer-distributor",
            distributorDelerId: saveDeler._id
        });

        await newUser.save();

        return res.status(200).json({
            success: true,
            message: "Dealer created successfully",
        });

    } catch (error) {
        console.log("Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error in DistributorCreateDeler"
        });
    }
};


exports.fetchAllDistributorDelerList = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Missing userId"
            });
        }

        // find in user.distributorId
        const fakeUserRefference = await User.findById(userId);

        if (!fakeUserRefference) {
            return res.status(401).json({
                success: false,
                message: "No Data Found"
            });
        }

        // find in CreateDelerUnderDistributor
        const realDistributor = await CreateDelerUnderDistributor.find({ distributorId: fakeUserRefference.distributorId });

        if (realDistributor.length === 0) {
            return res.status(401).json({
                success: false,
                message: "No Data Found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "fetchAllDistributorDelerList",
            countDeler: realDistributor.length,
            realDistributor
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in fetchAllDistributorDelerList"
        })
    }
};



// work on Deler All API
exports.getAllBarcodeListByCurrentDeler = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: "User Id Missing"
            })
        };

        const reffernceUser = await User.findById(userId);
        if (!reffernceUser) {
            return res.status(200).json({
                success: false,
                message: "User Not Found"
            })
        };

        // find in CreateUnderDistributor Collections 
        const realUser = await CreateDelerUnderDistributor.findById(reffernceUser.distributorDelerId);
        if (!realUser) {
            return res.status(200).json({
                success: false,
                message: "realUser Not Found"
            })
        };

        return res.status(200).json({
            success: true,
            message: "Get GetAllBarcodeListByCurrentDeler",
            data: realUser.allocateBarcodes,
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in getAllBarcodeListByCurrentDeler"
        })
    }
}


exports.technicianCreateByDeler = async (req, res) => {
    try {
        const userId = req.user.userId;


        if (!userId) {
            return res.status(200).json({
                success: false,
                message: "User Id Missing"
            })
        };

        const { name, gender, email, mobile, adhar, dateOfBirth, qualification } = req.body;

        // REQUIRED fields list
        const requiredFields = {
            name: "Name",
            gender: "Gender",
            email: "Email",
            mobile: "Mobile Number",
            adhar: "Aadhar Number",
            dateOfBirth: "Date of Birth",
            qualification: "Qualification"
        };

        // Loop to check missing fields
        for (const [key, label] of Object.entries(requiredFields)) {
            if (!req.body[key]) {
                return res.status(400).json({
                    success: false,
                    message: `Please provide ${label}`
                });
            }
        }


        // now find in userCollection
        const refUser = await User.findById(userId);
        if (!refUser) {
            return res.status(200).json({
                success: false,
                message: "refUser Not Found",
            })
        }

        // save in DB
        const newTechenician = new Technicien({
            name,
            gender,
            email,
            mobile,
            adhar,
            dateOfBirth,
            qualification,
            distributorUnderDelerId: refUser.distributorDelerId
        });

        await newTechenician.save();

        return res.status(200).json({
            success: true,
            message: "new Techenican Created SuccessFully",
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in technicianCreateByDeler"
        })
    }
}


exports.fetchAllDelerTechenicien = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: "Please Provide UserId",
            })
        }


        const refUser = await User.findById(userId);
        if (!refUser) {
            return res.status(200).json({
                success: false,
                message: "No Data Found",
            })
        }

        // find in techenicien Collections
        const allTec = await Technicien.find({ distributorUnderDelerId: refUser.distributorDelerId });
        if (allTec.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No Data Found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Fetched SuccessFully",
            allTec,
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in fetchAllDelerTechenicien"
        })
    }
}


exports.delerMapDevice = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: "UserId Missing"
            })
        }

        // read data from req.body;
        let {
            country, state, deviceType, deviceNo, voltage, elementType, batchNo, simDetails, VechileBirth, RegistrationNo, date, ChassisNumber, EngineNumber, VehicleType, MakeModel, ModelYear, InsuranceRenewDate, PollutionRenewdate, vechileNo, fullName, email, mobileNo, GstinNo, Customercountry, Customerstate, Customerdistrict, Rto, PinCode, CompliteAddress, AdharNo, PanNo, Packages, InvoiceNo, VehicleKMReading, DriverLicenseNo, MappedDate, NoOfPanicButtons
        } = req.body;


        // Parse simDetails if string
        try {
            if (typeof simDetails === "string" && simDetails.trim() !== "") {
                simDetails = JSON.parse(simDetails);
            }
        } catch (err) {
            return res.status(400).json({ success: false, message: "Invalid simDetails format" });
        }


        // save in db
        const newDelerMapDevice = new DelerMapDevice({
            delerId: userId, country, state, deviceType, deviceNo, voltage, elementType, batchNo, simDetails, VechileBirth, RegistrationNo, date, ChassisNumber, EngineNumber, VehicleType, MakeModel, ModelYear, InsuranceRenewDate, PollutionRenewdate, vechileNo, fullName, email, mobileNo, GstinNo, Customercountry, Customerstate, Customerdistrict, Rto, PinCode, CompliteAddress, AdharNo, PanNo, Packages, InvoiceNo, VehicleKMReading, DriverLicenseNo, MappedDate, NoOfPanicButtons,
        });

        const savedMapDevice = await newDelerMapDevice.save();
        // Immediate response to client (fast)
        res.status(200).json({
            success: true,
            message: "Device mapped successfully (background customer/user processing started)",
            mapDeviceId: savedMapDevice._id
        });


        // Background processing (non-blocking)
        setImmediate(async () => {
            console.time(`manuFacturMAPaDevice:${savedMapDevice._id}`);

            try {
                const deviceObject = {
                    deviceType,
                    deviceNo,
                    voltage,
                    elementType,
                    batchNo,
                    simDetails,
                    Packages,
                    VechileBirth,
                    RegistrationNo,
                    date,
                    ChassisNumber,
                    EngineNumber,
                    VehicleType,
                    MakeModel,
                    ModelYear,
                    InsuranceRenewDate,
                    PollutionRenewdate,
                    vechileNo,
                };

                // ✅ Create or update customer AND return customer document
                const savedCustomer = await CoustmerDevice.findOneAndUpdate(
                    { mobileNo },
                    {
                        $setOnInsert: {
                            delerId: userId,
                            fullName,
                            email,
                            mobileNo,
                            GstinNo,
                            Customercountry,
                            Customerstate,
                            Customerdistrict,
                            Rto,
                            PinCode,
                            CompliteAddress,
                            AdharNo,
                            PanNo
                        },
                        $push: { devicesOwened: deviceObject }
                    },
                    {
                        upsert: true,
                        new: true // ✅ returns the document
                    }
                );

                console.timeLog(`manuFacturMAPaDevice:${savedMapDevice._id}`, "customer saved");

                // ✅ Now insert coustmerId = savedCustomer._id
                // ✅ Check if user already exists

                // await User.updateOne(
                //     { email },
                //     {
                //         $setOnInsert: {
                //             email,
                //             password: mobileNo,
                //             role: "coustmer",
                //             coustmerId: savedCustomer._id
                //         }
                //     },
                //     { upsert: true }
                // );


                const existingUser = await User.findOne({ email });

                if (!existingUser) {
                    // ✅ Create new user
                    await User.create({
                        email,
                        password: mobileNo,
                        role: "coustmer",
                        coustmerId: savedCustomer._id
                    });

                    console.log("✅ New user created");
                } else {
                    console.log("✅ User already exists, not creating again");
                }


                console.timeLog(`manuFacturMAPaDevice:${savedMapDevice._id}`, "user processed");
                console.timeEnd(`manuFacturMAPaDevice:${savedMapDevice._id}`);

            } catch (err) {
                console.error("Background processing error:", err);
            }
        });

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in delerMapDevice"
        })
    }
}

exports.fetchDelerMapDevices = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: "Please Provide UserId",
            })
        }

        // find in delerMapDevice Collections
        const delMapDevice = await DelerMapDevice.find({ delerId: userId });

        if (delMapDevice.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No Map Device Found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Fetched DelerMap device SuccessFully",
            count: delMapDevice.length,
            delMapDevice,
        })

    } catch (error) {
        console.log(error, error.message)
    }
}


exports.fetchdelerSubscriptionPlans = async (req, res) => {
    try {
        const userId = req.user.userId;


        if (!userId) {
            return res.status(200).json({
                success: false,
                message: "please Provide UserId"
            })
        }

        // fetch plans 
        const Packages = await createSubscription.find({});

        if (Packages.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No Package Found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Fetched SuccessFully",
            Packages,
        })


    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in fetchdelerSubscriptionPlans"
        })
    }
}


const haversine = require("haversine-distance");
const { EventEmitterAsyncResource } = require("node-cache");


// exports.fetchVehicleDistanceReport = async (req, res) => {
//     try {
//         const userId = req.user?.userId;
//         if (!userId) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Unauthorized"
//             });
//         }

//         const { deviceNo, startTime, endTime } = req.body;

//         if (!deviceNo || !startTime || !endTime) {
//             return res.status(400).json({
//                 success: false,
//                 message: "deviceNo, startTime and endTime are required"
//             });
//         }

//         // 🔍 Validate Device
//         const device = await CoustmerDevice.findOne(
//             { "devicesOwened.deviceNo": deviceNo },
//             { "devicesOwened.$": 1 }
//         );

//         if (!device) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Device not found"
//             });
//         }

//         const imei = device.devicesOwened[0].deviceNo;

//         // 📍 Fetch Route Points
//         const points = await RoutePlayback.find({
//             imei,
//             timestamp: {
//                 $gte: new Date(startTime),
//                 $lte: new Date(endTime)
//             }
//         })
//             .sort({ timestamp: 1 })
//             .select("latitude longitude speed timestamp");

//         if (points.length < 2) {
//             return res.status(200).json({
//                 success: true,
//                 deviceNo,
//                 message: "Not enough data",
//                 totalDistanceKm: 0
//             });
//         }

//         // ================= CALCULATIONS =================
//         let totalDistanceMeters = 0;
//         let totalSpeed = 0;
//         let maxSpeed = 0;

//         let movingTimeSec = 0;
//         let idleTimeSec = 0;

//         for (let i = 1; i < points.length; i++) {
//             const prev = points[i - 1];
//             const curr = points[i];

//             const dist = haversine(
//                 { latitude: prev.latitude, longitude: prev.longitude },
//                 { latitude: curr.latitude, longitude: curr.longitude }
//             );

//             const timeDiff =
//                 (new Date(curr.timestamp) - new Date(prev.timestamp)) / 1000;

//             // Ignore GPS noise
//             if (dist > 5) {
//                 totalDistanceMeters += dist;
//                 movingTimeSec += timeDiff;
//             } else {
//                 idleTimeSec += timeDiff;
//             }

//             totalSpeed += curr.speed || 0;
//             maxSpeed = Math.max(maxSpeed, curr.speed || 0);
//         }

//         const totalTimeSec =
//             (new Date(endTime) - new Date(startTime)) / 1000;

//         const avgSpeed =
//             points.length > 0 ? (totalSpeed / points.length).toFixed(2) : 0;

//         const totalDistanceKm = (totalDistanceMeters / 1000).toFixed(2);

//         // 📍 Start & End Locations
//         const startLocation = {
//             latitude: points[0].latitude,
//             longitude: points[0].longitude,
//             timestamp: points[0].timestamp
//         };

//         const endLocation = {
//             latitude: points[points.length - 1].latitude,
//             longitude: points[points.length - 1].longitude,
//             timestamp: points[points.length - 1].timestamp
//         };

//         // ================= RESPONSE =================
//         return res.status(200).json({
//             success: true,
//             deviceNo,
//             imei,
//             reportPeriod: {
//                 startTime,
//                 endTime
//             },
//             distance: {
//                 totalKm: totalDistanceKm,
//                 totalMeters: Math.round(totalDistanceMeters)
//             },
//             time: {
//                 totalTimeMinutes: Math.floor(totalTimeSec / 60),
//                 movingTimeMinutes: Math.floor(movingTimeSec / 60),
//                 idleTimeMinutes: Math.floor(idleTimeSec / 60)
//             },
//             speed: {
//                 averageSpeed: avgSpeed,
//                 maxSpeed
//             },
//             startLocation,
//             endLocation,
//             totalPoints: points.length,
//             route: points // use this for map polyline
//         });

//     } catch (error) {
//         console.error("❌ Distance Report Error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to fetch distance report"
//         });
//     }
// };


// exports.fetchVehicleDistanceReport = async (req, res) => {
//     try {
//         const userId = req.user?.userId;
//         if (!userId) {
//             return res.status(401).json({ success: false, message: "Unauthorized" });
//         }

//         const { deviceNo, startTime, endTime } = req.body;
//         if (!deviceNo || !startTime || !endTime) {
//             return res.status(400).json({
//                 success: false,
//                 message: "deviceNo, startTime and endTime are required"
//             });
//         }

//         // 🔍 Validate device
//         const device = await CoustmerDevice.findOne(
//             { "devicesOwened.deviceNo": deviceNo },
//             { "devicesOwened.$": 1 }
//         );

//         if (!device) {
//             return res.status(404).json({ success: false, message: "Device not found" });
//         }

//         const imei = device.devicesOwened[0].deviceNo;

//         // 📍 Fetch route data
//         const points = await RoutePlayback.find({
//             imei,
//             timestamp: { $gte: new Date(startTime), $lte: new Date(endTime) }
//         })
//             .sort({ timestamp: 1 })
//             .select("latitude longitude speed timestamp");

//         if (points.length < 2) {
//             return res.json({ success: true, trips: [] });
//         }

//         // ================= TRIP LOGIC =================
//         const trips = [];
//         let currentTrip = null;
//         let idleTime = 0;

//         for (let i = 1; i < points.length; i++) {
//             const prev = points[i - 1];
//             const curr = points[i];

//             const dist = haversine(
//                 { latitude: prev.latitude, longitude: prev.longitude },
//                 { latitude: curr.latitude, longitude: curr.longitude }
//             );

//             const timeDiff =
//                 (new Date(curr.timestamp) - new Date(prev.timestamp)) / 1000;

//             // 🚗 MOVING
//             if (dist > 5) {
//                 idleTime = 0;

//                 if (!currentTrip) {
//                     currentTrip = {
//                         startTime: prev.timestamp,
//                         startLocation: {
//                             latitude: prev.latitude,
//                             longitude: prev.longitude
//                         },
//                         distanceMeters: 0,
//                         durationSec: 0
//                     };
//                 }

//                 currentTrip.distanceMeters += dist;
//                 currentTrip.durationSec += timeDiff;
//             }
//             // 🛑 IDLE
//             else if (currentTrip) {
//                 idleTime += timeDiff;

//                 // End trip if idle > 5 minutes
//                 if (idleTime >= 300) {
//                     currentTrip.endTime = prev.timestamp;
//                     currentTrip.endLocation = {
//                         latitude: prev.latitude,
//                         longitude: prev.longitude
//                     };

//                     trips.push(currentTrip);
//                     currentTrip = null;
//                     idleTime = 0;
//                 }
//             }
//         }

//         // 🧾 Push last trip
//         if (currentTrip) {
//             const last = points[points.length - 1];
//             currentTrip.endTime = last.timestamp;
//             currentTrip.endLocation = {
//                 latitude: last.latitude,
//                 longitude: last.longitude
//             };
//             trips.push(currentTrip);
//         }

//         // ================= FORMAT OUTPUT =================
//         const formattedTrips = trips.map(t => ({
//             startTime: t.startTime,
//             endTime: t.endTime,
//             startLocation: t.startLocation,
//             endLocation: t.endLocation,
//             distanceKm: (t.distanceMeters / 1000).toFixed(2),
//             duration: {
//                 minutes: Math.floor(t.durationSec / 60),
//                 seconds: Math.floor(t.durationSec % 60)
//             }
//         }));

//         return res.status(200).json({
//             success: true,
//             deviceNo,
//             imei,
//             totalTrips: formattedTrips.length,
//             trips: formattedTrips
//         });

//     } catch (error) {
//         console.error("Distance Report Error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to generate distance report"
//         });
//     }
// };





exports.fetchVehicleDistanceReport = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { deviceNo, startTime, endTime } = req.body;
        if (!deviceNo || !startTime || !endTime) {
            return res.status(400).json({
                success: false,
                message: "deviceNo, startTime and endTime are required"
            });
        }

        const device = await CoustmerDevice.findOne(
            { "devicesOwened.deviceNo": deviceNo },
            { "devicesOwened.$": 1 }
        );

        if (!device) {
            return res.status(404).json({ success: false, message: "Device not found" });
        }

        const imei = device.devicesOwened[0].deviceNo;

        const points = await RoutePlayback.find({
            imei,
            timestamp: { $gte: new Date(startTime), $lte: new Date(endTime) }
        })
            .sort({ timestamp: 1 })
            .select("latitude longitude speed timestamp");

        if (points.length < 2) {
            return res.json({ success: true, trips: [] });
        }

        let trips = [];
        let currentTrip = null;
        let idleTime = 0;
        let overallMaxSpeed = 0;

        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];

            const dist = haversine(
                { latitude: prev.latitude, longitude: prev.longitude },
                { latitude: curr.latitude, longitude: curr.longitude }
            );

            const timeDiff =
                (new Date(curr.timestamp) - new Date(prev.timestamp)) / 1000;

            // 🚗 MOVING
            if (dist > 10) {
                idleTime = 0;
                overallMaxSpeed = Math.max(overallMaxSpeed, curr.speed || 0);

                if (!currentTrip) {
                    currentTrip = {
                        startTime: prev.timestamp,
                        startLocation: {
                            latitude: prev.latitude,
                            longitude: prev.longitude
                        },
                        distanceMeters: 0,
                        durationSec: 0,
                        maxSpeed: curr.speed || 0
                    };
                }

                currentTrip.distanceMeters += dist;
                currentTrip.durationSec += timeDiff;
                currentTrip.maxSpeed = Math.max(
                    currentTrip.maxSpeed,
                    curr.speed || 0
                );
            }
            // 🛑 IDLE
            else if (currentTrip) {
                idleTime += timeDiff;

                if (idleTime >= 300) {
                    currentTrip.endTime = prev.timestamp;
                    currentTrip.endLocation = {
                        latitude: prev.latitude,
                        longitude: prev.longitude
                    };
                    trips.push(currentTrip);
                    currentTrip = null;
                    idleTime = 0;
                }
            }
        }

        // Push last trip
        if (currentTrip) {
            const last = points[points.length - 1];
            currentTrip.endTime = last.timestamp;
            currentTrip.endLocation = {
                latitude: last.latitude,
                longitude: last.longitude
            };
            trips.push(currentTrip);
        }

        const formattedTrips = trips.map(t => ({
            startTime: t.startTime,
            endTime: t.endTime,
            distanceKm: (t.distanceMeters / 1000).toFixed(2),
            duration: {
                minutes: Math.floor(t.durationSec / 60),
                seconds: Math.floor(t.durationSec % 60)
            },
            maxSpeed: t.maxSpeed,
            startLocation: t.startLocation,
            endLocation: t.endLocation
        }));

        const totalDistanceKm = formattedTrips
            .reduce((sum, t) => sum + parseFloat(t.distanceKm), 0)
            .toFixed(2);

        return res.status(200).json({
            success: true,
            deviceNo,
            imei,
            reportPeriod: { startTime, endTime },
            totalDistanceKm,
            overallMaxSpeed,
            totalTrips: formattedTrips.length,
            trips: formattedTrips
        });

    } catch (error) {
        console.error("❌ Distance Report Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch distance report"
        });
    }
};





exports.fetchStoppageReport = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const { deviceNo, date, startTime, endTime } = req.body;

        if (!deviceNo || !date || !startTime || !endTime) {
            return res.status(400).json({
                success: false,
                message: "deviceNo, date, startTime and endTime are required"
            });
        }

        // 🕒 Build full datetime
        const startDateTime = new Date(`${date}T${startTime}.000+05:30`);
        const endDateTime = new Date(`${date}T${endTime}.000+05:30`);

        // 🔍 Validate Device
        const device = await CoustmerDevice.findOne(
            { "devicesOwened.deviceNo": deviceNo },
            { "devicesOwened.$": 1 }
        );

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Device not found"
            });
        }

        const imei = device.devicesOwened[0].deviceNo;

        // 📍 Fetch route points
        const points = await RoutePlayback.find({
            imei,
            timestamp: {
                $gte: startDateTime,
                $lte: endDateTime
            }
        })
            .sort({ timestamp: 1 })
            .select("latitude longitude speed timestamp");

        if (points.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No data found",
                stoppages: []
            });
        }

        // ================= STOPPAGE LOGIC =================
        const MIN_STOP_SECONDS = 300; // 5 min
        let stoppages = [];

        let stopStart = null;
        let stopLocation = null;

        for (let i = 0; i < points.length; i++) {
            const curr = points[i];

            if (curr.speed === 0) {
                if (!stopStart) {
                    stopStart = curr.timestamp;
                    stopLocation = {
                        latitude: curr.latitude,
                        longitude: curr.longitude
                    };
                }
            } else {
                if (stopStart) {
                    const stopEnd = curr.timestamp;
                    const durationSec =
                        (new Date(stopEnd) - new Date(stopStart)) / 1000;

                    if (durationSec >= MIN_STOP_SECONDS) {
                        stoppages.push({
                            startTime: stopStart,
                            endTime: stopEnd,
                            duration: {
                                seconds: durationSec,
                                minutes: Math.floor(durationSec / 60)
                            },
                            location: stopLocation
                        });
                    }

                    stopStart = null;
                    stopLocation = null;
                }
            }
        }

        // 🔚 Handle last stoppage
        if (stopStart) {
            const stopEnd = points[points.length - 1].timestamp;
            const durationSec =
                (new Date(stopEnd) - new Date(stopStart)) / 1000;

            if (durationSec >= MIN_STOP_SECONDS) {
                stoppages.push({
                    startTime: stopStart,
                    endTime: stopEnd,
                    duration: {
                        seconds: durationSec,
                        minutes: Math.floor(durationSec / 60)
                    },
                    location: stopLocation
                });
            }
        }

        // ================= RESPONSE =================
        return res.status(200).json({
            success: true,
            deviceNo,
            imei,
            reportDate: date,
            reportPeriod: {
                startTime: startDateTime,
                endTime: endDateTime
            },
            totalStoppages: stoppages.length,
            stoppages
        });

    } catch (error) {
        console.error("❌ fetchStoppageReport Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching stoppage report"
        });
    }
};



exports.fetchIgnitionReport = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const { deviceNo, date, startTime, endTime } = req.body;

        if (!deviceNo || !date || !startTime || !endTime) {
            return res.status(400).json({
                success: false,
                message: "deviceNo, date, startTime and endTime are required"
            });
        }

        // 🕒 Build datetime range
        const startDateTime = new Date(`${date}T${startTime}.000+05:30`);
        const endDateTime = new Date(`${date}T${endTime}.000+05:30`);

        // 🔍 Validate device
        const device = await CoustmerDevice.findOne(
            { "devicesOwened.deviceNo": deviceNo },
            { "devicesOwened.$": 1 }
        );

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Device not found"
            });
        }

        const imei = device.devicesOwened[0].deviceNo;

        // 📍 Fetch route history
        const points = await RoutePlayback.find({
            imei,
            timestamp: {
                $gte: startDateTime,
                $lte: endDateTime
            }
        })
            .sort({ timestamp: 1 })
            .select("latitude longitude timestamp raw.ignition");

        if (points.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No ignition data found",
                ignitionSessions: []
            });
        }

        // ================= IGNITION LOGIC =================
        let ignitionSessions = [];
        let ignitionOnTime = null;
        let startLocation = null;

        for (let i = 0; i < points.length; i++) {
            const curr = points[i];
            const ignition = curr.raw?.ignition;

            // 🔑 Ignition ON
            if (ignition === "1" && !ignitionOnTime) {
                ignitionOnTime = curr.timestamp;
                startLocation = {
                    latitude: curr.latitude,
                    longitude: curr.longitude
                };
            }

            // 🔒 Ignition OFF
            if (ignition === "0" && ignitionOnTime) {
                const ignitionOffTime = curr.timestamp;
                const durationSec =
                    (new Date(ignitionOffTime) - new Date(ignitionOnTime)) / 1000;

                ignitionSessions.push({
                    ignitionOnTime,
                    ignitionOffTime,
                    duration: {
                        seconds: durationSec,
                        minutes: Math.floor(durationSec / 60)
                    },
                    startLocation
                });

                ignitionOnTime = null;
                startLocation = null;
            }
        }

        // 🔚 Handle ignition still ON
        if (ignitionOnTime) {
            const ignitionOffTime = endDateTime;
            const durationSec =
                (new Date(ignitionOffTime) - new Date(ignitionOnTime)) / 1000;

            ignitionSessions.push({
                ignitionOnTime,
                ignitionOffTime,
                duration: {
                    seconds: durationSec,
                    minutes: Math.floor(durationSec / 60)
                },
                startLocation,
                status: "Still ON"
            });
        }

        // ================= RESPONSE =================
        return res.status(200).json({
            success: true,
            deviceNo,
            imei,
            reportDate: date,
            reportPeriod: {
                startTime: startDateTime,
                endTime: endDateTime
            },
            totalIgnitionCycles: ignitionSessions.length,
            ignitionSessions
        });

    } catch (error) {
        console.error("❌ fetchIgnitionReport Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching ignition report"
        });
    }
};



exports.fetchMovingTimeReport = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"

            });
        }

        const { deviceNo, date, startTime, endTime } = req.body;

        if (!deviceNo || !date || !startTime || !endTime) {
            return res.status(400).json({
                success: false,
                message: "deviceNo, date, startTime and endTime are required"
            });
        }


        // 🕒 Build datetime range

        const startDateTime = new Date(`${date}T${startTime}.000+05:30`);
        const endDateTime = new Date(`${date}T${endTime}.000+05:30`);
        // 🔍 Validate device

        const device = await CoustmerDevice.findOne(
            { "devicesOwened.deviceNo": deviceNo },
            { "devicesOwened.$": 1 }
        );

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Device not found"
            });
        }

        const imei = device.devicesOwened[0].deviceNo;
        // 📍 Fetch route history
        const points = await RoutePlayback.find({
            imei,
            timestamp: {
                $gte: startDateTime,
                $lte: endDateTime
            }
        })
            .sort({ timestamp: 1 })
            .select("latitude longitude speed timestamp");
        if (points.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No data found",
                movingTime: 0
            });
        }
        // ================= MOVING TIME LOGIC =================
        let movingTimeSec = 0;
        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const dist = haversine(
                { latitude: prev.latitude, longitude: prev.longitude },
                { latitude: curr.latitude, longitude: curr.longitude }
            );
            const timeDiff = (new Date(curr.timestamp) - new Date(prev.timestamp)) / 1000;
            // Ignore GPS noise
            if (dist > 5) {
                movingTimeSec += timeDiff;
            }

        }

        // ================= RESPONSE =================
        return res.status(200).json({
            success: true,
            deviceNo,
            imei,
            reportDate: date,
            reportPeriod: {
                startTime: startDateTime,
                endTime: endDateTime
            },
            movingTime: {
                seconds: movingTimeSec,
                minutes: Math.floor(movingTimeSec / 60)
            }
        });
    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in fetchMovingTimeReport"
        })
    }
}


// exports.fetchIdleTimeReport = async (req, res) => {
//     try {
//         const userId = req.user.userId;

//         if (!userId) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Unauthorized"
//             });
//         }

//         const { deviceNo, date, startTime, endTime } = req.body;

//         if (!deviceNo || !date || !startTime || !endTime) {
//             return res.status(400).json({
//                 success: false,
//                 message: "deviceNo, date, startTime and endTime are required"
//             });
//         }

//         // 🕒 Build datetime range
//         const startDateTime = new Date(`${date}T${startTime}.000+05:30`);
//         const endDateTime = new Date(`${date}T${endTime}.000+05:30`);

//         // 🔍 Validate device
//         const device = await CoustmerDevice.findOne(
//             { "devicesOwened.deviceNo": deviceNo },
//             { "devicesOwened.$": 1 }
//         );

//         if (!device) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Device not found"
//             });
//         }

//         const imei = device.devicesOwened[0].deviceNo;

//         // 📍 Fetch route history
//         const points = await RoutePlayback.find({
//             imei,
//             timestamp: {
//                 $gte: startDateTime,
//                 $lte: endDateTime
//             }
//         })
//             .sort({ timestamp: 1 })

//             .select("latitude longitude speed timestamp");

//         if (points.length === 0) {
//             return res.status(200).json({
//                 success: true,
//                 message: "No data found",
//                 idleTime: 0
//             });
//         }
//         // ================= IDLE TIME LOGIC =================
//         let idleTimeSec = 0;
//         for (let i = 1; i < points.length; i++) {
//             const prev = points[i - 1];
//             const curr = points[i];
//             const dist = haversine(
//                 { latitude: prev.latitude, longitude: prev.longitude },
//                 { latitude: curr.latitude, longitude: curr.longitude }
//             );
//             const timeDiff = (new Date(curr.timestamp) - new Date(prev.timestamp)) / 1000;
//             // Ignore GPS noise
//             if (dist <= 5) {
//                 idleTimeSec += timeDiff;
//             }
//         }

//         // ================= RESPONSE =================
//         return res.status(200).json({
//             success: true,
//             deviceNo,
//             imei,
//             reportDate: date,
//             reportPeriod: {
//                 startTime: startDateTime,
//                 endTime: endDateTime
//             },
//             idleTime: {
//                 seconds: idleTimeSec,
//                 minutes: Math.floor(idleTimeSec / 60)
//             }
//         });

//     } catch (error) {
//         console.log(error, error.message);
//         return res.status(500).json({
//             success: false,
//             message: "Server Error in fetchIdleTimeReport"
//         })
//     }
// }



exports.fetchIdleTimeReport = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const { deviceNo, date, startTime, endTime } = req.body;

        if (!deviceNo || !date || !startTime || !endTime) {
            return res.status(400).json({
                success: false,
                message: "deviceNo, date, startTime and endTime are required"
            });
        }

        // 🕒 Build datetime range (IST)
        const startDateTime = new Date(`${date}T${startTime}.000+05:30`);
        const endDateTime = new Date(`${date}T${endTime}.000+05:30`);

        // 🔍 Validate device
        const device = await CoustmerDevice.findOne(
            { "devicesOwened.deviceNo": deviceNo },
            { "devicesOwened.$": 1 }
        );

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Device not found"
            });
        }

        const imei = device.devicesOwened[0].deviceNo;

        // 📍 Fetch route history
        const points = await RoutePlayback.find({
            imei,
            timestamp: {
                $gte: startDateTime,
                $lte: endDateTime
            }
        })
            .sort({ timestamp: 1 })
            .select("latitude longitude timestamp");

        if (!points || points.length < 2) {
            return res.status(200).json({
                success: true,
                totalIdleTime: { seconds: 0, minutes: 0 },
                idleSessions: []
            });
        }

        // ================= IDLE SESSION LOGIC =================
        const idleSessions = [];

        let idleStartTime = null;
        let idleStartLocation = null;

        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];

            const distance = haversine(
                { latitude: prev.latitude, longitude: prev.longitude },
                { latitude: curr.latitude, longitude: curr.longitude }
            );

            // 📌 Device idle if moved ≤ 5 meters
            if (distance <= 5) {
                if (!idleStartTime) {
                    idleStartTime = prev.timestamp;
                    idleStartLocation = {
                        latitude: prev.latitude,
                        longitude: prev.longitude
                    };
                }
            } else {
                // 🚗 Movement detected → close idle
                if (idleStartTime) {
                    const idleEndTime = prev.timestamp;
                    const durationSec =
                        (new Date(idleEndTime) - new Date(idleStartTime)) / 1000;

                    // Ignore very small idle (< 2 min)
                    if (durationSec >= 120) {
                        idleSessions.push({
                            location: idleStartLocation,
                            startTime: idleStartTime,
                            endTime: idleEndTime,
                            duration: {
                                seconds: Math.round(durationSec),
                                minutes: Math.round(durationSec / 60)
                            }
                        });
                    }

                    idleStartTime = null;
                    idleStartLocation = null;
                }
            }
        }

        // 🕒 Handle idle till last point
        if (idleStartTime) {
            const lastPoint = points[points.length - 1];
            const durationSec =
                (new Date(lastPoint.timestamp) - new Date(idleStartTime)) / 1000;

            if (durationSec >= 120) {
                idleSessions.push({
                    location: idleStartLocation,
                    startTime: idleStartTime,
                    endTime: lastPoint.timestamp,
                    duration: {
                        seconds: Math.round(durationSec),
                        minutes: Math.round(durationSec / 60)
                    }
                });
            }
        }

        // ================= TOTAL IDLE TIME =================
        const totalIdleSeconds = idleSessions.reduce(
            (sum, s) => sum + s.duration.seconds,
            0
        );

        const totalIdleTime = {
            seconds: totalIdleSeconds,
            minutes: Math.round(totalIdleSeconds / 60)
        };

        // ================= RESPONSE =================
        return res.status(200).json({
            success: true,
            deviceNo,
            imei,
            reportDate: date,
            reportPeriod: {
                startTime: startDateTime,
                endTime: endDateTime
            },
            totalIdleTime,
            idleSessions
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server Error in fetchIdleTimeReport"
        });
    }
};



exports.fetchParkingTimeReport = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const { deviceNo, date, startTime, endTime } = req.body;

        if (!deviceNo || !date || !startTime || !endTime) {
            return res.status(400).json({
                success: false,
                message: "deviceNo, date, startTime and endTime are required"
            });
        }

        // 🕒 Build datetime range (IST)
        const startDateTime = new Date(`${date}T${startTime}.000+05:30`);
        const endDateTime = new Date(`${date}T${endTime}.000+05:30`);

        if (endDateTime <= startDateTime) {
            return res.status(400).json({
                success: false,
                message: "endTime must be greater than startTime"
            });
        }

        // 🔍 Validate device
        const device = await CoustmerDevice.findOne(
            { "devicesOwened.deviceNo": deviceNo },
            { "devicesOwened.$": 1 }
        );

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Device not found"
            });
        }

        const imei = device.devicesOwened[0].deviceNo;

        // 📍 Fetch route history
        const points = await RoutePlayback.find({
            imei,
            timestamp: {
                $gte: startDateTime,
                $lte: endDateTime
            }
        })
            .sort({ timestamp: 1 })
            .select("latitude longitude speed timestamp");

        if (points.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No data found",
                totalParkingTime: 0,
                parkingLocations: []
            });
        }

        // ================= PARKING LOGIC =================
        let totalParkingSec = 0;
        let parkingSessions = [];

        let parkingStartTime = null;
        let parkingStartPoint = null;

        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];

            const dist = haversine(
                { latitude: prev.latitude, longitude: prev.longitude },
                { latitude: curr.latitude, longitude: curr.longitude }
            );

            const timeDiff =
                (new Date(curr.timestamp) - new Date(prev.timestamp)) / 1000;

            // 🚗 PARKING CONDITION
            if (dist < 3 && curr.speed <= 1) {

                if (!parkingStartTime) {
                    parkingStartTime = prev.timestamp;
                    parkingStartPoint = {
                        latitude: prev.latitude,
                        longitude: prev.longitude
                    };
                }

                totalParkingSec += timeDiff;

            } else {
                // End of parking session
                if (parkingStartTime) {
                    const parkingEndTime = prev.timestamp;
                    const durationSec =
                        (new Date(parkingEndTime) - new Date(parkingStartTime)) / 1000;

                    // ⛔ Ignore GPS noise (< 2 minutes)
                    if (durationSec >= 120) {
                        parkingSessions.push({
                            location: parkingStartPoint,
                            startTime: parkingStartTime,
                            endTime: parkingEndTime,
                            duration: {
                                seconds: durationSec,
                                minutes: Math.floor(durationSec / 60)
                            }
                        });
                    }

                    parkingStartTime = null;
                    parkingStartPoint = null;
                }
            }
        }

        // Handle parking till last point
        if (parkingStartTime) {
            const lastPoint = points[points.length - 1];
            const durationSec =
                (new Date(lastPoint.timestamp) - new Date(parkingStartTime)) / 1000;

            if (durationSec >= 120) {
                parkingSessions.push({
                    location: parkingStartPoint,
                    startTime: parkingStartTime,
                    endTime: lastPoint.timestamp,
                    duration: {
                        seconds: durationSec,
                        minutes: Math.floor(durationSec / 60)
                    }
                });
            }
        }

        // ================= RESPONSE =================
        return res.status(200).json({
            success: true,
            deviceNo,
            imei,
            reportDate: date,
            reportPeriod: {
                startTime: startDateTime,
                endTime: endDateTime
            },
            totalParkingTime: {
                seconds: totalParkingSec,
                minutes: Math.floor(totalParkingSec / 60)
            },
            parkingLocations: parkingSessions
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server Error in fetchParkingTimeReport"
        });
    }
};



exports.fetchSOSReport = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const { deviceNo, date, startTime, endTime } = req.body;

        if (!deviceNo || !date || !startTime || !endTime) {
            return res.status(400).json({
                success: false,
                message: "deviceNo, date, startTime and endTime are required"
            });
        }

        // 🕒 Build datetime range (IST)
        const startDateTime = new Date(`${date}T${startTime}.000+05:30`);
        const endDateTime = new Date(`${date}T${endTime}.000+05:30`);

        // 🔍 Validate device
        const device = await CoustmerDevice.findOne(
            { "devicesOwened.deviceNo": deviceNo },
            { "devicesOwened.$": 1 }
        );

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Device not found"
            });
        }

        const imei = device.devicesOwened[0].deviceNo;

        // 📍 Fetch route history (include sos status)
        const points = await RoutePlayback.find({
            imei,
            timestamp: {
                $gte: startDateTime,
                $lte: endDateTime
            }
        })
            .sort({ timestamp: 1 })
            .select("latitude longitude timestamp raw.sosStatus");

        if (!points || points.length === 0) {
            return res.status(200).json({
                success: true,
                totalSOSEvents: 0,
                sosSessions: []
            });
        }

        // ================= SOS SESSION LOGIC =================
        const sosSessions = [];
        let sosActive = false;
        let sosStart = null;

        for (let i = 0; i < points.length; i++) {
            const curr = points[i];
            const sosStatus = curr.raw?.sosStatus;

            // 🚨 SOS START (0 → 1)
            if (!sosActive && sosStatus === "1") {
                sosActive = true;
                sosStart = {
                    startTime: curr.timestamp,
                    startLocation: {
                        latitude: curr.latitude,
                        longitude: curr.longitude
                    }
                };
            }

            // ✅ SOS END (1 → 0)
            if (sosActive && sosStatus !== "1") {
                sosSessions.push({
                    startTime: sosStart.startTime,
                    startLocation: sosStart.startLocation,
                    endTime: curr.timestamp,
                    endLocation: {
                        latitude: curr.latitude,
                        longitude: curr.longitude
                    }
                });

                sosActive = false;
                sosStart = null;
            }
        }

        // 🕒 If SOS still active till last point
        if (sosActive && sosStart) {
            const lastPoint = points[points.length - 1];
            sosSessions.push({
                startTime: sosStart.startTime,
                startLocation: sosStart.startLocation,
                endTime: lastPoint.timestamp,
                endLocation: {
                    latitude: lastPoint.latitude,
                    longitude: lastPoint.longitude
                }
            });
        }

        // ================= RESPONSE =================
        return res.status(200).json({
            success: true,
            deviceNo,
            imei,
            reportDate: date,
            reportPeriod: {
                startTime: startDateTime,
                endTime: endDateTime
            },
            totalSOSEvents: sosSessions.length,
            sosSessions
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server Error in fetchSOSReport"
        });
    }
};




//😎😎🚀🚀😎😎 Work on Wallet System Logic Controller
exports.addWalletBalance = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const { amount, reason, manufacturerId, distributorId, oemId, distributorDealerId, oemDealerId } = req.body;


        if (!amount || !reason) {
            return res.status(400).json({
                success: false,
                message: "amount and reason are required"
            });
        }

        // Here I have to find the manufacturer and distributorId and oemId from the userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        if (user?.role === "manufacturer") {
            // Here add main logic
            const manufacur = await ManuFactur.findById(user?.manufacturId);

            if (!manufacur) {
                return res.status(404).json({
                    success: false,
                    message: "Manufacturer not found"
                });
            }


            manufacur.wallet.balance += amount;

            await manufacur.save();

            // Here add wallet transaction logic
            const walletTransaction = new WalletTransaction({
                manufacturerId: manufacur._id,
                type: "CREDIT",
                amount,
                balanceAfter: manufacur.wallet.balance,
                reason
            });
            await walletTransaction.save();

        }
        else if (user?.role === "distibutor") {
            // Add main Logic
            const distributor = await Distributor.findById(user?.distributorId);

            if (!distributor) {
                return res.status(404).json({
                    success: false,
                    message: "Distributor not found"
                });
            }

            distributor.wallet.balance += amount;
            await distributor.save();

            // Here add wallet transaction logic
            const walletTransaction = new WalletTransaction({
                distributorId: distributor._id,
                type: "CREDIT",
                amount,
                balanceAfter: distributor.wallet.balance,
                reason,
            });
            await walletTransaction.save();
        } else if (user?.role === "oem") {
            // Add main Logic
            const oem = await OemModelSchema.findById(user?.oemId);

            if (!oem) {
                return res.status(404).json({
                    success: false,
                    message: "OEM not found"
                });
            }


            oem.wallet.balance += amount;
            await oem.save();

            // Here add wallet transaction logic
            const walletTransaction = new WalletTransaction({
                oemId: oem._id,
                type: "CREDIT",
                amount,
                balanceAfter: oem.wallet.balance,
                reason,
            });
            await walletTransaction.save();
        } else if (user?.role === "dealer-distributor") {
            const dealerDistributor = await CreateDelerUnderDistributor.findById(user?.distributorDelerId);
            if (!dealerDistributor) {
                return res.status(404).json({
                    success: false,
                    message: "Dealer-Distributor not found"
                });
            }

            dealerDistributor.wallet.balance += amount;
            await dealerDistributor.save();
            // Here add wallet transaction logic
            const walletTransaction = new WalletTransaction({
                distributorDealerId: dealerDistributor._id,
                type: "CREDIT",
                amount,
                balanceAfter: dealerDistributor.wallet.balance,
                reason,
            });

            await walletTransaction.save();
        } else {
            const dealerOem = await CreateDelerUnderOems.findById(user?.dealerOemId);
            if (!dealerOem) {
                return res.status(404).json({
                    success: false,
                    message: "Dealer-OEM not found"
                });
            }

            dealerOem.wallet.balance += amount;
            await dealerOem.save();
            // Here add wallet transaction logic
            const walletTransaction = new WalletTransaction({
                oemDealerId: dealerOem._id,
                type: "CREDIT",
                amount,
                balanceAfter: dealerOem.wallet.balance,
                reason,
            });
            await walletTransaction.save();

        }


        return res.status(200).json({
            success: true,
            message: "Wallet balance added successfully",
        });

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in addWalletBalance"
        })
    }
}

//fetch wallet balance api will pending
exports.fetchWalletBalance = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // Here I have to find the manufacturer and distributorId and oemId from the userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        if (user?.role === "manufacturer") {
            const manufacur = await ManuFactur.findById(user?.manufacturId);

            if (!manufacur) {
                return res.status(404).json({
                    success: false,
                    message: "Manufacturer not found"
                });
            }
            return res.status(200).json({
                success: true,
                message: "Wallet balance fetched successfully",
                balance: manufacur.wallet.balance,
            });

        } else if (user?.role === "distibutor") {
            const distributor = await Distributor.findById(user?.distributorId);
            if (!distributor) {
                return res.status(404).json({
                    success: false,
                    message: "Distributor not found"
                });
            }
            return res.status(200).json({
                success: true,
                message: "Wallet balance fetched successfully",
                balance: distributor.wallet.balance,
            });
        } else if (user?.role === "oem") {
            const oem = await OemModelSchema.findById(user?.oemId);

            if (!oem) {
                return res.status(404).json({
                    success: false,
                    message: "OEM not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Wallet balance fetched successfully",
                balance: oem.wallet.balance,
            });
        } else if (user?.role === "dealer-distributor") {
            const dealerDistributor = await CreateDelerUnderDistributor.findById(user?.distributorDelerId);
            if (!dealerDistributor) {
                return res.status(404).json({
                    success: false,
                    message: "Dealer-Distributor not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Wallet balance fetched successfully",
                balance: dealerDistributor.wallet.balance,
            });
        }
        // some pending work is there
        // else if (user?.role === "dealer-oem") {
        //     const dealerOem = await CreateDelerUnderOems.findById(user?.dealerOemId);
        //     if (!dealerOem) {
        //         return res.status(404).json({
        //             success: false,
        //             message: "Dealer-OEM not found"
        //         });
        //     }

        //     return res.status(200).json({
        //         success: true,
        //         message: "Wallet balance fetched successfully",
        //         balance: dealerOem.wallet.balance,
        //     });
        // }

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in fetchWalletBalance"
        })
    }
}


exports.fetchManufacturPaymentHistory = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (user?.role !== "manufacturer") {
            return res.status(403).json({
                success: false,
                message: "Forbidden: Access is allowed only for manufacturers"
            });
        }

        const manufacur = await ManuFactur.findById(user?.manufacturId);

        if (!manufacur) {
            return res.status(404).json({
                success: false,
                message: "Manufacturer not found"
            });
        }

        const transactions = await WalletTransaction
            .find({ manufacturerId: manufacur._id })
            .select("reason type amount balanceAfter createdAt -_id")
            .sort({ createdAt: -1 })
            .lean();


        if (!transactions || transactions.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No transactions found",
                transactions: [],
            });
        }

        return res.status(200).json({
            success: true,
            message: "Payment history fetched successfully",
            transactions,
        });

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in fetchPaymentHistory"
        })
    }
}


exports.fetchDistributorPaymentHistory = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        };

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (user?.role !== "distibutor") {
            return res.status(403).json({
                success: false,
                message: "Forbidden: Access is allowed only for distributors"
            });
        }

        const distributor = await Distributor.findById(user?.distributorId);

        if (!distributor) {
            return res.status(404).json({
                success: false,
                message: "Distributor not found"
            });
        }

        const transactions = await WalletTransaction
            .find({ distributorId: distributor._id })
            .select("reason type amount balanceAfter createdAt -_id")
            .sort({ createdAt: -1 })
            .lean();

        if (!transactions || transactions.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No transactions found",
                transactions: [],
            });
        }

        return res.status(200).json({
            success: true,
            message: "Payment history fetched successfully",
            transactions,
        });

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in fetchDistributorPaymentHistory"
        })
    }
}


exports.fetchOemPaymentHistory = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: "please Provide UserId",
            })
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (user?.role !== "oem") {
            return res.status(403).json({
                success: false,
                message: "Forbidden: Access is allowed only for oem"
            })
        }

        const oem = await CreateOemModel.findById()

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in fetchOemPaymentHistory"
        })
    }
}