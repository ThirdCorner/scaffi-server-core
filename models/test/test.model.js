import AbstractModel from '../../src/classes/abstract-model';

class Test extends AbstractModel {
	getModelStructure(){
		return {
			id: {
				type: this.getDataTypes().INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true
			},
			Name: {
				type: this.getDataTypes().STRING,
				allowNull: false
			},
			Comments: this.getDataTypes().TEXT
		};
	}
	getModelOptions(){
		return {
			name:  {plural: "Test", singular: "Test"},
			freezeTableName: true,
			classMethods: {
				// associate: function(models){
				// 	this.hasMany(models.Route, { onDelete: 'cascade', hooks: true });
				// }
			}
					
		};
	}
}

export default new Test();
