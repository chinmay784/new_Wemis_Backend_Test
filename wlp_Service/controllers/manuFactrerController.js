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
const { cloudinary } = require("../config/cloudinary")



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
            role: "deler",
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
            role: "deler",
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
        const userId = req.user.userId; // make sure req.user exists

        if (!userId) {
            return res.status(401).json({ // 🔥 Use 401 instead of 200
                success: false,
                message: "Unauthorized: Please Provide UserId"
            });
        }

        const elementData = await User.findById(userId);

        if (!elementData) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // find all barcodes for that manufacturId
        const manuF = await createBarCode.find({ manufacturId: userId});

        if (!manuF || manuF.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Data Found in ManuFactur Collections"
            });
        }

        // collect all barcodes from all docs
        const allBarcodes = manuF.flatMap(doc => doc.barCodeNo);

        return res.status(200).json({
            success: true,
            message: "Element Data Fetched Successfully",
            elementData: allBarcodes,
        });

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error while fetching element data"
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

            // // ✅ Correctly push barcodes from req.body
            // dist.allocateBarcodes.push(...barcodes);

            // await dist.save();

            // // also create AllocateBarcode
            // const allocated = await AllocateBarCode.create({
            //     country,
            //     state,
            //     checkBoxValue,
            //     // distributor,
            //     // oem,
            //     // deler,
            //     status: "used",
            //     element,
            //     elementType,
            //     modelNo,
            //     Voltege,
            //     partNo,
            //     type,
            //     allocatedBarCode: barcodes,
            //     manufacturAllocateId: userId,
            //     allocatedDistributorId: distributor,
            //     allocatedOemId: null,
            //     allocatedDelerId: deler
            // })


            // // Optional: Remove allocated barcodes from the 'available' list (e.g., in a Barcode model)
            // // await createBarCode.updateMany(
            // //     { barCodeNo: { $in: barcodes } },
            // //     { $set: { status: 'ALLOCATED', distributorId: distributor } } // Example
            // // );

            // return res.status(200).json({
            //     success: true,
            //     message: "Barcodes allocated successfully to Distributor",
            //     data: dist
            // });




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


            console.log(deler)
            // find deler name 
            const delername = await CreateDelerUnderDistributor.findById(deler);

            // ✅ Ensure the array exists
            if (!Array.isArray(delername.allocateBarcodes)) {
                delername.allocateBarcodes = [];
            }

            // ✅ Push all barcode objects
            delername.allocateBarcodes.push(...formattedBarcodes);

            await delername.save()


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
                allocatedDelerId: deler,
                delerName: delername.name
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
        // else if (checkBoxValue === "OEM") {
        //     if (!oem) {
        //         return res.status(200).json({
        //             success: false,
        //             message: "Please Provide OEM ID"
        //         });
        //     }

        //     // Note: Assuming OemModelSchema is imported as OemModelSchema
        //     const OeM = await OemModelSchema.findById(oem);

        //     if (!OeM) {
        //         return res.status(404).json({
        //             success: false,
        //             message: "OEM not found",
        //         });
        //     }

        //     // 🛑 CRITICAL FIX: Use 'barcodes' from req.body, DO NOT fetch from another model
        //     // Original incorrect logic removed: 
        //     // const elementName = await createBarCode.findOne({ elementName: element });
        //     // const barcodes = elementName ? elementName.barCodeNo : [];

        //     console.log(`Allocating ${barcodes.length} Barcodes to OEM:`, oem);

        //     // ✅ Correctly push barcodes from req.body
        //     OeM.allocateBarcodes.push(...barcodes);

        //     await OeM.save();


        //     const allocated = await AllocateBarCode.create({
        //         country,
        //         state,
        //         checkBoxValue,
        //         status: "used",
        //         element,
        //         elementType,
        //         modelNo,
        //         Voltege,
        //         partNo,
        //         type,
        //         allocatedBarCode: barcodes,
        //         manufacturAllocateId: userId,
        //         allocatedDistributorId: null,
        //         allocatedOemId: oem,
        //         allocatedDelerId: deler,
        //     })

        //     // Optional: Remove allocated barcodes from the 'available' list (e.g., in a Barcode model)
        //     // await createBarCode.updateMany(
        //     //     { barCodeNo: { $in: barcodes } },
        //     //     { $set: { status: 'ALLOCATED', oemId: oem } } // Example
        //     // );

        //     return res.status(200).json({
        //         success: true,
        //         message: "Barcodes allocated successfully to OEM",
        //         data: OeM
        //     });


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

            console.log(deler)
            // find deler name 
            const delername = await CreateDelerUnderOems.findById(deler);

            // ✅ Ensure the array exists
            if (!Array.isArray(delername.allocateBarcodes)) {
                delername.allocateBarcodes = [];
            }

            // ✅ Push the full barcode objects
            delername.allocateBarcodes.push(...formattedBarcodes)

            await delername.save();

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
                allocatedDelerId: deler,
                delerName: delername.name
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

        const { packageType, packageName, billingCycle, price, description, renewal } = req.body;

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

        const newSubscription = new createSubscription({
            manuFacturId: userId,
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
        const allSubscription = await createSubscription.find({ manuFacturId: userId });

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



// Here Implement manufactur Map A device
// exports.manuFacturMAPaDevice = async (req, res) => {
//     try {
//         const userId = req.user.userId;

//         if (!userId) {
//             return res.status(200).json({
//                 sucess: false,
//                 message: "Please Provide UserId"
//             })
//         }

//         // ✅ Extract all fields from req.body
//         const {
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
//             VechileIDocument,
//             RcDocument,
//             DeviceDocument,
//             PanCardDocument,
//             AdharCardDocument,
//             InvoiceDocument,
//             SignatureDocument,
//             PanicButtonWithSticker
//         } = req.body;


//         // ✅ Check if deviceNo already exists
//         const existingDevice = await MapDevice.findOne({ deviceNo });
//         if (existingDevice) {
//             return res.status(409).json({
//                 success: false,
//                 message: `Device with deviceNo "${deviceNo}" already exists.`,
//             });
//         };



//         // Ensure all files are uploaded
//         const requiredFiles = ['Vechile_Doc', 'Rc_Doc', 'Pan_Card', 'Device_Doc', 'Adhar_Card', 'Invious_Doc', 'Signature_Doc', 'Panic_Sticker'];
//         for (let field of requiredFiles) {
//             if (!req.files[field] || req.files[field].length === 0) {
//                 return res.status(400).json({
//                     message: `${field} file is required`,
//                     success: false
//                 });
//             }
//         }



//         // ✅ Upload files separately
//         let vc = null;
//         let Rc = null;
//         let Pc = null;
//         let Dc = null;
//         let Ac = null;
//         let Ic = null;
//         let Sc = null;
//         let Ps = null;




//         if (req.files['Vechile_Doc']) {
//             const file = req.files['Vechile_Doc'][0];
//             const result = await cloudinary.uploader.upload(file.path, {
//                 folder: "profile_pics",
//                 resource_type: "raw" // keeps PDF as raw
//             });
//             vc = result.secure_url;
//         }

//         if (req.files['Rc_Doc']) {
//             const file = req.files['Rc_Doc'][0];
//             const result = await cloudinary.uploader.upload(file.path, {
//                 folder: "profile_pics",
//                 resource_type: "raw"
//             });
//             Rc = result.secure_url;
//         }

//         if (req.files['Pan_Card']) {
//             const file = req.files['Pan_Card'][0];
//             const result = await cloudinary.uploader.upload(file.path, {
//                 folder: "profile_pics",
//                 resource_type: "raw"
//             });
//             Pc = result.secure_url;
//         }

//         if (req.files['Device_Doc']) {
//             const file = req.files['Device_Doc'][0];
//             const result = await cloudinary.uploader.upload(file.path, {
//                 folder: "profile_pics",
//                 resource_type: "raw"
//             });
//             Dc = result.secure_url;
//         }

//         if (req.files['Adhar_Card']) {
//             const file = req.files['Adhar_Card'][0];
//             const result = await cloudinary.uploader.upload(file.path, {
//                 folder: "profile_pics",
//                 resource_type: "raw"
//             });
//             Ac = result.secure_url;
//         }

//         if (req.files['Invious_Doc']) {
//             const file = req.files['Invious_Doc'][0];
//             const result = await cloudinary.uploader.upload(file.path, {
//                 folder: "profile_pics",
//                 resource_type: "raw"
//             });
//             Ic = result.secure_url;
//         }

//         if (req.files['Signature_Doc']) {
//             const file = req.files['Signature_Doc'][0];
//             const result = await cloudinary.uploader.upload(file.path, {
//                 folder: "profile_pics",
//                 resource_type: "raw"
//             });
//             Sc = result.secure_url;
//         }

//         if (req.files['Panic_Sticker']) {
//             const file = req.files['Panic_Sticker'][0];
//             const result = await cloudinary.uploader.upload(file.path, {
//                 folder: "profile_pics",
//                 resource_type: "raw"
//             });
//             Ps = result.secure_url;
//         }



//         // Then save in dataBase
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
//             PanicButtonWithSticker: Ps
//         })


//         await newMapDevice.save();

//         return res.status(200).json({
//             success: true,
//             message: "New Device Mapped Successfully",
//         });

//     } catch (error) {
//         console.log(error, error.message);
//         return res.status(500).json({
//             sucess: false,
//             message: "Server Error in manuFactur_Map_A_device"
//         })
//     }
// }

// No Implement Packages in this Controller
exports.manuFacturMAPaDevice = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Please provide userId",
            });
        }

        // ✅ Extract fields
        let {
            country,
            state,
            distributorName,
            delerName,
            deviceType,
            deviceNo,
            voltage,
            elementType,
            batchNo,
            simDetails,
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
            PanNo,
            Packages,
            InvoiceNo,
            VehicleKMReading,
            DriverLicenseNo,
            MappedDate,
            NoOfPanicButtons,
        } = req.body;

        console.log("Before SON.parse")

        if (typeof simDetails === "string") {
            simDetails = JSON.parse(simDetails);
        }

        console.log("After SON.parse")


       

        // ✅ Check if deviceNo already exists
        const existingDevice = await MapDevice.findOne({ deviceNo });
        if (existingDevice) {
            return res.status(409).json({
                success: false,
                message: `Device with deviceNo "${deviceNo}" already exists.`,
            });
        }

        // ✅ Ensure required files are uploaded
        const requiredFiles = [
            "Vechile_Doc",
            "Rc_Doc",
            "Pan_Card",
            "Device_Doc",
            "Adhar_Card",
            "Invious_Doc",
            "Signature_Doc",
            "Panic_Sticker",
        ];

        for (let field of requiredFiles) {
            if (!req.files?.[field] || req.files[field].length === 0) {
                return res.status(400).json({
                    success: false,
                    message: `${field} file is required`,
                });
            }
        }

        // ✅ Upload all files to Cloudinary
        const uploadToCloudinary = async (fieldName) => {
            const file = req.files[fieldName][0];
            const uploaded = await cloudinary.uploader.upload(file.path, {
                folder: "map_device_docs",
                resource_type: "raw", // to support PDFs or other formats
            });
            return uploaded.secure_url;
        };

        const [
            vc,
            Rc,
            Pc,
            Dc,
            Ac,
            Ic,
            Sc,
            Ps
        ] = await Promise.all([
            uploadToCloudinary("Vechile_Doc"),
            uploadToCloudinary("Rc_Doc"),
            uploadToCloudinary("Pan_Card"),
            uploadToCloudinary("Device_Doc"),
            uploadToCloudinary("Adhar_Card"),
            uploadToCloudinary("Invious_Doc"),
            uploadToCloudinary("Signature_Doc"),
            uploadToCloudinary("Panic_Sticker"),
        ]);

        // let pack = {
        //     packageId: Packages._id,
        //     packageName: Packages.packageName,
        //     packageType: Packages.packageType,
        //     billingCycle: Packages.billingCycle,
        //     price: Packages.price
        // };

        // ✅ Create a new MapDevice document
        const newMapDevice = new MapDevice({
            manufacturId: userId,
            country,
            state,
            distributorName,
            delerName,
            deviceType,
            deviceNo,
            voltage,
            elementType,
            batchNo,
            simDetails,
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
            PanNo,
            Packages,
            InvoiceNo,
            VehicleKMReading,
            DriverLicenseNo,
            MappedDate,
            NoOfPanicButtons,
            VechileIDocument: vc,
            RcDocument: Rc,
            DeviceDocument: Dc,
            PanCardDocument: Pc,
            AdharCardDocument: Ac,
            InvoiceDocument: Ic,
            SignatureDocument: Sc,
            PanicButtonWithSticker: Ps,
        });

        await newMapDevice.save();

        return res.status(200).json({
            success: true,
            message: "Device mapped successfully",
            data: newMapDevice,
        });
    } catch (error) {
        console.error("Error in manuFacturMAPaDevice:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while mapping device",
            error: error.message,
        });
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


exports




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