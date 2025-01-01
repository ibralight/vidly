const { Genre } = require("./models/genre");
const { Movie } = require("./models/movie");
const mongoose = require("mongoose");
const config = require("config");

const data = [
  {
    name: "Comedy",
    movies: [
      { title: "Airplane", numberInStock: 5, dailyRentalRate: 2 },
      { title: "The Hangover", numberInStock: 10, dailyRentalRate: 2 },
      { title: "Wedding Crashers", numberInStock: 15, dailyRentalRate: 2 },
    ],
  },
  {
    name: "Action",
    movies: [
      { title: "Die Hard", numberInStock: 5, dailyRentalRate: 2 },
      { title: "Terminator", numberInStock: 10, dailyRentalRate: 2 },
      { title: "The Avengers", numberInStock: 15, dailyRentalRate: 2 },
    ],
  },
  {
    name: "Romance",
    movies: [
      { title: "The Notebook", numberInStock: 5, dailyRentalRate: 2 },
      { title: "When Harry Met Sally", numberInStock: 10, dailyRentalRate: 2 },
      { title: "Pretty Woman", numberInStock: 15, dailyRentalRate: 2 },
    ],
  },
  {
    name: "Thriller",
    movies: [
      { title: "The Sixth Sense", numberInStock: 5, dailyRentalRate: 2 },
      { title: "Gone Girl", numberInStock: 10, dailyRentalRate: 2 },
      { title: "The Others", numberInStock: 15, dailyRentalRate: 2 },
    ],
  },
];

async function seed() {
  try {
    // Updated connection options
    await mongoose.connect(config.get("db"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
    });

    console.log("Connected to MongoDB...");

    // Clear existing data
    await Movie.deleteMany({});
    await Genre.deleteMany({});

    // Insert seed data
    for (let genre of data) {
      const { _id: genreId } = await new Genre({ name: genre.name }).save();
      const movies = genre.movies.map((movie) => ({
        ...movie,
        genre: { _id: genreId, name: genre.name },
      }));
      await Movie.insertMany(movies);
    }

    console.info("Data seeding completed successfully.");
  } catch (err) {
    console.error("Error occurred during seeding:", err.message);
  } finally {
    // Ensure connection is closed
    mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seed();
