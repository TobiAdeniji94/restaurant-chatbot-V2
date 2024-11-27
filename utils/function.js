const path = require("path");
const User = require("../models/userModel");
const fs = require("fs");

// Caching menu and options to avoid reading from the file system repeatedly
let menu = [];
let options = [];

// function to load menu and options data from files (called only once)
const loadData = () => {
  try {
    const menuJSON = fs.readFileSync(path.join(__dirname, "../data", "menu.json"), "utf-8");
    const optionsJSON = fs.readFileSync(path.join(__dirname, "../data", "options.json"), "utf-8");
    menu = JSON.parse(menuJSON);
    options = JSON.parse(optionsJSON);
  } catch (err) {
    console.error("Error reading menu or options file:", err);
  }
};

// Call loadData once at the start of the application
loadData();

// Function to check allowed text
const isAllowedText = (text) => {
  const allowedText = [0, 1, 2, 3, 4, 5, 6, 7, 96, 97, 98, 99];
  return allowedText.includes(Number(text)) ? text : false;
};

// Function to handle user messages
const handleMessage = async (text, socket, userId) => {
  // Check if the message is allowed
  if (!isAllowedText(text)) {
    const formattedOptions = options.map(option => `<ul><li>${option}</li></ul>`).join("");
    return socket.emit("chat", `Please select the given options <br>----<br>${formattedOptions}`);
  }

  // Handle valid messages
  const reply = await switchChatMessage(text, userId);
  socket.emit("chat", reply);
};

// Function to process chat messages based on user input
const switchChatMessage = async (text, userId) => {
  // Retrieve user info from DB
  const UserDetails = await User.findOne({ userId });
  if (!UserDetails) {
    return "User not found";
  }

  let result;
  let response = "";

  switch (text) {
    case "0":
      // Cancel current order if exists
      if (UserDetails.currentOrder.length < 1) {
        return "You do not have any order";
      } else {
        UserDetails.currentOrder = [];
        await UserDetails.save();
        response = `Order cancelled
          <br>----<br>
          <ul><li>enter 96 to see main menu</li></ul><br>
          <ul><li>enter 1 to see food menu</li></ul>`;
      }
      break;

    case "1":
      // Show the food menu
      const formattedMenu = menu.map(item => `${item.number}. ${item.name}: ₦${item.price}`).join("<br>");
      response = `Here's the menu: <br>----<br> ${formattedMenu}
        <br>----<br>
        <ul><li>enter 1 to see food menu</li></ul><br>
        <ul><li>enter 97 to see current order</li></ul><br>
        <ul><li>enter 98 to see order history</li></ul><br>
        <ul><li>enter 99 to checkout order</li></ul><br>
        <ul><li>enter 0 to cancel order</li></ul>`;
      break;

    case "96":
      // Show the main menu options
      const formattedOptions = options.map(option => `<ul><li>${option}</li></ul>`).join("");
      response = `${formattedOptions}`;
      break;

    case "97":
      // View current order
      if (UserDetails.currentOrder.length < 1) {
        return `You do not have any orders 
          <br>----<br>
          <ul><li>enter 96 to see main menu</li></ul><br>
          <ul><li>enter 1 to see food menu</li></ul>`;
      } else {
        let currentOrder = UserDetails.currentOrder.map(item => `${item.name} for ₦${item.price}`).join("<br>");
        let totalPrice = UserDetails.currentOrder.reduce((acc, item) => acc + item.price, 0);
        response = `Current order <br>----<br>
        ${currentOrder}
        <br>----<br>
        Total price: ₦${totalPrice}
        <br>----<br>
        <ul><li>enter 1 to see food menu</li></ul><br>
        <ul><li>enter 98 to see order history</li></ul><br>
        <ul><li>enter 99 to checkout order</li></ul><br>
        <ul><li>enter 0 to cancel order</li></ul>`;
      }
      break;

    case "98":
      // View order history
      if (UserDetails.orderHistory.length < 1) {
        return "You have no order history";
      } else {
        const orderHistory = "Your order history <br>----<br>" + 
          UserDetails.orderHistory.map(item => `- ${item.name} for ₦${item.price}`).join("<br>") + 
          `<br>----<br>
          <ul><li>enter 1 to see food menu</li></ul><br>
          <ul><li>enter 96 to see main menu</li></ul>`;
        response = orderHistory;
      }
      break;

    case "99":
      // Place the order
      if (UserDetails.currentOrder.length < 1) {
        return `You have not ordered yet
          <br>----<br>
          <ul><li>enter 96 to see main menu</li></ul><br>
          <ul><li>enter 1 to see food menu</li></ul>`;
      } else {
        UserDetails.orderHistory = [...UserDetails.orderHistory, ...UserDetails.currentOrder];
        UserDetails.currentOrder = [];
        await UserDetails.save();
        response = `Your order has been placed. 
          <br>----<br>
          <ul><li>enter 1 to see food menu</li></ul><br>
          <ul><li>enter 96 to see main menu</li></ul><br>
          <ul><li>enter 97 to see current order</li></ul><br>
          <ul><li>enter 98 to see order history</li></ul>`;
      }
      break;

    // Handle food item selection (2-7)
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
      result = menu.find(item => item.number === Number(text));
      if (!result) {
        response = "Sorry, the item you selected is not available";
      } else {
        const { price, name } = result;
        UserDetails.currentOrder.push({ price, name });
        await UserDetails.save();
        response = `You selected <br>----<br>${name}<br> Price: ₦${price}
        <br>----<br>
        <ul><li>enter 1 to see food menu</li></ul><br>
        <ul><li>enter 97 to see current order</li></ul><br>
        <ul><li>enter 98 to see order history</li></ul><br>
        <ul><li>enter 99 to checkout order</li></ul><br>
        <ul><li>enter 0 to cancel order</li></ul>`;
      }
      break;

    default:
      response = "Invalid input.";
  }

  return response;
};

// Export the handleMessage function
module.exports = handleMessage;
