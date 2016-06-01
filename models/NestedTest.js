
module.exports = function(sequelize, DataTypes) {
	return sequelize.define('NestedTest', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		TestId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Test',
				key: 'id'
			}
		},
		Name: DataTypes.STRING
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