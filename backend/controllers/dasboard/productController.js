const formidable = require("formidable")
const { responseReturn } = require("../../utiles/response")
const cloudinary = require('cloudinary').v2
const productModel = require('../../models/productModel')

class productController{
    add_product = async (req, res) => {
        const { id } = req;
        const form = formidable({ multiples: true });
    
        form.parse(req, async (err, field, files) => {
            if (err) {
                return responseReturn(res, 500, { error: 'Form parsing failed' });
            }
    
            let { name, category, description, stock, price, discount, shopName, brand } = field;
            let { images } = files;
    
            if (!Array.isArray(images)) {
                images = [images]; // Assurez-vous que images est un tableau
            }
    
            name = name.trim();
            const slug = name.split(' ').join('-');
    
            cloudinary.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
                secure: true,
            });
    
            try {
                let allImageUrl = [];
    
                for (let i = 0; i < images.length; i++) {
                    try {
                        const result = await cloudinary.uploader.upload(images[i].filepath, { folder: 'products' });
                        allImageUrl.push(result.url);
                    } catch (uploadError) {
                        console.error('Cloudinary upload error:', uploadError);
                        return responseReturn(res, 500, { error: 'Image upload failed' });
                    }
                }
    
                await productModel.create({
                    sellerId: id,
                    name,
                    slug,
                    shopName,
                    category: category.trim(),
                    description: description.trim(),
                    stock: parseInt(stock),
                    price: parseInt(price),
                    discount: parseInt(discount),
                    images: allImageUrl,
                    brand: brand.trim(),
                });
    
                responseReturn(res, 201, { message: 'Product Added Successfully' });
    
            } catch (error) {
                console.error('Product creation error:', error);
                responseReturn(res, 500, { error: error.message });
            }
        });
    };
    
    /// end method 

    products_get = async (req,res) => {
        const {page,searchValue, parPage} = req.query
        const {id} = req;
        
        const  skipPage = parseInt(parPage) * (parseInt(page)-1) 

        try {
            if (searchValue) {
                const products = await productModel.find({
                    $text: { $search: searchValue},
                    sellerId: id
                }).skip(skipPage).limit(parPage).sort({createdAt: -1})
                const totalProduct = await productModel.find({
                    $text: { $search: searchValue },
                    sellerId: id
                }).countDocuments()
                responseReturn(res, 200,{ products,totalProduct})
            }else {
                
                const products = await productModel.find({sellerId: id}).skip(skipPage).limit(parPage).sort({createdAt: -1})
                const totalProduct = await productModel.find({sellerId: id}).countDocuments()
                responseReturn(res, 200,{ products,totalProduct})


            }
            
        } catch (error) {

            
        }

    }


     /// end method 






}

module.exports = new productController()