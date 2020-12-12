# Aleo

## Table of Contents
* [General Info](#general-info)
* [Technologies](#tech)
* [Setup](#setup)

## <a name="general-info">General Info</a>
### v1
This app was created in conjunction with a smart purse called 'Aleo'. Aleo incorporates multiple electronic sensors into the design of a contemporary, small, day-purse. The bag boasts automatic interior LED lighting, GPS tracking, alarm system, and emergency SMS messaging. The Aleo App allows users to customize the light, alarm, and sms settings; edit account information; manage emergency contacts; and track your purse if it gets lost or stolen.

### v2 Plans
* Functional import contacts
* Contact Editing
* "Find Your Friend" tracking
* UI Animations
* Design Edits

## <a name="tech">Technologies</a>
Lighting options include full spectrum RGB colours, brightness, and light patterns. The alarm can be turned on/off and response time can be adjusted in seconds. Emergency contacts can be added manually, or imported from your device, although this feature is not fully functional yet (v2). All sensors are wired to an Arduino, and connected to the app through a Socket.io and NodeJS server. Firebase is used for user authentication, account creation, and contact storage. plans include adding a timer, user profile image, and number of complete games.

* React Native
* Expo
* Firebase
* NodeJS
* Socket.io

## <a name="setup">Setup</a>
**IMPORTANT**: After cloning the repo, extract 'server.zip' and save to a separate folder – it cannot be run within the same project folder as the rest of the app.

To run this project, you must have an [Expo](https://expo.io/) account. Once you have an Expo account, and Expo is installed on your machine, simply run:

npm install
expo start

