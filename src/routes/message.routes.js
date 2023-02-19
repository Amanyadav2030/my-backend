const express = require('express');
const MessageRouter = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MessageModel, UserModel } = require('../model');
MessageRouter.get('/',async(req,res)=>{
    try {
      const token = req.headers.authorization;
      const check = jwt.verify(token,process.env.MAIN_TOKEN);
      if(!check){
          return res.status(401).send("Not authorised");
      }
      const {id} = check;
        const user = await UserModel.findOne({id});
        if(!user){
            return res.status(401).send("Not authorised");
        }
        const messages = await MessageModel.find().sort({ updatedAt: 1 }).populate(["sender"]);
        // const projectedMessages = messages.map((msg) => {
        //   return {
        //     fromSelf: msg.sender.toString() === from,
        //     message: msg.message.text,
        //   };
        // });
        res.send(messages);
      } catch (ex) {
        res.status(501).send({err:ex.message})
      }

});
MessageRouter.post('/',async(req,res)=>{
    try {
        const token = req.headers.authorization;
        const check = jwt.verify(token,process.env.MAIN_TOKEN);
        if(!check){
            return res.status(401).send("Not authorised");
        }
        const {id} = check;
        const user = await UserModel.findOne({id});
        if(!user){
            return res.status(401).send("Not authorised");
        }
        const message = new MessageModel(req.body);
        await message.save();
        res.send(message);
      } catch (ex) {
        res.status(501).send({err:ex.message})
      }

});
module.exports = MessageRouter;