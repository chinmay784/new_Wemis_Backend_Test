const { cloudinary } = require("../config/cloudinary");
const ManuFactur = require("../models/ManuFacturModel");
const User = require("../models/UserModel");
const Wlp = require("../models/WlpModel");
const CreateElement = require("../models/CreateElement");


exports.fetchWlpName = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({
                sucess: false,
                message: "User not authorized",
            })
        }

        // find in user collection
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                sucess: false,
                message: "User not found",
            })
        }

        // Find in Wlp collection
        const wlp = await Wlp.findOne({ _id: user.wlpId });
        if (!wlp) {
            return res.status(404).json({
                sucess: false,
                message: "WLP not found",
            })
        }


        return res.status(200).json({
            sucess: true,
            message: "WLP name fetched successfully",
            wlpName: wlp.organizationName,
        });

    } catch (error) {
        console.log(error, error.message);
        res.status(500).json({
            sucess: false,
            message: "Failed to fetch WLP name",
        });
    }
}



exports.createManuFactur = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({
                sucess: false,
                message: "User not authorized",
            })
        }

        const { country, city, manufactur_code, business_Name, gst_Number, Parent_WLP, manufacturer_Name, mobile_Number, email, toll_Free_Number, website, address, logo } = req.body;

        if (!country || !city || !manufactur_code || !business_Name || !gst_Number || !Parent_WLP || !manufacturer_Name || !mobile_Number || !email || !toll_Free_Number || !website || !address) {
            return res.status(400).json({
                sucess: false,
                message: "All fields are required",
            })
        }

        const existingManuFactur = await ManuFactur.findOne({ email: email });

        if (existingManuFactur) {
            return res.status(409).json({
                sucess: false,
                message: "ManuFactur with this code already exists",
            })
        }


        // Ensure all files are uploaded
        const requiredFiles = ['logo'];
        // for (let field of requiredFiles) {
        //     if (!req.files[field] || req.files[field].length === 0) {
        //         return res.status(400).json({
        //             message: `${field} file is required`,
        //             success: false
        //         });
        //     }
        // };

        let gstCertUrl = null;

        if (req.files['logo']) {
            const file = req.files['logo'][0];
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "profile_pics",
                resource_type: "raw"
            });
            gstCertUrl = result.secure_url;
        };



        const newManuFactur = new ManuFactur({
            wlpId: userId,
            country,
            city,
            manufactur_code,
            business_Name,
            gst_Number,
            Parent_WLP,
            manufacturer_Name,
            mobile_Number,
            email,
            toll_Free_Number,
            website,
            address,
            logo: gstCertUrl,
        });

        // Save email & password to user collection
        const mnfSaveInUser = new User({
            manufacturId: newManuFactur._id,
            email: email,
            password: mobile_Number, // Assuming mobileNumber is used as a password here, which is
            role: 'manufacturer',
        })

        await mnfSaveInUser.save();

        await newManuFactur.save();

        res.status(201).json({
            sucess: true,
            message: "ManuFactur created successfully",
            data: newManuFactur
        })


    } catch (error) {
        console.log(error, error.message);
        res.status(500).json({
            sucess: false,
            message: "ManuFactur creation failed",
        })
    }
};



exports.fetchManuFactur = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({
                sucess: false,
                message: "User not authorized",
            })
        }


        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                sucess: false,
                message: "User not found",
            })
        }

        const manufactur = await ManuFactur.find({ wlpId: userId });

        if (!manufactur) {
            return res.status(404).json({
                sucess: false,
                message: "ManuFactur not found",
            })
        }



        return res.status(200).json({
            sucess: true,
            message: "ManuFactur fetched successfully",
            manufactur,
        })

    } catch (error) {
        console.log(error, error.message);
        res.status(500).json({
            sucess: false,
            message: "Failed to fetch ManuFactur",
        })
    }
};



exports.deleteManuFactur = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({
                sucess: false,
                message: "User not authorized",
            })
        }

        const { manufacturId } = req.body;

        if (!manufacturId) {

            return res.status(400).json({
                sucess: false,
                message: "manufacturId is required",
            })
        }

        const manufactur = await ManuFactur.findOneAndDelete({ _id: manufacturId });

        // Also delete from user collection
        await User.findOneAndDelete({ manufacturId: manufacturId });

        if (!manufactur) {
            return res.status(404).json({
                sucess: false,
                message: "ManuFactur not found",
            })
        }

        return res.status(200).json({
            sucess: true,
            message: "ManuFactur deleted successfully",
        })


    } catch (error) {
        console.log(error, error.message);
        res.status(500).json({
            sucess: false,
            message: "Failed to delete ManuFactur",
        })
    }
}


exports.findManuFacturById = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({
                sucess: false,
                message: "User not authorized",
            })
        }


        const { manufacturId } = req.body;

        if (!manufacturId) {
            return res.status(400).json({
                sucess: false,
                message: "manufacturId is required",
            })
        }
        const manufactur = await ManuFactur.findById(manufacturId);
        if (!manufactur) {
            return res.status(404).json({
                sucess: false,
                message: "ManuFactur not found",
            })
        }
        return res.status(200).json({
            sucess: true,
            message: "ManuFactur fetched successfully",
            manufactur,
        })

    } catch (error) {
        console.log(error, error.message);
        res.status(500).json({
            sucess: false,
            message: "Failed to fetch ManuFactur by ID",
        })
    }
}



exports.editManuFactur = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({
                sucess: false,
                message: "User not authorized",
            })
        }

        const { manufacturId, country, city, manufactur_code, business_Name, gst_Number, Parent_WLP, manufacturer_Name, mobile_Number, email, toll_Free_Number, website, address } = req.body;


        const manufactur = await ManuFactur.findById(manufacturId);

        if (!manufactur) {
            return res.status(404).json({
                sucess: false,
                message: "ManuFactur not found",
            })
        }

        if (manufactur.country) manufactur.country = country;
        if (manufactur.city) manufactur.city = city;
        if (manufactur.manufactur_code) manufactur.manufactur_code = manufactur_code;
        if (manufactur.business_Name) manufactur.business_Name = business_Name;
        if (manufactur.gst_Number) manufactur.gst_Number = gst_Number;
        // if (manufactur.Parent_WLP) manufactur.Parent_WLP = Parent_WLP;
        if (manufactur.manufacturer_Name) manufactur.manufacturer_Name = manufacturer_Name;
        if (manufactur.mobile_Number) manufactur.mobile_Number = mobile_Number;
        if (manufactur.email) manufactur.email = email;
        if (manufactur.toll_Free_Number) manufactur.toll_Free_Number = toll_Free_Number;
        if (manufactur.website) manufactur.website = website;
        if (manufactur.address) manufactur.address = address;
        // Handle logo upload if a new file is provided
        if (req.files && req.files['logo'] && req.files['logo'].length > 0) {
            const file = req.files['logo'][0];
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "profile_pics",
                resource_type: "raw"
            });
            manufactur.logo = result.secure_url;
        }

        await manufactur.save();
        return res.status(200).json({
            sucess: true,
            message: "ManuFactur edited successfully",
            manufactur,
        })


    } catch (error) {
        console.log(error, error.message);
        res.status(500).json({
            sucess: false,
            message: "Failed to edit ManuFactur",
        })
    }
}



exports.findElements = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authorized",
            });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Find WLP by user.wlpId
        const wlp = await Wlp.findOne({ _id: user.wlpId });
        if (!wlp) {
            return res.status(404).json({
                success: false,
                message: "WLP not found",
            });
        }

        // Extract all element names
        const names = wlp.assign_element_list.map(el => el.elementName);

        // Find VLTD true elements
        const vltd = await CreateElement.find({
            elementName: { $in: names }
        }).select("elementName is_Vltd");

        // Merge results: every assigned element gets its status
        const merged = names.map(name => {
            const found = vltd.find(v => v.elementName === name);
            return {
                elementName: name,
                is_Vltd: found ? found.is_Vltd : false
            };
        });

        return res.status(200).json({
            success: true,
            message: "Elements found successfully",
            elements: merged
        });

    } catch (error) {
        console.log(error, error.message);
        res.status(500).json({
            success: false,
            message: "Failed to findElements",
        });
    }
};




exports.AssignElements = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authorized",
            });
        }

        const { elementNameId, manufacturId } = req.body;

        if (!elementNameId) {
            return res.status(400).json({
                success: false,
                message: "elementNameId  are required",
            });
        }

        if (!manufacturId || !Array.isArray(manufacturId) || manufacturId.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid manufacturId array"
            });
        }

        // get element from wlp
        const elementId = await Wlp.findOne({ "assign_element_list._id": elementNameId });

        if (!elementId) {
            return res.status(404).json({
                success: false,
                message: "Element not found in WLP",
            });
        }

        const result = elementId.assign_element_list.id(elementNameId);

        if
            (!result) {

            return res.status(404).json({
                success: false,
                message: "Element not found",
            });
        }

        // Loop through each manufacturId id
        const updateManufactur = [];
        for (const id of manufacturId) {
            const manufactur = await ManuFactur.findById(id);
            if (!manufactur) {
                return res.status(404).json({
                    success: false,
                    message: `ManuFactur with ID ${id} not found`,
                });
            }
            // Check if element already exists to avoid duplicates
            const alreadyAssigned = manufactur.assign_element_list.some(el => el.elementName === result.elementName);
            if (!alreadyAssigned) {
                manufactur.assign_element_list.push({
                    elementName: result.elementName,
                    elementType: result.elementType,
                    sim:result.sim,
                    model_No: result.model_No,
                    device_Part_No: result.device_Part_No,
                    tac_No: result.tac_No,
                    cop_No: result.cop_No,
                    voltage: result.voltage,
                    copValidity: result.copValidity,
                    wlpId: userId,
                });
                await manufactur.save();
                updateManufactur.push(manufactur);
            }
        }


        if (updateManufactur.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No manufactur were updated (either not found or element already assigned)"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Element assigned to manufactur(s) successfully",
        });


    } catch (error) {
        console.log(error, error.message);
        res.status(500).json({
            success: false,
            message: "Failed to assign elements",
        });
    }
}



exports.fetchAllDataRelatedtoAssignElements = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authorized",
            });
        }


        const findwlp = await User.findById(userId);
        if (!findwlp || findwlp.role !== "wlp") {
            return res.status(404).json({
                success: false,
                message: "wlp user not found"
            });
        }


        const wlpDetails = await Wlp.findById(findwlp.wlpId);
        if (!wlpDetails) {
            return res.status(404).json({
                success: false,
                message: "wlp details not found"
            });
        }

        // find manufactur by wlp
        const manufactur = await ManuFactur.find({ wlpId: userId });

        return res.status(200).json({
            success: true,
            adminElementList: wlpDetails.assign_element_list,
            manufactur
        });


    } catch (error) {
        console.log(error, error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch all data related to assign elements",
        });
    }
}



exports.fetchAssignElement = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authorized",
            });
        }

        const manufactur = await ManuFactur.find({ "assign_element_list.wlpId": userId })

        if (!manufactur) {
            return res.status(404).json({
                success: false,
                message: "No manufactur found for this WLP",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Assign elements fetched successfully",
            manufactur,
        });

    } catch (error) {
        console.log(error, error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch assign elements",
        });
    }
}



exports.fetchDashBoardData = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authorized",
            });
        }

        // find total manufactur
        const totalManufactur = await ManuFactur.find({ wlpId: userId })

        if (!totalManufactur) {
            return res.status(404).json({
                success: false,
                message: "No manufactur found for this WLP",
            });
        }

        return res.status(200).json({
            success: true,
            message: "DashBoard data fetched successfully",
            Manufactur: totalManufactur,
            totalManufactur: totalManufactur.length,
        });




    } catch (error) {
        console.log(error, error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard data",
        });
    }
}