const express=require("express")
const mysql=require("mysql2")

const app=express()
app.use(express.json())

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
app.post("/products",(req,res)=>{
    const{product_name,price,category_id}=req.body
    const sql="INSERT INTO products(product_name,price,category_id) VALUES(?,?,?)"

    db.query(sql,[product_name,price,category_id],(err,result)=>{
        if(err){
            return res.status(500).json({
                status:"failed",
                message:"product not added"
            })
        }else{
            res.status(200).json({
                status:"success",
                message:"product added successfully",
            
            })
        }
    })
}),
app.put("/products/:id",(req,res)=>{
    const{id}=req.params
    const{product_name,price,category_id,}=req.body
    const sql="UPDATE products SET product_name=?,price=?,category_id=? WHERE product_id=?"
     db.query(sql,[product_name,price,category_id,id],(err,result)=>{
        if(err){
            return res.status(500).json({
                status:"failed",
                message:"product not updated"
            })
        }else{
            res.status(200).json({
                status:"success",
                message:"product updated successfully"
            
            })
        }
    })
})
app.delete("/products/:id",(req,res)=>{
    const{id}=req.params
    const sql="DELETE FROM products WHERE product_id=?"
    db.query(sql,[id],(err,result)=>{
        if(err){
            return res.status(500).json({
                status:"failed",
                message:"product not deleted"
            })
        }else{
            res.status(200).json({
                status:"success",
                message:"product deleted successfully"
            
            })
        }
    })
})
app.get("/products/search",(req,res)=>{
    const{name}=req.query
    const sql="SELECT * FROM products WHERE product_name LIKE ?"
    db.query(sql,[`%${name}%`],(err,result)=>{
        if(err){
            return res.status(500).json({
                status:"failed",
                message:"product not found"
            })
        }else{
            res.status(200).json({
                status:"success",
                message:"product founded",
                data:result
            })
        }
    })
})
app.listen(5000,()=>{
    console.log("server running at 5000");
    
})