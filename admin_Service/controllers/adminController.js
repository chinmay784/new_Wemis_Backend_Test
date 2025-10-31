const Wlp = require("../models/WlpModel");
const User = require("../models/UserModel");
const { cloudinary } = require("../config/cloudinary");
const Admin = require("../models/AdminModel");
const CreateElement = require("../models/CreateElement");


exports.createWlp = async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({
                sucess: false,
                message: "Unauthorized User"
            })
        }

        const { country, state, defaultLanguage, organizationName, mobileNumber, salesMobileNumber, landLineNumber, email, appPackage, showPoweredBy, accountLimit, smsGatewayUrl, smsGatewayMethod, gstinNumber, billingEmail, websiteUrl, logo, address } = req.body;

        if (!country || !state || !defaultLanguage || !organizationName || !mobileNumber || !salesMobileNumber || !landLineNumber || !email || !appPackage || !showPoweredBy || !accountLimit || !smsGatewayUrl || !smsGatewayMethod || !gstinNumber || !billingEmail || !websiteUrl || !address) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide All Details"
            })
        };


        // Ensure all files are uploaded
        const requiredFiles = ['logo'];
        for (let field of requiredFiles) {
            if (!req.files[field] || req.files[field].length === 0) {
                return res.status(400).json({
                    message: `${field} file is required`,
                    success: false
                });
            }
        };

        let gstCertUrl = null;

        if (req.files['logo']) {
            const file = req.files['logo'][0];
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "profile_pics",
                resource_type: "raw"
            });
            gstCertUrl = result.secure_url;
        };


        // Create wlp document in DB
        const wlp = new Wlp({
            adminId: userId,
            country,
            state,
            defaultLanguage,
            organizationName,
            mobileNumber,
            salesMobileNumber,
            landLineNumber,
            email,
            appPackage,
            showPoweredBy,
            accountLimit,
            smsGatewayUrl,
            smsGatewayMethod,
            gstinNumber,
            billingEmail,
            websiteUrl,
            logo: gstCertUrl,
            address
        });


        // save email and password in userCollenction
        const wlpSaveInUser = new User({
            wlpId: wlp._id,
            email: email,
            password: mobileNumber, // Assuming mobileNumber is used as a password here, which is
            role: 'wlp',
        });

        await wlpSaveInUser.save();
        await wlp.save();

        return res.status(201).json({
            sucess: true,
            message: "WLP Created Successfully",
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in creating WLP"
        })
    }
};


exports.getAllWlp = async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({
                sucess: false,
                message: "Unauthorized User"
            })
        }

        const wlp = await Wlp.find({ adminId: userId });

        if (!wlp) {
            return res.status(200).json({
                sucess: false,
                message: "No WLP found"
            })
        }

        return res.status(200).json({
            sucess: true,
            message: "WLP fetched successfully",
            wlps: wlp
        });

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server error in GetAllWlp"
        })
    }
};


exports.deleteWlp = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Unauthorized User"
            })
        }

        const { wlpId } = req.body;

        if (!wlpId) {
            return res.status(200).json({
                sucess: false,
                message: "Please provide wlpId"
            })
        }

        // Delete WLP By ID
        const wlp = await Wlp.findByIdAndDelete(wlpId);

        if (!wlp) {
            return res.status(200).json({
                sucess: false,
                message: "No WLP found"
            })
        }

        // Delete User associated with the WLP
        const userWlpdelet = await User.findOneAndDelete({ wlpId: wlpId });

        if (!userWlpdelet) {
            return res.status(200).json({
                sucess: false,
                message: "No User found for the given WLP"
            })
        }

        return res.status(200).json({
            sucess: true,
            message: "WLP deleted successfully",
        });


    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server error in deleteWlp"
        })
    }
};



exports.getWlpById = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Unauthorized User"
            })
        }

        const { wlpId } = req.body;

        if (!wlpId) {
            return res.status(200).json({
                sucess: false,
                message: "Please provide wlpId"
            })
        }

        const wlp = await Wlp.findById(wlpId);

        if (!wlp) {
            return res.status(200).json({
                sucess: false,
                message: "No WLP found"
            })
        }

        return res.status(200).json({
            sucess: true,
            message: "WLP fetched successfully",
            wlp
        });


    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server error in getWlpById"
        })
    }
}




exports.editWlp = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: "Unauthorized User"
            });
        }

        const { wlpId, country, state, defaultLanguage, organizationName, mobileNumber, salesMobileNumber, landLineNumber, email, appPackage, showPoweredBy, accountLimit, smsGatewayUrl, smsGatewayMethod, gstinNumber, billingEmail, websiteUrl, address } = req.body;

        if (!wlpId) {
            return res.status(200).json({
                success: false,
                message: "Please provide wlpId"
            });
        }

        const wlp = await Wlp.findById(wlpId);

        if (!wlp) {
            return res.status(200).json({
                success: false,
                message: "WLP not found"
            });
        }

        // Update fields if provided
        if (country) wlp.country = country;
        if (state) wlp.state = state;
        if (defaultLanguage) wlp.defaultLanguage = defaultLanguage;
        if (organizationName) wlp.organizationName = organizationName;
        if (mobileNumber) wlp.mobileNumber = mobileNumber;
        if (salesMobileNumber) wlp.salesMobileNumber = salesMobileNumber;
        if (landLineNumber) wlp.landLineNumber = landLineNumber;
        if (email) wlp.email = email;
        if (appPackage) wlp.appPackage = appPackage;
        if (showPoweredBy) wlp.showPoweredBy = showPoweredBy;
        if (accountLimit) wlp.accountLimit = accountLimit;
        if (smsGatewayUrl) wlp.smsGatewayUrl = smsGatewayUrl;
        if (smsGatewayMethod) wlp.smsGatewayMethod = smsGatewayMethod;
        if (gstinNumber) wlp.gstinNumber = gstinNumber;
        if (billingEmail) wlp.billingEmail = billingEmail;
        if (websiteUrl) wlp.websiteUrl = websiteUrl;
        if (address) wlp.address = address;
        // Handle logo upload if a new file is provided
        if (req.files && req.files['logo'] && req.files['logo'].length > 0) {
            const file = req.files['logo'][0];
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "profile_pics",
                resource_type: "raw"
            });
            wlp.logo = result.secure_url;
        }
        await wlp.save();
        return res.status(200).json({
            success: true,
            message: "WLP updated successfully",
            wlp
        });


    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server error in editWlp"
        });
    }
}



exports.fetchAdminElementsList = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized User"
            });
        }

        // Find the user with role "admin"
        const adminUser = await User.findOne({ _id: userId, role: "admin" });
        if (!adminUser) {
            return res.status(404).json({
                success: false,
                message: "No Admin found"
            });
        }

        // Get related Admin document
        const final = adminUser.adminId;
        if (!final) {
            return res.status(404).json({
                success: false,
                message: "This user does not have an admin profile linked"
            });
        }

        const adminDetails = await Admin.findById(final);
        if (!adminDetails) {
            return res.status(404).json({
                success: false,
                message: "Admin details not found"
            });
        }

        // For each assigned element, fetch its details including is_Vltd
        const ress = await Promise.all(
            adminDetails.assign_element_list.map(async (item) => {
                const element = await CreateElement.findOne({ elementName: item.elementName });
                return {
                    ...item.toObject?.() || item,   // keep original fields from assign_element_list
                    is_Vltd: element ? element.is_Vltd : null
                };
            })
        );

        return res.status(200).json({
            success: true,
            message: "Admin elements list fetched successfully",
            elements: ress
        });

    } catch (error) {
        console.error("Error in fetchAdminElementsList:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error in fetchAdminElementsList"
        });
    }
};



exports.adminDashBoard = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized User"
            });
        }

        // Find admin WLP
        const adminWlp = await Wlp.find({ adminId: userId });
        if (!adminWlp || adminWlp.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No WLP found for this admin"
            });
        }

        // Find the admin user
        const element = await User.findOne({ _id: userId, role: "admin" });
        if (!element) {
            return res.status(200).json({
                success: false,
                message: "No Admin found"
            });
        }

        // Find admin details
        const elementData = await Admin.findById(element.adminId);
        if (!elementData) {
            return res.status(200).json({
                success: false,
                message: "No Admin Details found"
            });
        }

        // Fetch elements with createdAt
        const elementsWithCreatedAt = await Promise.all(
            elementData.assign_element_list.map(async (item) => {
                const elementDoc = await CreateElement.findOne({ elementName: item.elementName });
                return {
                    ...item.toObject?.() || item,
                    createdAt: elementDoc ? elementDoc.createdAt : null
                };
            })
        );

        return res.status(200).json({
            success: true,
            message: "Admin WLP fetched successfully",
            wlp: adminWlp,
            wlpCount: adminWlp.length,
            elements: elementsWithCreatedAt,
            elementCount: elementsWithCreatedAt.length
        });

    } catch (error) {
        console.error("Error in adminDashBoard:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error in adminDashBoard"
        });
    }
};




exports.fetchAllDaterelatedToassignAdminElement = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized User"
            });
        }

        const findadmin = await User.findById(userId);
        if (!findadmin || findadmin.role !== "admin") {
            return res.status(404).json({
                success: false,
                message: "Admin user not found"
            });
        }

        const adminDetails = await Admin.findById(findadmin.adminId);
        if (!adminDetails) {
            return res.status(404).json({
                success: false,
                message: "Admin details not found"
            });
        }

        // find wlp by admin
        const wlps = await Wlp.find({ adminId: userId });

        return res.status(200).json({
            success: true,
            adminElementList: adminDetails.assign_element_list,
            wlps
        });

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server error in fetchAllDaterelatedToassignAdminElement"
        });
    }
}




exports.adminAssignElement = async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized User"
            });
        }

        const { elementNameId, wlpId } = req.body;
        if (!elementNameId) {
            return res.status(400).json({
                success: false,
                message: "Please provide elementNameId"
            });
        }

        if (!wlpId || !Array.isArray(wlpId) || wlpId.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid wlpId array"
            });
        }

        // get element from Admin
        const elementId = await Admin.findOne({ "assign_element_list._id": elementNameId });
        if (!elementId) {
            return res.status(404).json({
                success: false,
                message: "Element not found in admin's assigned elements"
            });
        }

        const result = elementId.assign_element_list.id(elementNameId);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Element not found"
            });
        }

        // Loop through each WLP id
        const updatedWlps = [];
        for (const id of wlpId) {
            const wlps = await Wlp.findById(id);
            if (!wlps) continue; // skip if not found

            // Check if element already assigned
            if (wlps.assign_element_list.some(el => el.elementName === result.elementName)) {
                continue; // skip if already assigned
            }

            // Push element
            wlps.assign_element_list.push({
                elementName: result.elementName,
                elementType: result.elementType,
                sim:result.sim,
                model_No: result.model_No,
                device_Part_No: result.device_Part_No,
                tac_No: result.tac_No,
                cop_No: result.cop_No,
                voltage: result.voltage,
                copValidity: result.copValidity,
                adminId: userId
            });

            await wlps.save();
            updatedWlps.push(wlps);
        }

        if (updatedWlps.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No WLPs were updated (either not found or element already assigned)"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Element assigned to WLP(s) successfully",
            // updatedWlps,
            // result,
        });

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server error in adminAssignElement"
        });
    }
};



exports.fetchWlpAssignElementList = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized User"
            });
        }

        // 🔍 Find WLPs where assign_element_list contains this adminId
        const wlps = await Wlp.find({
            "assign_element_list.adminId": userId
        });

        if (!wlps || wlps.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No WLPs found for this admin inside assign_element_list"
            });
        }

        return res.status(200).json({
            success: true,
            message: "WLPs fetched successfully",
            wlps
        });

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server error in fetchWlpAssignElementList"
        });
    }
};


