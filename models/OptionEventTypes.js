module.exports = function(sequelize, DataTypes) {
	return sequelize.define('OptionEventTypes', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		Name: {
			type: DataTypes.STRING(25),
			allowNull: false
		},
		IsActive: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: 1
		}
	}, {
		name:  {plural: "OptionEventTypes", singular: "OptionEventTypes"},
		freezeTableName: true,
		classMethods: {
			// associate: function(models){
			// 	this.hasMany(models.OptionEventCategories, { onDelete: 'cascade', hooks: true });
			// }
		}
		
	})
};