
module.exports = function(app, router){
	router.get('/api/test2', (req, res, next)=>{
		throw new Error("tototo");
	});

}