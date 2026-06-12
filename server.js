const express=require("express")
const mysql=require("mysql2")
const cors=require("cors")
const app=express()
app.use(express.json())
app.use(cors())
const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"ecommerce_db"
})
db.connect((err)=>{
    if(err){
        console.log("error",err);       
    }else{
        console.log("database connected successfully");        
    }
})
app.get("/customer-order",(req,res)=>{
    const sql="SELECT c.customer_id,c.name,c.email,o.order_id,o.order_date,o.total_amount FROM customers c JOIN orders o ON c.customer_id=o.customer_id"
    db.query(sql,(err,result)=>{
        if(err){
            return res.status(500).json({
                status:"failed",
                message:"data not fetched"
            })
        }else{
            res.status(200).json({
                status:"success",
                message:"data fetched",
                data:result
            })
        }
    })
})
app.get("/products-category",(req,res)=>{
    const sql="SELECT p.product_name,p.price,c.category_name FROM products p JOIN categories c ON p.category_id=c.category_id"
    db.query(sql,(err,result)=>{
        if(err){
            return res.status(500).json({
                status:"failed",
                message:"data not fetched"
            })
        }else{
            res.status(200).json({
                status:"success",
                message:"data fetched",
                data:result
            })
        }
    })
})
app.get("/order-product",(req,res)=>{
     const sql="SELECT o.order_id,o.order_date,oi.quantity,oi.price,p.product_name,p.product_id FROM orders o JOIN order_items oi ON o.order_id=oi.order_id JOIN products p ON oi.product_id=p.product_id"
    db.query(sql,(err,result)=>{
        if(err){
            return res.status(500).json({
                status:"failed",
                message:"data not fetched"
            })
        }else{
            res.status(200).json({
                status:"success",
                message:"data fetched",
                data:result
            })
        }
    })
})
app.get("/customer-purchase",(req,res)=>{
    const sql="SELECT c.name,c.email,o.order_id,o.order_date,oi.quantity,oi.price,p.product_name,p.price FROM customers c JOIN orders o ON c.customer_id=o.customer_id JOIN order_items oi ON o.order_id=oi.order_id JOIN products p ON oi.product_id=p.product_id"

    db.query(sql,(err,result)=>{
        if(err){
            return res.status(500).json({
                status:"failed",
                message:"data not fetched"
            })
        }else{
            res.status(200).json({
                status:"success",
                message:"data fetched",
                data:result
            })
        }
    })
})
app.get("/customer-category",(req,res)=>{
    const sql="SELECT c.name, c.email,o.order_id,o.order_date,oi.quantity,oi.price,p.product_name,p.price,cg.category_name FROM customers c JOIN orders o ON c.customer_id=o.customer_id JOIN order_items oi ON o.order_id=oi.order_id JOIN products p ON oi.product_id=p.product_id JOIN categories cg ON p.category_id=cg.category_id"

    db.query(sql,(err,result)=>{
        if(err){
            return res.status(500).json({
                status:"failed",
                message:"data not fetched"
            })
        }else{
            res.status(200).json({
                status:"success",
                message:"data fetched",
                data:result
            })
        }
    })
})
app.listen(5000,()=>{
    console.log("server running at 5000");
    
})