
module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Test', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		Namic: DataTypes.STRING,
		Comments: DataTypes.TEXT
	}, {
		name:  {plural: "Test", singular: "Test"},
		freezeTableName: true,
		classMethods: {
			// associate: function(models){
			// 	this.hasMany(models.Route, { onDelete: 'cascade', hooks: true });
			// }
		}

	})
};