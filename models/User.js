// const sequelize = require('sequelize');
// const DB  = require('../config/database');

// const User = DB.define('user',{
//     id:{
//         type:sequelize.INTEGER,
//         autoIncrement:true,
//         primaryKey:true,
//     },
//     name:{
//         type:sequelize.STRING,
//         allowNull:false,  
//     },
//     email:{
//         type:sequelize.STRING,
//         allowNull:false,  
//     },
//     password:{
//         type:sequelize.STRING,
//         allowNull:false,  
//     }
// })
// return User;
// module.exports = User;
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    credits: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    role: {
      type: DataTypes.ENUM('user', 'agency', 'admin'),
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    }
    ,
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {
    timestamps: true,
    paranoid: true
  });

  User.associate = (models) => {
    User.hasMany(models.TravelRequest, { foreignKey: 'userId' });
    User.hasMany(models.Bid, { foreignKey: 'agencyId' });
    User.hasMany(models.CreditTransaction, { foreignKey: 'agencyId' });
  };

  return User;
};