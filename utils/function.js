const path = require("path");
const User = require("../models/userModel");
const fs = require("fs");


// function to check text input 
const isAllowedText = (text) => {
    const allowedText = [0, 1, 2, 3, 4, 5, 6, 7, 96, 97, 98, 99];
    const allow = allowedText.find((t) => text.toString() === t.toString());
    
    return allow !== undefined ? allow.toString() : false;
};  

// function to check allowed text
const handleMessage = async (text, socket, userId) => {

    // Check if the message is allowed
    if (!isAllowedText(text))
      return socket.emit("chat", "Please select the given options");
  
    // handle chats that reach here.
    // emit reply as reply
    const reply = await switchChatMessage(text, userId);
    socket.emit("chat", reply);
};

// function to return message in response to user action 
const switchChatMessage = async (text, userId) => {
    // parse menu.json
    const menuJSON = fs.readFileSync(
      path.join(__dirname, "../data", "menu.json"),
      "utf-8"
    );
    const menu = JSON.parse(menuJSON);

    // parse options.json
    const optionsJSON = fs.readFileSync(
      path.join(__dirname, "../data", "options.json"),
      "utf-8"
    );
    const options = JSON.parse(optionsJSON);
  
    // retrieve user info from DB
    const UserDetails = await User.findOne({userId});
    if (!UserDetails) {
        return "User not found";
    } 
    
    switch (text) {
      case "0":
        if (UserDetails.currentOrder.length < 1){
          return "You do not have any order"
        } else {
          UserDetails.currentOrder = [];
          await UserDetails.save();
  
          return "Order cancelled" + "<br>----<br>- press 96 to see main menu <br>- press 1 to see food menu";
        }
  
      case "1":
        const formattedMenu = menu.map((item) => `${item.number}. ${item.name}: ₦${item.price}`).join("<br>");
        return `Here's the menu: <br>----<br> ${formattedMenu}` + "<br>----<br>- press 96 to see main menu <br>- press 1 to see food menu";
  
      case "2":
        var result = menu.find(item => item.number === 2);
        if (!result) {
          return "Sorry, the item you selected is not available";
        }
        
        let {price, name} = result;
        UserDetails.currentOrder = [...UserDetails.currentOrder, {price, name}]
        await UserDetails.save();
        
        return `You selected <br>----<br>${result.name}<br> Price: ₦${result.price}` + "<br>----<br>- press 99 to order <br>- press 96 to see main menu <br>- press 1 to see food menu";
  
      case "3":
        var result = menu.find(item => item.number === 3);
        if (!result) {
          return "Sorry, the item you selected is not available";
        }
  
        let {price:price2, name:name2} = result;
        UserDetails.currentOrder = [...UserDetails.currentOrder, {price:price2, name:name2}];
        await UserDetails.save();
        
        return `You selected <br>----<br>${result.name}<br> Price: ₦${result.price}` + "<br>----<br>- press 99 to order <br>- press 96 to see main menu <br>- press 1 to see food menu";
  
      case "4":
        var result = menu.find(item => item.number === 4);
        if (!result) {
          return "Sorry, the item you selected is not available";
        }
  
        let {price:price3, name:name3} = result;
        UserDetails.currentOrder = [...UserDetails.currentOrder, {price:price3, name:name3}]
        await UserDetails.save();
  
        return `You selected <br>----<br>${result.name}<br> Price: ₦${result.price}` + "<br>----<br>- press 99 to order <br>- press 96 to see main menu <br>- press 1 to see food menu";
  
      case "5":
        var result = menu.find(item => item.number === 5);
        if (!result) {
          return "Sorry, the item you selected is not available";
        }
  
        let {price:price4, name:name4} = result;
        UserDetails.currentOrder = [...UserDetails.currentOrder, {price:price4, name:name4}]
        await UserDetails.save();
        
        return `You selected <br>----<br>${result.name}<br> Price: ₦${result.price}` + "<br>----<br>- press 99 to order <br>- press 96 to see main menu <br>- press 1 to see food menu";
      
      case "6":
        var result = menu.find(item => item.number === 6);
        if (!result) {
          return "Sorry, the item you selected is not available";
        }
  
        let {price:price5, name:name5} = result;
        UserDetails.currentOrder = [...UserDetails.currentOrder, {price:price5, name:name5}]
        await UserDetails.save();
        
        return `You selected <br>----<br>${result.name}<br> Price: ₦${result.price}` + "<br>----<br>- press 99 to order <br>- press 96 to see main menu <br>- press 1 to see food menu";
      
      case "7":
        var result = menu.find(item => item.number === 7);
        if (!result) {
          return "Sorry, the item you selected is not available";
        }
  
        let {price:price6, name:name6} = result;
        UserDetails.currentOrder = [...UserDetails.currentOrder, {price:price6, name:name6}]
        await UserDetails.save();
        
        return `You selected <br>----<br>${result.name}<br> Price: ₦${result.price}` + "<br>----<br>- press 99 to order <br>- press 96 to see main menu <br>- press 1 to see food menu";
      
      case "96":
        const formattedOptions = options
        .map((options) => `<ul><li>${options}</li></ul>`)
        .join("");
        return `${formattedOptions}`;

      // view current order
      case "97":
        if (UserDetails.currentOrder.length < 1){
          return "You do not have any orders" + "<br>----<br>- press 96 to see main menu <br>- press 1 to see food menu";
        } else if (UserDetails.currentOrder.length > 1){
          let currentOrder = UserDetails.currentOrder.map((item) => `${item.name} for ₦${item.price}`).join("<br>")
  
          let totalPrice = UserDetails.currentOrder.reduce((acc, item) => acc + item.price, 0)
          return `Current order <br>----<br>${currentOrder}<br>----<br>Total price: ₦${totalPrice}` + "<br>----<br>- press 96 to see main menu <br>- press 1 to see food menu";
        } else {
          let currentOrder = `${UserDetails.currentOrder[0].name} for ₦${UserDetails.currentOrder[0].price}`
          return `Current order <br>----<br>${currentOrder}` + "<br>----<br>- press 96 to see main menu <br>- press 1 to see food menu";
        }
  
      // view order hsitory
      case "98":
        if (UserDetails.orderHistory.length < 1){
          return "You have no order history"
        } else {
          orderHistory = "Your order history <br>----<br>" 
          + UserDetails.orderHistory.map((item) => `${item.name} for ₦${item.price}`).join("<br>") + "<br>----<br>- press 96 to see main menu <br>- press 1 to see food menu";
        }
  
        return orderHistory
      
      // place order
      case "99":
        if (UserDetails.currentOrder.length < 1){
          return 'You have not ordered yet'
        } else {
          UserDetails.orderHistory = [...UserDetails.orderHistory, ...UserDetails.currentOrder]
          UserDetails.currentOrder = [...UserDetails.currentOrder]
          UserDetails.save()
        }
        
        return 'Your order has been placed.' + "<br>----<br>- press 96 to see main menu <br>- press 1 to see food menu";
    }
};
  
module.exports = handleMessage;