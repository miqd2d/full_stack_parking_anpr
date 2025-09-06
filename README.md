# 🚗 Full Stack Parking ANPR

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

---

### ✨ Overview

Full Stack Parking ANPR is a comprehensive parking management system that leverages **Automatic Number Plate Recognition (ANPR)** technology. It provides a seamless solution for real-time vehicle detection, parking slot management, user authentication, and payment handling.

---

### ⚡ Features

-   **Real-time ANPR:** Automatically detects and recognizes vehicle number plates using a custom-trained YOLOv8 model.
-   **Dynamic Slot Management:** Efficiently manage parking space availability.
-   **User Authentication:** Secure user registration and login system with role-based access control using JSON Web Tokens (JWT).
-   **Payment Integration:** Built-in support for payment gateways.
-   **Admin Dashboard:** An intuitive dashboard for administrators to monitor activity and generate reports.

---

### 🛠️ Tech Stack

-   **Frontend:** React.js
-   **Backend:** Node.js with Express.js
-   **Database:** MySQL
-   **ANPR Engine:** Custom-trained YOLOv8 Model
-   **Authentication:** JSON Web Tokens (JWT)

---

### 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

#### Prerequisites

-   Node.js and npm
-   MySQL Server

#### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/miqd2d/full_stack_parking_anpr.git](https://github.com/miqd2d/full_stack_parking_anpr.git)
    cd full_stack_parking_anpr
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file by copying the example file.
    ```sh
    cp .env.example .env
    ```
    Update the `.env` file with your database credentials and other required API keys.

4.  **Run the Application:**
    ```sh
    npm start
    ```
    The application will be accessible at `http://localhost:5000`.

---

### 📂 Project Structure
full_stack_parking_anpr/
├── node_modules/       # Project dependencies
├── server/             # Backend API (Node.js/Express)
│   ├── controllers/    # Logic for handling requests
│   ├── models/         # Database schemas and models
│   └── routes/         # API endpoint definitions
├── website/            # Frontend application (React)
│   ├── assets/         # CSS, images, and other static assets
│   └── views/          # React components and pages
├── .env                # Environment variables
└── package.json        # Project metadata and scripts

---

### 🧪 Usage

1.  Navigate to `http://localhost:5000` in your web browser.
2.  **Register** for a new account or **Login** if you already have one.
3.  Users can search for and reserve available parking slots.
4.  Administrators can log in to access the admin dashboard to manage parking slots, view user data, and generate reports.

---

### 🤝 Contributing

Contributions are welcome! Please follow these steps to contribute:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature`).
3.  Commit your changes (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/YourFeature`).
5.  Open a Pull Request.

---

### 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

© 2025
