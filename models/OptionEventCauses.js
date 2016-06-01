module.exports = function(sequelize, DataTypes) {
	return sequelize.define('OptionEventCauses', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		OptionEventCategoriesId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'OptionEventCategories',
				key: 'id'
			}
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
		name:  {plural: "OptionEventCauses", singular: "OptionEventCauses"},
		freezeTableName: true,
		classMethods: {
			
		}
		
	})
};