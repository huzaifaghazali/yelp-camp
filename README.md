# Yelp Camp

YelpCamp is a comprehensive web application designed for outdoor enthusiasts to discover, share, and explore their favorite campgrounds. With a robust set of features, this platform provides a seamless experience for users to immerse themselves in the world of camping.

## Pictures
1. 

   ![1_home](https://github.com/huzaifaghazali/yelp-camp/assets/63412385/50b6ccc3-6c3e-44a7-87e7-a05c4b612055)

2. 

   ![2_login](https://github.com/huzaifaghazali/yelp-camp/assets/63412385/de2478ef-dbcf-4c89-8dce-0750955b84a8)

3. 

   ![3_register](https://github.com/huzaifaghazali/yelp-camp/assets/63412385/e282a86a-9b92-480f-8a06-0e7a937d7c5e)

4. 

   ![4_map](https://github.com/huzaifaghazali/yelp-camp/assets/63412385/4f82f817-3935-4513-9d8c-adcb96501b18)
   
5.

  ![6_campground](https://github.com/huzaifaghazali/yelp-camp/assets/63412385/2d40df4b-8f07-4c35-b679-2c42121a3326)

6.
  
  ![7_new](https://github.com/huzaifaghazali/yelp-camp/assets/63412385/ed2db3a5-3bf3-4539-84fe-84417c1f202f)

7.

   ![8_edit](https://github.com/huzaifaghazali/yelp-camp/assets/63412385/808f137e-91ab-4efa-9e7f-b1be9cf4c9fb)

## Features

- **Campground Management**: Users can effortlessly create, update, and delete campgrounds, fostering a dynamic community-driven collection of camping destinations.

- **Vivid Imagery**: Integration with Cloudinary enables campers to vividly showcase their camping spots by uploading high-quality images that capture the essence of each location.

- **Thoughtful Reviews**: Campers can share their insights and experiences by leaving reviews for campgrounds, allowing others to make informed decisions about their next adventure.

- **Interactive Mapping**: Explore campgrounds geographically through an interactive map powered by the Mapbox SDK, enhancing the journey of discovering new locations.

- **Secure Authentication**: Experience a secure and personalized environment with user registration and login facilitated by Passport.js and enhanced by Passport Local Strategy.

## Technologies Utilized

- Node.js and Express.js form the backbone of the application, providing a robust and efficient server-side framework.

- MongoDB with Mongoose offers a flexible and scalable database solution to manage campground data.

- Cloudinary integration empowers users to seamlessly upload and display images, enriching the visual experience.

- Mapbox SDK adds an interactive mapping dimension, enriching the exploration of campgrounds.

- Input validation and security are ensured through libraries like Joi, Express Mongo Sanitize, and Helmet.

## Getting Started

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/huzaifaghazali/yelp-camp.git
   ```
2. **Navigate to the Directory**:
   ```bash
   cd yelpcamp
   ```
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Configuration**:
   ```bash
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   MAPBOX_TOKEN=your-mapbox-token
   SESSION_SECRET=your-session-secret
   MONGODB_URI=your-mongodb-uri
   ```
5. **Run the Application**:
   ```bash
   npm start
   ```
6. **Access the Application**:
   ```bash
   Open your browser and go to http://localhost:3000.
   ```

## Usage

1. **User Registration and Login**:
   Create a personalized account or log in securely to access the full suite of features.

2. **Discover Campgrounds**:
   Browse through a diverse collection of campgrounds, each accompanied by captivating images and informative reviews.

3. **Contribute and Explore**:
   Share your camping experiences by adding new campgrounds, uploading images, and leaving thoughtful reviews for fellow adventurers.

4. **Geographical Insights**:
   Immerse yourself in the interactive map, visualizing campground locations and planning your next excursion.

## Contribution

Contributions are welcomed! To report issues or contribute enhancements, please open an issue or submit a pull request.
