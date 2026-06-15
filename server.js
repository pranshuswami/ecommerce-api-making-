const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ecommerce_db"
});

db.connect((err) => {
    if (err) {
        console.log("error", err);
    } else {
        console.log("database connected successfully");
    }
});

app.get("/customer-order", (req, res) => {
    const sql = "SELECT c.customer_id,c.name,c.email,o.order_id,o.order_date,o.total_amount FROM customers c JOIN orders o ON c.customer_id=o.customer_id";

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({
                status: "failed",
                message: err.message
            });
        }

        res.status(200).json({
            status: "success",
            message: "data fetched",
            data: result
        });
    });
});

app.get("/products", (req, res) => {
    const sql = "SELECT * FROM products";

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({
                status: "failed",
                message: err.message
            });
        }

        res.status(200).json({
            status: "success",
            data: result
        });
    });
});

app.post("/products", (req, res) => {
    const { product_name, price, category_id } = req.body;

    const sql = "INSERT INTO products(product_name,price,category_id) VALUES(?,?,?)";

    db.query(sql, [product_name, price, category_id], (err, result) => {
        if (err) {
            return res.status(500).json({
                status: "failed",
                message: err.message
            });
        }

        res.status(201).json({
            status: "success",
            message: "product added successfully",
            data: {
                product_id: result.insertId,
                product_name,
                price,
                category_id
            }
        });
    });
});

app.put("/products/:id", (req, res) => {
    const { id } = req.params;
    const { product_name, price, category_id } = req.body;

    const sql = "UPDATE products SET product_name=?,price=?,category_id=? WHERE product_id=?";

    db.query(sql, [product_name, price, category_id, id], (err, result) => {
        if (err) {
            return res.status(500).json({
                status: "failed",
                message: err.message
            });
        }

        res.status(200).json({
            status: "success",
            message: "product updated successfully",
            data: {
                product_id: id,
                product_name,
                price,
                category_id
            }
        });
    });
});

app.delete("/products/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM products WHERE product_id=?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                status: "failed",
                message: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: "failed",
                message: "product not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "product deleted successfully"
        });
    });
});

app.get("/products/search", (req, res) => {
    const { name } = req.query;

    const sql = "SELECT * FROM products WHERE product_name LIKE ?";

    db.query(sql, [`%${name}%`], (err, result) => {
        if (err) {
            return res.status(500).json({
                status: "failed",
                message: err.message
            });
        }

        res.status(200).json({
            status: "success",
            message: "product found",
            data: result
        });
    });
});
app.get("/product-details",(req,res)=>{
    const sql="SELECT p.product_name,p.price,pd.description,pd.brand,pr.rating,pr.review FROM products p JOIN product_details pd ON p.product_id=pd.product_id JOIN product_reviews pr ON pd.product_id=pr.product_id"
    db.query(sql,(err,result)=>{
        if(err){
            return res.status(500).json({
                status:"failed",
                message:"product details not fetched"
            })
        }else{
            res.status(200).json({
                status:"success",
                message:"product details fetched successfully",
                data:result
            })
        }
    })
})
app.post("/product-info",(req,res)=>{

    const {product_name,price,category_id,description,brand,rating,review} = req.body

    const productSql = "INSERT INTO products(product_name,price,category_id) VALUES(?,?,?)"

    db.query(productSql,[product_name,price,category_id],(err,result)=>{

            if(err){
                return res.status(500).json({
                    status:"failed",
                    message:"product not added"
                });
            }

            const product_id = result.insertId;

            const detailsSql = "INSERT INTO product_details(product_id,description,brand) VALUES(?,?,?)"

            db.query(detailsSql,[product_id,description,brand],(err,result)=>{

                    if(err){
                        return res.status(500).json({
                            status:"failed",
                            message:"details not added"
                        });
                    }

                    const reviewSql = "INSERT INTO product_reviews(product_id,rating,review) VALUES(?,?,?)"

                    db.query(reviewSql,[product_id,rating,review],(err,result)=>{

                            if(err){
                                return res.status(500).json({
                                    status:"failed",
                                    message:"review not added"
                                });
                            }

                            res.status(201).json({
                                status:"success",
                                message:"Product info added successfully",
                                data:{
                                    product_id,product_name,price,category_id,description,brand,rating,review
                                }
                            })

                    })
            })
    })
})
app.listen(5000, () => {
    console.log("server running at 5000");
});