require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

let prodMode = process.env.NODE_ENV === 'development' ? false : true;

const sequelize = new Sequelize(
  `sqlite://${prodMode ? 'prod' : 'dev'}DB.sqlite`,
  {
    logging: false,
  },
);

// Model definition
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  github_profile: DataTypes.STRING,
  profile_picture: DataTypes.STRING,
});
const Project = sequelize.define('Project', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: DataTypes.STRING,
  url: DataTypes.STRING,
  screenshot: DataTypes.STRING,
  thump_counter: DataTypes.INTEGER,
});

const Thought = sequelize.define('Thought', {
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  thumbs: {
    type: DataTypes.STRING,
  },
});
const Comment = sequelize.define('Comment', {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Model relations
User.hasOne(Project);
Project.belongsTo(User);
User.hasMany(Thought);
Thought.belongsTo(User);
Thought.hasMany(Comment);
User.hasMany(Comment);

const dbConnect = async () => {
  await sequelize
    .sync()
    .then(() => console.log('All models synced'))
    .catch(() => console.error('Failed syncing models to db'));
};

module.exports = { dbConnect, User, Project, Thought, Comment };
