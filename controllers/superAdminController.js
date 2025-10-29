const User = require("../models/UserModel")
const jwt = require('jsonwebtoken');
const Admin = require("../models/AdminModel");
const { cloudinary } = require("../config/cloudinary");
const BrandModel = require("../models/CreateBrandModel");
const CateGoryModel = require('../models/CreateElementCategory');
const ElementModel = require('../models/CreateElement')
const CheckBoxModel = require("../models/AddElementCheckBox");
const TypeElementModel = require("../models/AddElementTypeModel");
const AddModalNo = require("../models/AddElementModelNo");
const DevicePartNo = require("../models/AddDevicePartModel");
const AddTacNo = require("../models/AddTacModel");
const AddCopNo = require("../models/AddCopModel")



exports.registerSuperAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Name, email, and password are required',
                success: false
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'superAdmin already exists',
                success: false
            });
        }

        // Create new super admin user
        const newUser = new User({
            name,
            email,
            password, // Note: Password should be hashed in a real application
            role: 'superadmin'
        });

        await newUser.save();

        res.status(201).json({
            message: 'Super admin registered successfully',
            success: true,
            user: newUser
        });
    } catch (error) {
        console.error('Error registering super admin:', error);
        res.status(500).json({
            message: `Internal Server Error Or ${error.message}`,
            sucess: false
        });
    }
};



exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required',
                success: false
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({
                message: 'Super admin not found',
                success: false
            });
        }

        // Check password (in a real application, you should hash the password and compare)
        if (user.password !== password) {
            return res.status(401).json({
                message: 'Invalid password',
                success: false
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" })

        res.status(200).json({
            message: 'Super admin logged in successfully',
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token,
        });

    } catch (error) {
        console.error('Error logging in super admin:', error);
        res.status(500).json({
            message: `Internal Server Error Or ${error.message}`,
            success: false
        });
    }
}



exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.userId; // Assuming user ID is stored in req.user by middleware

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }

        res.status(200).json({
            message: 'User profile retrieved successfully',
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error retrieving user profile:', error);
        res.status(500).json({
            message: `Internal Server Error Or ${error.message}`,
            success: false
        });
    }
};



exports.createAdmin = async (req, res) => {
    try {
        const userId = req.user.userId; // From auth middleware

        const {
            name_of_business,
            Regd_Address,
            Gstin_No,
            Pan_no,
            Name_of_Business_owner,
            Email,
            Contact_No
        } = req.body;

        // Validate text fields
        if (!name_of_business || !Regd_Address || !Gstin_No || !Pan_no || !Name_of_Business_owner || !Email || !Contact_No) {
            return res.status(400).json({
                message: 'All fields are required',
                success: false
            });
        }

        // Check if user is superadmin
        const checkifSuperAdmin = await User.findById(userId);
        if (!checkifSuperAdmin || checkifSuperAdmin.role !== 'superadmin') {
            return res.status(403).json({
                message: 'Access denied. Only super admins can create new admins.',
                success: false
            });
        }

        // Ensure all files are uploaded
        const requiredFiles = ['Company_Logo', 'Incorporation_Certificate', 'Pan_Card', 'GST_Certificate'];
        for (let field of requiredFiles) {
            if (!req.files[field] || req.files[field].length === 0) {
                return res.status(400).json({
                    message: `${field} file is required`,
                    success: false
                });
            }
        }

        // ✅ Upload files separately
        let companyLogoUrl = null;
        let incorporationCertUrl = null;
        let panCardUrl = null;
        let gstCertUrl = null;

        if (req.files['Company_Logo']) {
            const file = req.files['Company_Logo'][0];
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "profile_pics",
                resource_type: "raw" // keeps PDF as raw
            });
            companyLogoUrl = result.secure_url;
        }

        if (req.files['Incorporation_Certificate']) {
            const file = req.files['Incorporation_Certificate'][0];
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "profile_pics",
                resource_type: "raw"
            });
            incorporationCertUrl = result.secure_url;
        }

        if (req.files['Pan_Card']) {
            const file = req.files['Pan_Card'][0];
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "profile_pics",
                resource_type: "raw"
            });
            panCardUrl = result.secure_url;
        }

        if (req.files['GST_Certificate']) {
            const file = req.files['GST_Certificate'][0];
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "profile_pics",
                resource_type: "raw"
            });
            gstCertUrl = result.secure_url;
        }

        // Create admin document in DB
        const newAdmin = new Admin({
            superAdminId: userId,
            name_of_business,
            Regd_Address,
            Gstin_No,
            Pan_no,
            Name_of_Business_owner,
            Email,
            Contact_No,
            Company_Logo: companyLogoUrl,
            Incorporation_Certificate: incorporationCertUrl,
            Pan_Card: panCardUrl,
            GST_Certificate: gstCertUrl
        });

        // save email and password in userCollenction

        const adminSaveInUser = new User({
            adminId: newAdmin._id, // Link to the admin document
            email: Email,
            password: Contact_No, // Assuming Contact_No is used as a password here, which is
            role: 'admin',
        });

        await adminSaveInUser.save();
        await newAdmin.save();

        return res.status(201).json({
            message: 'Admin created successfully',
            success: true,
            data: newAdmin
        });

    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).json({
            message: `Internal Server Error Or ${error.message}`,
            success: false
        });
    }
};



exports.getAllAdmins = async (req, res) => {
    try {
        const userId = req.user.userId; // From auth middleware

        // Check if user is superadmin
        const checkifSuperAdmin = await User.findById(userId);
        if (!checkifSuperAdmin || checkifSuperAdmin.role !== 'superadmin') {
            return res.status(403).json({
                message: 'Access denied. Only super admins can view all admins.',
                success: false
            });
        }

        // Fetch all admins
        const admins = await Admin.find().populate('superAdminId', 'name email');
        if (admins.length === 0) {
            return res.status(404).json({
                message: 'No admins found',
                success: false
            });
        }
        res.status(200).json({
            message: 'Admins retrieved successfully',
            success: true,
            data: admins
        });

    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).json({
            message: `Internal Server Error Or ${error.message}`,
            success: false
        });
    }
};



exports.getAdminById = async (req, res) => {
    try {
        const { adminId } = req.body; // Get adminId from request parameters
        const userId = req.user.userId; // From auth middleware

        // Check if user is superadmin
        const checkifSuperAdmin = await User.findById(userId
        );
        if (!checkifSuperAdmin || checkifSuperAdmin.role !== 'superadmin') {
            return res.status(403).json({
                message: 'Access denied. Only super admins can view admin details.',
                success: false
            });
        }

        // Validate adminId
        if (!adminId) {
            return res.status(400).json({
                message: 'Admin ID is required',
                success: false
            });
        }

        // Fetch admin by ID
        const admin = await Admin.findById(adminId).populate('superAdminId', 'name email');
        if (!admin) {
            return res.status(404).json({
                message: 'Admin not found',
                success: false
            });
        }


        res.status(200).json({
            message: 'Admin retrieved successfully',
            success: true,
            data: admin
        });
    } catch (error) {
        console.error('Error fetching admin by ID:', error);
        res.status(500).json({
            message: `Internal Server Error Or ${error.message}`,
            success: false
        });

    }
}


exports.editAdmin = async (req, res) => {
    try {
        const { adminId } = req.body;
        const userId = req.user.userId; // From auth middleware

        const {
            name_of_business,
            Regd_Address,
            Gstin_No,
            Pan_no,
            Name_of_Business_owner,
            Email,
            Contact_No
        } = req.body;

        // Validate text fields
        // if (!name_of_business || !Regd_Address || !Gstin_No || !Pan_no || !Name_of_Business_owner || !Email || !Contact_No) {
        //     return res.status(400).json({
        //         message: 'All fields are required',
        //         success: false
        //     });
        // }

        // Check if user is superadmin
        const checkifSuperAdmin = await User.findById(userId);
        if (!checkifSuperAdmin || checkifSuperAdmin.role !== 'superadmin') {
            return res.status(403).json({
                message: 'Access denied. Only super admins can edit admins.',
                success: false
            });
        }

        // Validate adminId
        if (!adminId) {
            return res.status(400).json({
                message: 'Admin ID is required',
                success: false
            });
        }

        // Find the admin to edit
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({
                message: 'Admin not found',
                success: false
            });
        }

        // Handle file uploads (optional fields)
        const fileUploads = {};

        if (req.files?.Company_Logo?.[0]) {
            const result = await cloudinary.uploader.upload(req.files.Company_Logo[0].path, {
                folder: "profile_pics",
                resource_type: "raw"
            });
            fileUploads.Company_Logo = result.secure_url;
        }

        if (req.files?.Incorporation_Certificate?.[0]) {
            const result = await cloudinary.uploader.upload(req.files.Incorporation_Certificate[0].path, {
                folder: "profile_pics",
                resource_type: "raw"
            });
            fileUploads.Incorporation_Certificate = result.secure_url;
        }

        if (req.files?.Pan_Card?.[0]) {
            const result = await cloudinary.uploader.upload(req.files.Pan_Card[0].path, {
                folder: "profile_pics",
                resource_type: "raw"
            });
            fileUploads.Pan_Card = result.secure_url;
        }

        if (req.files?.GST_Certificate?.[0]) {
            const result = await cloudinary.uploader.upload(req.files.GST_Certificate[0].path, {
                folder: "profile_pics",
                resource_type: "raw"
            });
            fileUploads.GST_Certificate = result.secure_url;
        }

        // Update admin data
        admin.name_of_business = name_of_business;
        admin.Regd_Address = Regd_Address;
        admin.Gstin_No = Gstin_No;
        admin.Pan_no = Pan_no;
        admin.Name_of_Business_owner = Name_of_Business_owner;
        admin.Email = Email;
        admin.Contact_No = Contact_No;

        // If new files are uploaded, update them
        Object.assign(admin, fileUploads);

        await admin.save();

        return res.status(200).json({
            message: 'Admin updated successfully',
            success: true,
            data: admin
        });

    } catch (error) {
        console.error("Error in editAdmin:", error.message);
        return res.status(500).json({
            message: `Internal Server Error Or ${error.message}`,
            success: false,
        });
    }
};



exports.deleteAdmin = async (req, res) => {
    try {
        const { adminId } = req.body;
        const userId = req.user.userId; // From auth middleware

        // Check if user is superadmin
        const checkifSuperAdmin = await User.findById(userId);
        if (!checkifSuperAdmin || checkifSuperAdmin.role !== 'superadmin') {
            return res.status(403).json({
                message: 'Access denied. Only super admins can delete admins.',
                success: false
            });
        }

        // Validate adminId
        if (!adminId) {
            return res.status(400).json({
                message: 'Admin ID is required',
                success: false
            });
        }

        // Find the admin to delete
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({
                message: 'Admin not found',
                success: false
            });
        }

        // Delete the admin
        await Admin.findByIdAndDelete(adminId);
        await User.findOneAndDelete({ email: admin.Email }); // Assuming Email is unique in User collection 
        res.status(200).json({
            message: 'Admin deleted successfully',
            success: true
        });

    } catch (error) {
        console.log("Error in deleteAdmin:", error.message);
        return res.status(500).json({
            message: `Internal Server Error Or ${error.message}`,
            success: false,
        });
    }
}



// This controller in not complite yet pending in fetch Elements and wlp
exports.fetchAllAdmins_Elements_wlp = async (req, res) => {
    try {
        const userId = req.user.userId; // From auth middleware

        // Check if user is superadmin
        const checkifSuperAdmin = await User.findById(userId);

        if (!checkifSuperAdmin || checkifSuperAdmin.role !== 'superadmin') {
            return res.status(403).json({
                message: 'Access denied. Only super admins can view all admins.',
                success: false
            });
        }

        // Fetch all admins
        // const admins = await Admin.find().populate('superAdminId', 'name email');
        const admins = await User.find({ role: "admin" }).populate("adminId");
        // Fetch all Elements
        const elements = await ElementModel.find({})
        // fetch all wlp

        if (admins.length === 0) {
            return res.status(404).json({
                message: 'No admins found',
                success: false
            });
        }

        if (elements.length === 0) {
            return res.status(404).json({
                message: 'No elements found',
                success: false
            });
        }

        res.status(200).json({
            message: 'Admins retrieved successfully',
            success: true,
            admins: admins,
            adminsCount: admins.length,
            elements,
            elementsCount: elements.length,
            // wlp
            // wlpCount: wlp.length
        });

    } catch (error) {
        console.log("Error in fetchAllAdmins_Elements_wlp:", error.message);
        return res.status(500).json({
            message: `Internal Server Error Or ${error.message}`,
            success: false,
        });
    }
};




exports.showElements = async (req, res) => {
    try {

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error While Showing The Elements"
        })
    }
}



exports.createBrand = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { brandName } = req.body;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide UserId"
            })
        }

        if (!brandName) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide brandName"
            })
        }

        const brand = await BrandModel.create({
            brandName: brandName
        })


        return res.status(200).json({
            sucess: true,
            message: "Brand Created Sucessfully",
            brand,
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server error in createBrand"
        })
    }
};




exports.fetchAllBrands = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide UserId"
            })
        };

        const allBrand = await BrandModel.find({});

        if (allBrand.length === 0) {
            return res.status(200).json({
                sucess: false,
                message: "No Data Found AllBrand "
            })
        }

        return res.status(200).json({
            sucess: true,
            message: "Fetch all Brands",
            allBrand
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in FetchAllBrands"
        })
    }
}



exports.createElementCategory = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { elementCategoryName, brandName } = req.body;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide UserId"
            })
        };

        if (!elementCategoryName) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide elementCategoryName"
            })
        };

        // Fetch Brand 
        const brand = await BrandModel.findOne({ brandName });
        // save in Db
        const cateGory = await CateGoryModel.create({
            elementBrandModelId: brand._id,
            elementCategoryName: elementCategoryName
        });

        return res.status(200).json({
            sucess: true,
            message: "CateGory Created SucessFullt",
            cateGory,
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server error in createElementCategory"
        })
    }
};




exports.fetchAllCategory = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide UserId"
            })
        };

        const fetchAllCategory = await CateGoryModel.find({});

        if (fetchAllCategory.length === 0) {
            return res.status(200).json({
                sucess: false,
                message: "No Data Found fetchAllCategory "
            })
        }

        return res.status(200).json({
            sucess: true,
            message: "Fetch Sucessfully",
            fetchAllCategory,
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in fetchAllCategory"
        })
    }
}




exports.createElement = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { elementName, is_Vltd, elementCategoryName } = req.body;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide UserId"
            })
        };

        if (!elementName) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide elementName"
            })
        };

        if (!is_Vltd) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide is_Vltd"
            })
        };

        const category = await CateGoryModel.findOne({ elementCategoryName });
        console.log(category._id)

        const element = await ElementModel.create({
            elementCategoryModelId: category._id,
            elementName: elementName,
            is_Vltd: is_Vltd,
        });

        return res.status(200).json({
            sucess: true,
            message: "Element Created Sucessfully",
            element,
        })


    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in createElement"
        })
    }
};



exports.addElementCheckBox = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { checkBoxoxName } = req.body;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "UserId Is Required"
            })
        }

        if (!checkBoxoxName) {
            return res.status(200).json({
                sucess: false,
                message: "checkBoxoxName Is Required",
            })
        };

        // let icon = null;

        // if (req.files['icon']) {
        //     const file = req.files['icon'][0];
        //     const result = await cloudinary.uploader.upload(file.path, {
        //         folder: "profile_pics",
        //         resource_type: "raw" // keeps PDF as raw
        //     });
        //     icon = result.secure_url;
        // }

        const checkBox = await CheckBoxModel.create({
            checkBoxoxName: checkBoxoxName,
            // icon,
        })


        return res.status(200).json({
            sucess: true,
            message: "list Created SucessFully"
        })
    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in AddMultipleLists"
        })
    }
};



exports.fetchAllElementCheckBox = async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide UserId"
            })
        };

        const allCheckBox = await CheckBoxModel.find({});

        if (!allCheckBox) {
            return res.status(200).json({
                sucess: false,
                message: "allCheckBox Not Found"
            })
        };

        return res.status(200).json({
            sucess: true,
            message: "allCheckBox are Fetched SucessFully",
            allCheckBox
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in FetchAll CheckBox"
        })
    }
};




exports.fetchAllElement = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide UserId"
            })
        }

        const allElement = await ElementModel.find({});

        if (!allElement) {
            return res.status(200).json({
                sucess: false,
                message: "Have No elemet"
            })
        };


        return res.status(200).json({
            sucess: true,
            message: 'AllElement Fetched SucessFully',
            allElement,
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in FetchAllElement"
        })
    }
}




exports.deleteElement = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.body;

        if (!id || !userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide userId and id"
            });
        }

        const element = await ElementModel.findById(id);

        if (!element) {
            return res.status(200).json({
                sucess: false,
                message: "Element not found"
            });
        }

        // ✅ Delete element
        await ElementModel.findByIdAndDelete(id);

        return res.status(200).json({
            sucess: true,
            message: "Element deleted successfully",
            //deletedElement: element   // returning the deleted doc if you want
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in deleteElement"
        });
    }
};





exports.addElementType = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { elementName, sim, elementType } = req.body;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide userId"
            })
        };

        if (!elementName) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide elementName"
            })
        };

        if (!elementType) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide elementType"
            })
        };

        const saveType = await TypeElementModel.create({
            elementName: elementName,
            elementType: elementType,
            sim: sim,
        });

        return res.status(200).json({
            sucess: true,
            message: "Element Type Created SucessFully"
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server error in addElementType"
        })
    }
};




exports.fetchAllElementType = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide userId"
            })
        };

        const fetchAllType = await TypeElementModel.find({});

        if (!fetchAllType) {
            return res.status(200).json({
                sucess: false,
                message: "In fetchAllType Data Not Found"
            })
        }

        return res.status(200).json({
            sucess: true,
            message: "fetchAllElementType fetched SucessFully",
            fetchAllType,
        })


    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in fetchAllElementType"
        })
    }
};



exports.addDeviceModel = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { elementName, elementType, model_No, voltage } = req.body;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide userId"
            })
        };
        if (!elementName) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide elementName"
            })
        };
        if (!elementType) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide elementType"
            })
        };
        if (!model_No) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide model_No"
            })
        };
        if (!voltage) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide voltage"
            })
        };

        // create Model here
        const modelCreate = await AddModalNo.create({
            elementName: elementName,
            elementType: elementType,
            model_No: model_No,
            voltage: voltage,
        });


        return res.status(200).json({
            sucess: true,
            message: "Element Model Created SucessFully"
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in AddDeviceModel"
        })
    }
};


exports.fetchModelElementData = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide userId"
            })
        };

        const allFetchModelElementData = await AddModalNo.find({});

        if (!allFetchModelElementData.length === 0) {
            return res.status(200).json({
                sucess: false,
                message: "Data Not Found"
            })
        };

        return res.status(200).json({
            sucess: true,
            message: "allFetchModelElementData Fetched sucessFully",
            allFetchModelElementData,
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in fetchModelElementData"
        })
    }
};




exports.addDevicePart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { elementName, elementType, model_No, device_Part_No } = req.body;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide userId "
            })
        }


        if (!elementName) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide elementName "
            })
        }

        if (!elementType) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide elementType "
            })
        }

        if (!model_No) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide model_No "
            })
        }

        if (!device_Part_No) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide device_Part_No "
            })
        }

        const DevicepartNo = await DevicePartNo.create({
            elementName: elementName,
            elementType: elementType,
            model_No: model_No,
            device_Part_No: device_Part_No,
        });


        return res.status(200).json({
            sucess: true,
            message: "Device Created Sucessfully",
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in addDevicePart"
        })
    }
}



exports.fetchAllDeviceData = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide userId "
            })
        };

        const deviceData = await DevicePartNo.find({});

        if (!deviceData) {
            return res.status(200).json({
                sucess: false,
                message: "deviceData Not Found "
            })
        }

        return res.status(200).json({
            sucess: true,
            message: "deviceData Fetched SucessFully ",
            deviceData,
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server error In fetchAllDeviceData"
        })
    }
};



exports.addTacNumber = async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(200).json({
                success: false,
                message: "Please Provide userId "
            });
        }

        let { elementName, elementType, model_No, device_Part_No, tac_No } = req.body;

        if (!elementName) {
            return res.status(200).json({
                success: false,
                message: "Please Provide elementName "
            });
        }
        if (!elementType) {
            return res.status(200).json({
                success: false,
                message: "Please Provide elementType "
            });
        }
        if (!model_No) {
            return res.status(200).json({
                success: false,
                message: "Please Provide model_No "
            });
        }
        if (!device_Part_No) {
            return res.status(200).json({
                success: false,
                message: "Please Provide device_Part_No "
            });
        }
        if (!tac_No) {
            return res.status(200).json({
                success: false,
                message: "Please Provide tac_No "
            });
        }

        // ✅ Normalize tac_No to always be an array
        if (!Array.isArray(tac_No)) {
            tac_No = [tac_No];
        }

        const addtac = await AddTacNo.create({
            elementName,
            elementType,
            model_No,
            device_Part_No,
            tac_No
        });

        return res.status(201).json({
            success: true,
            message: "TAC Number(s) Added Successfully",
            data: addtac
        });

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in addTacNumber",
        });
    }
};



exports.fetchAllTacNo = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide userId "
            })
        };

        const tacNo = await AddTacNo.find({});

        if (!tacNo) {
            return res.status(200).json(
                {
                    sucess: false,
                    message: "No tacNo Data found"
                }
            )
        };

        return res.status(200).json({
            sucess: true,
            message: "tacNo Data Fetched SucessFully",
            tacNo,
        })

    } catch (error) {
        console.log(error, error.message);
        return req.status(500).json({
            sucess: false,
            message: "Server Error in fetchAllTacNo"
        })
    }
}




exports.addCopNumber = async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide userId "
            })
        };

        const { elementName, elementType, model_No, device_Part_No, tac_No, cop_No, date } = req.body;

        if (!elementName || !elementType || !model_No || !device_Part_No || !tac_No || !cop_No || !date) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide all Fields "
            })
        };

        
        const Sim = await TypeElementModel.findOne({elementType});

        const addCop = await AddCopNo.create({
            elementName: elementName,
            elementType: elementType,
            sim:Sim.sim,
            model_No: model_No,
            device_Part_No: device_Part_No,
            tac_No: tac_No,
            cop_No: cop_No,
            date: date,
        });


        return res.status(200).json({
            sucess: true,
            message: "Cop Created Sucessfully"
        });

    } catch (error) {
        console.log(error, error.message)
        return res.status(500).json({
            sucess: false,
            message: "Server Error in addCopNumber"
        })
    }
};




exports.fetchAllCopNo = async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide userId "
            })
        };

        const copNo = await AddCopNo.find({});

        if (!copNo) {
            return res.status(200).json({
                sucess: false,
                message: "No Data Found"
            })
        }

        return res.status(200).json({
            sucess: true,
            message: "FetchAllCopNo Fetched SucessFully ",
            copNo,
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in FetchAllCopNo"
        })
    }
}



exports.fetchAllAdmins = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                sucess: false,
                message: "Please Provide userId "
            })
        };

        const admins = await User.find({ role: "admin" }).populate("adminId");

        if (!admins) {
            return res.status(200).json({
                sucess: false,
                message: "No Data Found In Admin "
            })
        };


        return res.status(200).json({
            sucess: true,
            message: "All Admin Fetch SucessFully",
            admins,
        })
    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            sucess: false,
            message: "Server Error in FetchAdmins"
        })
    }
}



exports.assignElement = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: "Please Provide userId"
            });
        }

        const { elementNameId, adminId } = req.body;
        console.log(elementNameId, adminId)

        // Validate inputs
        if (!elementNameId || !Array.isArray(elementNameId) || elementNameId.length === 0) {
            return res.status(400).json({ success: false, message: "Provide at least one elementNameId" });
        }
        if (!adminId) {
            return res.status(400).json({ success: false, message: "Provide adminId" });
        }

        // Find Admin
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        // Push elements to admin's list
        for (const id of elementNameId) {
            const element = await AddCopNo.findById(id);
            if (element) {
                admin.assign_element_list.push({
                    elementName: element.elementName,
                    elementType: element.elementType,
                    sim:element.sim,
                    model_No: element.model_No,
                    device_Part_No: element.device_Part_No,
                    tac_No: element.tac_No,
                    cop_No: element.cop_No,
                    voltage: element.voltage,
                    copValidity: element.copValidity,
                });
            }
        }

        await admin.save();
        res.status(200).json({ success: true, message: "Elements assigned successfully" });
    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in assignElement"
        });
    }
};




exports.fetchSuperAdminAssignElement = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: "Please Provide userId"
            });
        }

        const assignadmins = await Admin.find({ superAdminId: userId });

        if (assignadmins.length === 0) {
            return res.status(200).json({
                success: false,
                message: "Data Not Found"
            });
        }

        return res.status(200).json({
            sucess:true,
            message:"Fetched SucessFully",
            assignadmins,
        })

    } catch (error) {
        console.log(error, error.message)
        return res.status(500).json({
            sucess: false,
            message: "Server Error in fetchSuperAdminAssignElement"
        })
    }
}