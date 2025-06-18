// module.exports = (sequelize, DataTypes) => {
//   const TravelRequest = sequelize.define('TravelRequest', {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true
//     },
//     details: {
//       type: DataTypes.JSON,
//       allowNull: false
//     },
//     status: {
//       type: DataTypes.ENUM('open', 'closed'),
//       defaultValue: 'open'
//     },

//     traveler_id:{
//         type:sequelize.INTEGER,
//         allowNull:false,  
//     },
//     destination:{
//         type:sequelize.STRING,
//         allowNull:false,  
//     },
//     travel_date:{
//         type:sequelize.DATE,
//         allowNull:false,  
//     },
//     num_peoples:{
//         type:sequelize.INTEGER,
//         allowNull:false,  
//     },
//     days:{
//         type:sequelize.INTEGER,
//         allowNull:false,  
//     },
//     status:{
//         type:sequelize.STRING,
//         allowNull:false,  
//     },
//     preferences:{
//         type:sequelize.STRING,
//         allowNull:false,  
//     },
//   });

//   TravelRequest.associate = (models) => {
//     TravelRequest.belongsTo(models.User, { foreignKey: 'userId' });
//     TravelRequest.hasMany(models.Bid, { foreignKey: 'requestId' });
//   };

//   return TravelRequest;
// };


module.exports = (sequelize, DataTypes) => {
  const TravelRequest = sequelize.define('TravelRequest', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    travelers: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    preferences: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('open', 'closed'),
      defaultValue: 'open'
    }
  }, {
    timestamps: true,
    paranoid: true
  });

  TravelRequest.associate = (models) => {
    TravelRequest.belongsTo(models.User, { foreignKey: 'userId' });
    TravelRequest.hasMany(models.Bid, { foreignKey: 'requestId' });
  };

  return TravelRequest;
};