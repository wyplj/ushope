const express = require("express");
const http = express();
const bodyParser = require("body-parser")
const Db = require("./db")
const db = new Db("xinyuan")
http.listen(8080,()=>{
    console.log("run")
})
http.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    next();
})
http.use(bodyParser.urlencoded({extended:false}));
//提交愿望
http.post("/add",(req,res)=>{
    let data=req.body;
    db.find("info",{
        query:{
            xinYuan:data.xinYuan
        }
    },(err,data1)=>{
        if(data1.length==0){
            data.timer=new Date().getTime();
            data.active="white";
            db.insertOne("info",data,(err,newData)=>{
                if(err) throw err;
                res.send({
                    status:"1",
                    statusText:"许愿成功"
                })
            })
        }else{
            res.send({
                status:"-1",
                statusText:"愿望重复,请重新输入"
            })
        }
    })
})

http.use("/show",(req,res)=>{
    db.find("info",{},(err,data)=>{
       if(data.length==0){
          res.send({
              status:"0",
              statusText:"快来许愿吧"
          })
       }else{
           randSort(data)
           if(data.length>8){
               let newArr=data.slice(0,8)
               res.send({
                   status:"8",
                   newArr
               })
           }else{
               res.send({
                   status:"4",
                   data
               })
           }
       }
    })
})
http.get("/del",(req,res)=>{
    var id=req.query.id;
    db.deleteById("info",id,(err,data4)=>{
        if(err){
            console.log("删除失败");
            res.send()
        }else{
            console.log("删除成功");
            res.send(data4)
        }
    })
})

//随机排序
function randSort(arr) {
    var temp;
    for(var i=0;i<arr.length;i++){
        var randIndex=parseInt(Math.random()*(arr.length));
        temp=arr[randIndex]
        arr[randIndex]=arr[i];
        arr[i]=temp
    }
    return arr;
}
http.get("/chos",(req,res)=>{
    let data=req.query;
    console.log(data)
    db.findById("info",data._id,(err,data1)=>{
        if(data1.active=="white"){
            db.updateById("info",data1._id,{
                active:data.active
            },(err,data1)=>{
                if(err) throw err;
                res.send({
                    status:"2",
                    // statusText:"恭喜愿望已实现"
                })
            })
        }else{
            res.send({
                status:"-2"
            })
        }
    })
})