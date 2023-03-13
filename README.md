# nightmode.
Are you tired of being blinded by the blinding light of traditional vacation rental websites? Fear not, nightmode has your back! Inspired by the one and only Airbnb, Nightmode is your go-to dark knight for finding cozy homestays and exciting tourism activities. It's like having a virtual butler guiding you through the shadows of the best vacation spots. And the best part? No more squinting at your screen or feeling like a vampire in broad daylight! Nightmode's dark mode version will make your eyes feel like they're on vacation too. So sit back, relax, and let Nightmode take you to the dark side (in a good way).


[Click here to view nightmode's Live Site](https://abnb-clone.onrender.com/)


## Navigate to:

* [Feature List](https://github.com/kenny-leong/nightmode/wiki/Feature-List)
* [Database Schema](https://github.com/kenny-leong/nightmode/wiki/Database-Schema)
* [API Routes](https://github.com/kenny-leong/nightmode/wiki/API-Documentation)



## Technologies Used:

* Javascript
* PostgreSQL
* Sequelize
* Express
* React
* Redux

# Features:


## Demo User Implementation:

* Feel free to test the site features through clicking the "Demo User" button which will directly log you in

![homePageDemo](https://user-images.githubusercontent.com/47682357/224535845-c495c75e-37e2-4649-a753-9817eed637cb.gif)


## Sign up a User:

* You will be able to sign up and automatically be redirected to the logged in page
* There are validations for signing up such as username length requirements, valid email address, password length, etc
* Passwords must be matching when entered twice or the signup button will be disabled
* Friendly reminders will display and signup will be blocked if fields are not properly filled out

![signup-user](https://user-images.githubusercontent.com/47682357/224586952-e47bdfa5-0938-4657-81f7-cab875c67a44.gif)


## User Login and Authentication:

* You are able to login as long as your credentials are stored within the database (hashed)
* If there are no matching credentials an error message is displayed
* Login button is disabled if there are null fields or if the amount of characters entered is not within the acceptable range

![user-login](https://user-images.githubusercontent.com/47682357/224587830-6ec10140-8d6b-40a2-acab-ed65166adb81.gif)


## Create Your Own Listing:

* You will be able to create a listing by click on the "Create a spot" button to the right of the navigation bar




## Update/Delete Your Own Listing(s)

* You will be able to see an owner action section to edit and delete your own listings
* You will not be able to see this section if you are not the owner for this listing

