# Restaurant Chat Bot With Chat History

This is a chatbot for a restaurant that allows users to place an order, cancel order, check their order history(current or old), and saves their session and chat history. The chatbot is built using Node.js and Socket.IO, and is designed to provide a seamless and convenient experience for customers who want to order food without having to visit the restaurant or make a phone call (NOT PRODUCTION READY).

### Application link

---

-   [tobi-restaurant-bot](https://tobi-restaurant-bot.onrender.com/)


### Features

---
#### The restaurant chatbot offers various features that allow users to interact with the system in different ways: 
-   They can place an order by selecting the corresponding number of the food item from the menu. 
-   If they want to cancel their current order, they can enter 0, and the order cart will be cleared. 
-   Users can also check their current or old order history by entering the appropriate number. 




### Getting Started

---

1. Clone the repository:
    - `https://github.com/TobiAdeniji94/restaurant-chatbot-V2.git`
    
2. Install all  dependencies:
    - `npm install`
    
3. Create a .env file in the root directory. You can use at the config.js file in the config folder as a guide

4. Start the application:
    - `npm run start`
5. Open the application in your browser:
    - `http://localhost:5000`

### Usage

---

To use the restaurant chatbot, follow these steps:

-   Click the application link [tobi-restaurant-bot](https://tobi-restaurant-bot.onrender.com/) on your device

-   A menu will appear with these options:
    - Type 1 to Place an order: When you type in 1, the chatbot will present you with a menu of items with corresponding numbers. Enter the number of the item you want to order.
    - Type 99 to checkout order: When you type in 99, the chatbot will let you know that your order has been placed.
    - Type 98 to see order history: When you type in 98, the chatbot will show your old orders.
    - Type 97 to see current order: When you type in 97, the chatbot will show your current order.
    - Type 0 to cancel order: When you type in 0, the chatbot will let you know that your order has been cancelled and will show the main menu.
