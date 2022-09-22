const db = require("../database/models");
const sequelize = db.sequelize;

const actorsController = {
  list: (req, res) => {
    db.Actor.findAll()
    .then((actors) => {
      res.render("actorsList.ejs", { actors });
    })
    .catch(error=> console.log(error))
  },
  detail: (req, res) => {
    db.Actor.findByPk(req.params.id, {
      include : [
        {
          association : 'movies'
        }
      ]
    })
    .then((actor) => {
      res.render("actorsDetail.ejs", {actor});
    })
    .catch(error=> console.log(error))
  }
};

module.exports = actorsController;
