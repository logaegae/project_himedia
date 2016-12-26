var express = require('express');
var exRouter = express.Router();
var router = express.Router();  

var async = require('async');
var models = require('service/models');
var upload = require('service/upload');
var attach = require('service/attach');
var uuid = require('uuid');
var role = require('service/role');

exRouter.use("/admin/api/teacher", router);


router.all("/", role('admin'), function(req, res, next){


	var page = req.body.page ? parseInt(req.body.page) : 1;
	var pageSize = req.body.pageSize ? parseInt(req.body.pageSize) : 10;
	
	var where = {};
	if(req.body.fieldId) {
		where.fieldId = req.body.fieldId;
	}
	if(req.body.searchText) {
		where.name = { $like: '%'+req.body.searchText+'%' };
	}
	where.delYn = 'N';
	
	console.log(req.body);
	var seqs = null;

	async.series([
              function (callback) {
            	  if(req.body.branchCodes && req.body.branchCodes.length > 0) {
	            		models.BranchTeacher.findAll({
	            			group: 'teacherSeq',
	            			where : {branchCode :  {$in : req.body.branchCodes}}
	            		})
	            		.then(function (result) {
	            			seqs = [];
	            			for(i=0;i<result.length;i++) {
	            				seqs.push(result[i].teacherSeq);
	            			}
	            			callback();
	            		})
	            		.catch(function (err) {
	            			process.nextTick(function () {throw err});
	            		});
            	  } else {
            		  callback();
            	  }            		
              }
	    ],
		function (err, results){
		
			if(seqs) {
				where.teacherSeq = {$in : seqs};
			}

		    models.Teacher.findAndCountAll({
		    	where : where,
		    	order : "showOrder ASC, registDate DESC",
		    	include : {model : models.BranchTeacher},
		    	distinct : true,
		    	offset : (page-1)*pageSize,
		    	limit : pageSize
			})
			.then(function (result) {

				res.send({
		    		totalCount : result.count,
		    		list : result.rows,
		    		currentPage : page
				});
				
			})
			.catch(function (err) {
				process.nextTick(function () {throw err});
			});



		}
	);
	


});



router.all("/insert", role('admin'), function(req, res, next){

	console.log(req.body);
	var data = req.body;
	data.registDate = new Date();
	data.delYn = 'N';
	
    models.Teacher.create(data)
	.then(function (result) {
		
		attach.registAttachData(data.AttachFile, function(err) {
			if(err) {
				process.nextTick(function () {throw err});
			} else{

				async.each(data.BranchTeachers, function(item, callback) {
				    models.BranchTeacher.create({
				    	branchCode : item.branchCode,
				    	teacherSeq : result.dataValues.teacherSeq
				    })
					.then(function (result2) {
						callback();
					})
					.catch(function (err) {
						process.nextTick(function () {throw err});
					});

					
				}, function(err) {
					if(err) {
						process.nextTick(function () {throw err});
						return;
					}
					res.end();
				});			
				
			}
		});
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});



});


router.all("/saveOrder", role('admin'), function(req, res, next){

	console.log(req.body);
	
	async.each(req.body, function (item, callback) {	
		item.showOrder = req.body.indexOf(item);
	    models.Teacher.update(item, {
	    	where : {teacherSeq : item.teacherSeq}
	    })
		.then(function (result) {
			callback();
		})
		.catch(function (err) {
			process.nextTick(function () {throw err});
		});	
	    
	}, function (err) {
		if(err) {
			process.nextTick(function () {throw err});
		}
		res.end();
	});


});


router.all("/:id", role('admin'), function(req, res, next){

    models.Teacher.find({
    	where : {teacherSeq : req.params.id},
    	include: [{ all: true, nested: true}]
    })
	.then(function (result) {
		res.send(result);
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

});




router.all("/:id/update", role('admin'), function(req, res, next){

	console.log(req.body);
	var data = req.body;
    models.Teacher.update(data, {
    	where : {teacherSeq : req.params.id}
    })
	.then(function (result) {
		
		attach.registAttachData(data.AttachFile, function(err) {
			if(err) {
				process.nextTick(function () {throw err});
			} else{
				
				models.BranchTeacher.destroy({where : {teacherSeq : req.params.id}})
				.then(function (result) {
					async.each(data.BranchTeachers, function(item, callback) {
						
					    models.BranchTeacher.create({
					    	branchCode : item.branchCode,
					    	teacherSeq : data.teacherSeq
					    })
						.then(function (result) {
							callback();
						})
						.catch(function (err) {
							process.nextTick(function () {throw err});
						});

						
					}, function(err) {
						if(err) {
							process.nextTick(function () {throw err});
							return;
						}
						res.end();
					});			
					
				})
				.catch(function (err) {
					process.nextTick(function () {throw err});
				});
				
			}
		});	
		

	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

});


router.all("/:id/delete", role('admin'),function(req, res, next){
    models.Teacher.update({
    	delYn : 'Y',
    	deleteDate : new Date()
    },{
    	where : {teacherSeq : req.params.id}
    })
	.then(function (result) {
		res.end();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});

router.use(function (err, req, res, next) {
	console.log(err);
	res.status(500).send("error");
});

module.exports = exRouter;