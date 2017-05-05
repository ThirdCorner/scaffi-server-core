import AbstractModel from '../../src/classes/abstract-model';

class NestedTest extends AbstractModel {
	getModelStructure(){
		return {
			id: {
				type: this.getDataTypes().INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true
			},
			TestId: {
				type: this.getDataTypes().INTEGER,
				allowNull: false,
				references: {
					model: 'Test',
					key: 'id'
				}
			},
			Name: this.getDataTypes().STRING
		};
	}
	getModelOptions(){
		return {
			name:  {plural: "NestedTest", singular: "NestedTest"},
			freezeTableName: true,
			classMethods: {
				// associate: function(models){
				// 	this.hasMany(models.Route, { onDelete: 'cascade', hooks: true });
				// }
			}
			
		};
	}
}

export default new NestedTest();