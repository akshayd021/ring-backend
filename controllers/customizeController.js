const Customize = require("../models/Customize");
const Product = require("../models/Product");

exports.getCustomizeSingleData = async (req, res) => {
    const { id } = req.params
    console.log("req.params:", req.params);
    console.log(id, 'product_id')
    try {
        const customize = await Product.findById(id)
        // .populate("product._id")

        if (!customize || customize === null) {
            res.status(400).json({
                status: false,
                message: "Product not Found"
            })
        }
        res.status(201).json({
            status: true,
            message: "Customize Fetched SuccessFully",
            data: customize
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: "Failed to Fetched Customize Data",
            error: err.message,
        });
    }
};


exports.addCustomizeData = async (req, res) => {
    const { product } = req.body; // <- match schema key!

    try {
        const addCustomize = await Customize.create({ product });

        if (!addCustomize) {
            return res.status(400).json({
                status: false,
                message: "Invalid Product ID",
            });
        }

        res.status(201).json({
            status: true,
            message: "Customize Added Successfully",
            data: addCustomize,
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: "Failed to Add Customize Data",
            error: err.message,
        });
    }
};


exports.updateCustomizeData = async (req, res) => {
    const { id } = req.params;
    const { product } = req.body;

    try {
        // First, check if the document exists
        const existingCustomize = await Customize.findById(id);

        if (existingCustomize) {
            // ✅ Document exists → Update it
            const updatedCustomize = await Customize.findByIdAndUpdate(
                id,
                { product },
                { new: true, runValidators: true }
            );

            return res.status(200).json({
                status: true,
                message: "Customize Updated Successfully",
                data: updatedCustomize,
            });
        } else {
            // ❌ Document does not exist → Create it with custom _id
            const newCustomize = new Customize({
                product,
            });

            await newCustomize.save();

            return res.status(201).json({
                status: true,
                message: "Customize Created Successfully",
                data: newCustomize,
            });
        }
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Failed to update or create Customize data",
            error: err.message,
        });
    }
};





