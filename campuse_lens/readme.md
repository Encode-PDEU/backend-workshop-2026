# CampusLens - Hot or Not

A straightforward "Hot or Not" application designed for campus communities. Students can anonymously share posts or moments and engage with the community by liking or disliking posts. 

## Key Features

- **Strict Anonymity:** Every user receives an auto-generated identifier upon sign-up. Everything posted or commented is entirely anonymous to the community.
- **Hot or Not:** Mutual exclusive voting system using `Likes` and `Dislikes` arrays to rate public posts.
- **Personal Dashboard:** A feature explicitly allowing you to track and view posts you've authored without exposing your identity to the rest of the campus.
- **Top Rankings:** Quickly jump to the /top posts globally recognized by the student body.
- **Cloudinary Integration:** Full image upload support internally handled avoiding bulky binary databases.

## Technology Stack
- **Node.js + Express** (Backend framework)
- **MongoDB + Mongoose** (Database)
- **JWT + bcryptjs** (Authentication & Security)
- **Multer + Cloudinary** (Image handling)
