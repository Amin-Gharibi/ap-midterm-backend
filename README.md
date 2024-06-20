# Movie Rating System Backend

This project is the back-end component of the mid-term assignment for the Advanced Programming course at Ilam University, supervised by Dr. Bag-Mohammadi.

## Table Of Contents

- [Overview](#overview)
- [Features](#features)
- [Usage](#usage)
- [Technologies Used](#technologies-used)

## Overview
This project is a movie rating system similar to IMDB, where admins can create movies, casts, and critics. Normal users can sign up, and upon approval by an admin, they can start rating and commenting on movies and casts. Critics' ratings have a doubled effect compared to normal users. All users can publish articles, which others can rate and comment on.

## Features
- Show Latest Movies Added
- Show Random Genre Top Rated Movies
- Show Latest Articles Added
- Show Top Rated Cast
- Universal Search
- Exclusive Search for Movies, Articles, Casts
- User Profile Editing by User or Admin
- Send OTP and Approval or Rejection Email to Users
- Admin Features:
  - Add, Edit, or Delete Movies (as draft or published)
  - Add, Edit, or Delete Casts
  - Approve or Reject Comments
  - See and Manage All Articles (delete if not approved)
- User Features:
  - Add Articles (as draft or published), Edit or Delete Them
  - Comment on Cast, Movie, Article; Like, Dislike, Reply to Comments
  - Add Movies, Articles to Favorite List, Remove from List

## Usage
To use this application, I suggest you use [this app](https://github.com/Amin-Gharibi/ap-midterm-py-app) as the front-end.
For using the back-end, follow these steps:

1. Clone or download the project and also install Node.js and npm on your system.
2. Navigate to the backend folder and run this command:
    ```bash
    npm i
    ```
3. Then create a `.env` file with the following fields:
    ```plaintext
    PORT=<PORT-YOU-WANT-THE-BACKEND-TO-RUN-ON e.g., 3000>
    MONGO_URI=<MONGODB-DATABASE-URI e.g., mongodb://127.0.0.1:27017/Amin-Gharibi-Rating-System>
    JWT_SECRET=<YOUR-JWT-SECRET e.g., slkjfdldlkriwsxk>
    OTP_SENDER_SERVICE=<SERVICE-OTP-SENDER-EMAIL-IS-ON e.g., gmail>
    OTP_SENDER_EMAIL=<SERVICE-OTP-SENDER-EMAIL e.g., otpsender@gmail.com>
    OTP_SENDER_PASSWORD=<OTP-SENDER-EMAIL-PASSWORD e.g., "abcd efgh ijkl mnop">
    ```
4. After the previous step, navigate to the backend folder and run this command:
    ```bash
    npm run dev
    ```

Done!

## Technologies Used
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
