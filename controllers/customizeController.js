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
    const { product_id } = req.body;
    try {
        const addCustomize = await Customize.create({ product_id })
        if (!addCustomize || addCustomize === null) {
            res.status(400).json({
                status: false,
                message: "Product Wrong ProductID"
            })
        }
        res.status(201).json({
            status: true,
            message: "Customize Added SuccessFully",
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Failed to Fetched Customize Data",
            error: err.message,
        }); 
    }
}
