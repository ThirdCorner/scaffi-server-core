import AbstractModel from '../../src/classes/abstract-model';

class ThirdNested extends AbstractModel {
	getModelStructure(){
		return {
			id: {
				type: this.getDataTypes().INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true
			},
			NestedTestId: {
				type: this.getDataTypes().INTEGER,
				allowNull: false,
				references: {
					model: 'NestedTest',
					key: 'id'
				}
			},
			Name: this.getDataTypes().STRING
		};
	}
	getModelOptions(){
		return {
			name:  {plural: "ThirdNested", singular: "ThirdNested"},
			freezeTableName: true,
			classMethods: {
				// associate: function(models){
				// 	this.hasMany(models.Route, { onDelete: 'cascade', hooks: true });
				// }
			}
			
		};
	}
}

export default new ThirdNested();

