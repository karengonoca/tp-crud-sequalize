const path = require("path");
const moment = require('moment');
const db = require("../database/models");
const sequelize = db.sequelize;
const { Op } = require("sequelize");

//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;

const moviesController = {
  list: (req, res) => {
    db.Movie.findAll().then((movies) => {
      res.render("moviesList.ejs", { movies });
    });
  },
  detail: (req, res) => {
    db.Movie.findByPk(req.params.id).then((movie) => {
      res.render("moviesDetail.ejs", { movie });
    });
  },
  new: (req, res) => {
    db.Movie.findAll({
      order: [["release_date", "DESC"]],
      limit: 5,
    }).then((movies) => {
      res.render("newestMovies", { movies });
    });
  },
  recomended: (req, res) => {
    db.Movie.findAll({
      where: {
        rating: { [db.Sequelize.Op.gte]: 8 },
      },
      order: [["rating", "DESC"]],
    }).then((movies) => {
      res.render("recommendedMovies.ejs", { movies });
    });
  },
  //Aqui dispongo las rutas para trabajar con el CRUD
  add: function (req, res) {
    Genres.findAll({
        order : ['name']
    })
        .then(allGenres => {
           return res.render('moviesAdd', {allGenres})
        })
        .catch(error => console.log(error))
  },
  create: function (req, res) {
    const {title, rating, awards, length, release_date, genre_id} = req.body;
    Movies.create({
        title : title.trim(),
        rating,
        awards,
        release_date,
        length,
        genre_id

    }).then(movie => {
        console.log(movie)
        return res.redirect('/movies')
    }).catch(error => console.log(error))
  },
  edit: function (req, res) {
    let Movie = Movies.findByPk(req.params.id,{
      include : [
        {
          association : 'genre'
        }
      ]
    });
    let allGenres = Genres.findAll({
        order : ['name']
    });
   // console.log(Movie)
   //return res.send(Movie)

    Promise.all([Movie, allGenres])
        .then(([Movie, allGenres])=>{
           //return res.send(Movie)
           return res.render('moviesEdit', {
            Movie,
            allGenres,
            moment : moment
           })
        })
        .catch(error => console.log(error))
  },
  update: function (req, res) {
    //return res.send(req.body)
    const {title, rating, awards, length, release_date, genre_id} = req.body;
    Movies.update(
      {
        title : title.trim(),
        rating,
        awards,
        release_date,
        length,
        genre_id
      },
      {
        where: {
          id : req.params.id
        }
      }
    )
    .then(()=> res.redirect('/movies/detail/' + req.params.id))
    .catch(error=> console.log(error))
  },
  delete: function (req, res) {
    Movies.findByPk(req.params.id)
      .then((movie) => {
        res.render("moviesDelete.ejs", { movie });
      })
      .catch(error => console.log(error))
  },
  destroy: function (req, res) {
    Movies.destroy({
      where: {id: req.params.id}
  })
    .then(()=>{
      res.redirect('/movies')
    })
    .catch(error => console.log(error))
  }
};

module.exports = moviesController;
