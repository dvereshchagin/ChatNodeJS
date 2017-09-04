"use strict";

const MessageModel = require("./model/messages.model.js");

module.exports= io=> {
    io.on('connection',function(socket) {
    socket.emit('connected',"You are connected");
    socket.join('all');
    socket.on('msg',content => {
        const obj= {
            date: new Date(),
            content: content,
            username: socket.id
        }
       MessageModel.create(obj,err => {
           if(err) return console.error("MessageModel",err);
           socket.emit("message",obj);
           socket.to("all").emit("message",obj);
       })
    })
    socket.on("receiveHistory",function() {
        MesssageModel
            .find({})
            .sort({date: -1})
            .limit(50)
            .sort({date:1})
            .lean()
            .exec((err,messages)=> {
                if(!err ) {
                    socket.emit("history",messages);
                }
            })
    })
})
}