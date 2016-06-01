
module.exports = function(sequelize, DataTypes) {
	return sequelize.define('ThirdNested', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		NestedTestId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'NestedTest',
				key: 'id'
			}
		},
		Name: DataTypes.STRING
	}, {
		name:  {plural: "ThirdNested", singular: "ThirdNested"},
		freezeTableName: true,
		classMethods: {
			// associate: function(models){
			// 	this.hasMany(models.Route, { onDelete: 'cascade', hooks: true });
			// }
		}
		
	})
};