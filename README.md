# Overview

TailTracker is a web-based airplane journal app designed for aviation enthusiasts to track airplanes they have seen or flown on. As a software engineer, this project is a step toward expanding my understanding of modern web development practices, including building applications that are interactive, visually appealing, and user-friendly.

This software allows users to log airplane details such as tail numbers, aircraft types, airlines, and flight routes. Users can view their collection in an organized way and sort or filter based on various criteria. TailTracker showcases my ability to create an intuitive and functional user interface while reinforcing my knowledge of JavaScript and its ecosystem.

The purpose of writing TailTracker was to deepen my understanding of JavaScript, particularly its application in frameworks like Next.js, and to explore full-stack web development by integrating a front-end interface with back-end data storage.

[Software Demo Video](https://www.youtube.com/watch?v=75xr-ZoatXo)

# Development Environment

To develop TailTracker, I used the following tools:

- **Development Tools**: Visual Studio Code, Git, and GitHub for version control
- **Programming Language**: JavaScript, specifically with Next.js (v15.0.3)
- **Libraries**:
  - `cloudinary` (v2.5.1): For image uploads and management
  - `mongoose` (v8.8.2): For interacting with the MongoDB database
  - `next` (v15.0.3): Framework for building the web application
  - `pigeon-maps` (v0.21.6): For rendering maps to visualize airplane routes or airport locations
  - `react` (v19.0.0-rc-66855b96-20241106) and `react-dom` (same version): For building user interfaces
  - `tailwindcss` (v3.4.1): For styling the application
  - `postcss` (v8): For processing CSS

The development environment also included `npm` for managing dependencies and `next` scripts for running, building, and linting the project.


# Useful Websites

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [MongoDB Documentation](https://www.mongodb.com/docs)
- [JavaScript Info](https://javascript.info)

# Future Work

- [x] Add user authentication and authorization to allow multiple users to manage their own airplane logs securely.
- [ ] Implement a search feature to quickly find specific airplanes in the journal.
- [ ] Create a share link with the user id and tail number, don't block on auth status
- [ ] Update layout to be mobile friendly, currenlty diffucult to use the map
- [ ] Update form to use the new sighting array, append to array if tail number is already entered in the DB 

