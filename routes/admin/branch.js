var express = require('express');
var exRouter = express.Router();
var router = express.Router();  

var async = require('async');
var models = require('service/models');
var upload = require('service/upload');
var attach = require('service/attach');
var uuid = require('uuid');
var role = require('service/role');

exRouter.use("/admin/api/branch", router);


router.all("/", function(req, res, next){


	var page = req.body.page ? parseInt(req.body.page) : 1;
	var pageSize = req.body.pageSize ? parseInt(req.body.pageSize) : 10;
	

	async.series([
	    function(callback) {

			var where = [];
			if(req.body.searchText) {
				where = ['branchName like ?','%'+req.body.searchText+'%'];
			}
			models.Branch.count({
				where : where
			})
	    	.then(function (result) {
	    		callback(null, result);
	    	})
	    	.catch(function (err) {
	    		process.nextTick(function () {throw err});
	    	});

	    },
	    function(callback) {

			var where = [];
			if(req.body.searchText) {
				where = ['branchName like ?','%'+req.body.searchText+'%'];
			}

		    models.Branch.findAll({
		    	where : where,
		    	order : "showOrder ASC, registDate ASC",
		    	offset : (page-1)*pageSize,
		    	limit : pageSize
			})
	    	.then(function (result) {
	    		callback(null, result);
	    	})
	    	.catch(function (err) {
	    		process.nextTick(function () {throw err});
	    	});
	    }

	], function (err, result) {
		if(err) next(err);
		res.send({
			totalCount : result[0],
			list : result[1],
			currentPage : page
		});
	});


});



router.all("/insert", role('admin'), function(req, res, next){

	console.log(req.body);

	var data = req.body;
	data.registDate = new Date();

    models.Branch.create(data)
	.then(function (result) {
		
		attach.registAttachData({BranchBranchCode : data.branchCode}, data.AttachSets, function(err) {
			if(err) {
				process.nextTick(function () {throw err});
			} else{
				res.end();
			}
		});
		
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});



});

router.all("/:branchCode", role('admin'), function(req, res, next){

    models.Branch.find({
    	where : {branchCode : req.params.branchCode},
    	include: [{ all: true, nested: true}],
    	order : [[{model: models.AttachFile, as: 'AttachSets'}, 'showOrder', 'ASC']]
    })
	.then(function (result) {
		res.send(result);
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});




});




router.all("/:branchCode/update", role('admin'), function(req, res, next){

	console.log(req.body);

	var data = req.body;

    models.Branch.update(data, {
    	where : {branchCode : req.params.branchCode}
    })
	.then(function (result) {
		
		attach.registAttachData({BranchBranchCode : data.branchCode}, data.AttachSets, function(err) {
			if(err) {
				process.nextTick(function () {throw err});
			} else{
				res.end();
			}
		});

		
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

});


router.all("/:branchCode/delete", role('admin'),function(req, res, next){
    models.Branch.destroy({
    	where : {branchCode : req.params.branchCode}
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