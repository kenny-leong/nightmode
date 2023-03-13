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

![demo-user](https://user-images.githubusercontent.com/47682357/224593022-455cea22-ccbc-4056-86fa-3f6a81eb71a0.gif)


## Sign up a User:

* You will be able to sign up and automatically be redirected to the logged in page
* There are validations for signing up such as username length requirements, valid email address, password length, etc
* Passwords must be matching when entered twice or the signup button will be disabled
* Friendly reminders will display and signup will be blocked if fields are not properly filled out

![signup-user](https://user-images.githubusercontent.com/47682357/224593212-1e00b67e-1951-4226-86ed-0c269ba09a08.gif)



## User Login and Authentication:

* You are able to login as long as your credentials are stored within the database (hashed)
* If there are no matching credentials an error message is displayed
* Login button is disabled if there are null fields or if the amount of characters entered is not within the acceptable range

![user-login](https://user-images.githubusercontent.com/47682357/224592567-f3e790a8-12b7-4b55-a0b3-de3d46352162.gif)


## Create Your Own Listing:

* You will be able to create a listing by click on the "Create a Spot" button to the right of the navigation bar
* You must be logged in to create a listing
* Dynamic validations implemented so any fields that do not pass validations will have an error message appear above the field and require resubmission
* Upon successful creation you will be redirected to your new listing

![create-listing](https://user-images.githubusercontent.com/47682357/224597055-e0d5183e-135e-463b-a5e3-03594e618f03.gif)
![listing-validators](https://user-images.githubusercontent.com/47682357/224609987-83d3dabd-532e-4c5c-9a21-ef1c2a095427.gif)


## Update/Delete Your Own Listing(s)

* You will be able to see an owner action section to edit and delete your own listings
* You will not be able to see this section if you are not the owner for this listing

