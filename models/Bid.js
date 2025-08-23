// Bid model: stores a snapshot of the travel request details in packageDetails (JSON)

module.exports = (sequelize, DataTypes) => {
  const Bid = sequelize.define(
    "Bid",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // Foreign key to TravelRequest
      requestId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "TravelRequests", key: "id" },
        onDelete: "CASCADE",
      },

      // Foreign key to User (agency)
      agencyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE",
      },
      // NOTE: We removed separate agency JSON column; snapshot stored inside packageDetails

      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      packageDetails: {
        type: DataTypes.JSON,
        allowNull: false,
        comment:
          "Snapshot of travel request and offer-specific details (stored as JSON)",
      },

      status: {
        type: DataTypes.ENUM("pending", "accepted", "unselected"),
        defaultValue: "pending",
      },
    },

    {
      timestamps: true,
      paranoid: true,
      indexes: [
        { fields: ["requestId"] },
        { fields: ["agencyId"] },
        {
          name: "unique_bid_per_agency_request",
          unique: true,
          fields: ["requestId", "agencyId"],
        },
      ],
    }
  );

  Bid.associate = (models) => {
    Bid.belongsTo(models.TravelRequest, {
      foreignKey: "requestId",
      as: "TravelRequest",
    });
    // Alias as Agency to avoid confusion with TravelRequest's 'User' association
    Bid.belongsTo(models.User, { foreignKey: "agencyId", as: "Agency" });
  };

  return Bid;
};
