var express = require('express');
var exRouter = express.Router();
var router = express.Router();  

var async = require('async');
var models = require('service/models');
var upload = require('service/upload');
var attach = require('service/attach');
var uuid = require('uuid');
var role = require('service/role');

exRouter.use("/admin/api/board", router);


router.all("/", role('admin'), function(req, res, next){


	var page = req.body.page ? parseInt(req.body.page) : 1;
	var pageSize = req.body.pageSize ? parseInt(req.body.pageSize) : 10;

	var where = {};
	if(req.body.groupId) {
		where.groupId = req.body.groupId;
	}
	if(req.body.searchText) {
		where.title = { $like: '%'+req.body.searchText+'%' };
	}
	if(req.body.branchCode) {
		where.branchCode = req.body.branchCode;
	}
	where.delYn = 'N';	

    models.Board.findAndCountAll({
    	where : where,
    	order : "registDate DESC",
    	offset : (page-1)*pageSize,
    	limit : pageSize,
    	include: [{ model: models.Branch, attributes : ['branchName'], required: true}]
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

});



router.all("/insert", role('admin'), function(req, res, next){

	console.log(req.body);
	var data = req.body;
	data.registDate = new Date();
	data.delYn = 'N';
	
    models.Board.create(data)
	.then(function (result) {
		res.end();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});



});






router.all("/insertComment", role('admin'), function(req, res, next){

	console.log(req.body);
	var data = req.body;
	data.registDate = new Date();
	data.delYn = 'N';
	
    models.BoardComment.create(data)
	.then(function (result) {
		res.end();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});



});



router.all("/updateComment", role('admin'), function(req, res, next){

	console.log(req.body);
	var data = req.body;
    models.BoardComment.update(data, {
    	where : {commentId : req.body.commentId}
    })
	.then(function (result) {
		res.end();		
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

});


router.all("/deleteComment", role('admin'),function(req, res, next){
    models.BoardComment.update({
    	delYn : 'Y',
    	deleteDate : new Date()
    },{
    	where : {commentId : req.body.commentId}
    })
	.then(function (result) {
		res.end();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});


router.all("/:boardId", role('admin'), function(req, res, next){

    models.Board.find({
    	where : {boardId : req.params.boardId},
    	include: {
    		model : models.BoardComment,
    		required: false,
    		where : {
    			delYn : 'N'
    		}
    	},
    	order : [[models.BoardComment, 'registDate', 'ASC']]
    })
	.then(function (result) {
		console.log(result);
		res.send(result);
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

});



router.all("/:boardId/update", role('admin'), function(req, res, next){

	console.log(req.body);
	var data = req.body;
    models.Board.update(data, {
    	where : {boardId : req.params.boardId}
    })
	.then(function (result) {
		res.end();		
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

});


router.all("/:boardId/delete", role('admin'),function(req, res, next){
    models.Board.update({
    	delYn : 'Y',
    	deleteDate : new Date()
    },{
    	where : {boardId : req.params.boardId}
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