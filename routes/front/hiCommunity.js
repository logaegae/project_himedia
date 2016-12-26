var express = require('express');
var exRouter = express.Router();
var router = express.Router();
var models = require('service/models');
var async = require('async');
var role = require('service/role');

exRouter.use("/", router);

router.all("/:branchCode/review.html", function(req, res, next){

    var page = req.query.page ? parseInt(req.query.page) : 1;
	var pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;

    models.CourseReview.findAndCountAll({
        where : {
            delYn : 'N'
        },
        order : 'reviewId DESC',
		offset : (page-1)*pageSize,
		limit : pageSize,
        include : [{model : models.Branch, attributes : ['branchName']},{model : models.CourseField, attributes : ['fieldName']}]
    })
    .then(function (result) {
        res.locals.totalCount = result.count;
		res.locals.reviews = result.rows;
		res.locals.page = page;
		res.locals.pageSize = pageSize;
        next();
    })
    .catch(function (err) {
        process.nextTick(function () {throw err});
    });
});

router.all("/:branchCode/reviewWrite", function(req, res, next){
    var data = req.body;
    data.registDate = new Date();
    data.delYn = 'N';

    models.CourseReview.create(data)
    .then(function (result) {
        res.redirect("review.html");
    })
    .catch(function (err) {
        process.nextTick(function () {throw err});
    });
});

router.all("/:branchCode/commentDelete", function(req, res, next){
    var data = req.body;
    data.deleteDate = new Date();

    models.ToonComment.update(data,{
        where : {
            commentId : req.body.commentId,
            registUserId : req.body.deleteUserId
        }
    })
    .then(function (result) {
        if(result.length != 0){
            res.send({
                isSuccess: true
            });
        } else {
            res.send({
                isSuccess: false
            });
        }
    })
    .catch(function (err) {
        process.nextTick(function () {throw err});
    });
});

router.all("/:branchCode/haseolru.html", function(req, res, next){

    var page = req.query.page ? parseInt(req.query.page) : 1;
	var pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;

	models.Toon.findAndCountAll({
        where : {
			delYn : 'N',
            toonType: 'TOON_TYPE_HASULU'
		},
		order : 'toonId DESC',
		offset : (page-1)*pageSize,
		limit : pageSize
	})
	.then(function (result) {
		res.locals.totalCount = result.count;
		res.locals.toons = result.rows;
		res.locals.page = page;
		res.locals.pageSize = pageSize;
		next();
	})
    .catch(function (err) {
        process.nextTick(function () {throw err});
    });
});

router.all("/:branchCode/haseolruCommentWrite", function(req, res, next){
    var data = req.body;

    delete data.page;
    data.registDate = new Date();
    data.delYn = 'N';

    models.ToonComment.create(data)
    .then(function (result) {
        res.redirect("haseolruDetail.html?toonId="+req.body.toonId+"&page="+req.body.page);
    })
    .catch(function (err) {
        process.nextTick(function () {throw err});
    });
});

router.all("/:branchCode/haseolruDetail.html", function(req, res, next){

    var where = {
		delYn : 'N',
		toonId : req.query.toonId,
        toonType: 'TOON_TYPE_HASULU'
	};

    models.Toon.update({
        readCount : models.Sequelize.literal('readCount + 1')
    },{
        where:where
    })
    .then(function (result) {
        models.Toon.findOne({
            where : where,
            include: [{ model: models.ToonComment, where: {delYn : {$not : 'Y'}},required : false}]
        })
        .then(function (result1) {
			res.locals.toon = result1;

            var where2 = {
                delYn : 'N',
				toonId : {$gt : req.query.toonId},
                toonType: 'TOON_TYPE_HASULU'
			}
			models.Toon.findAll({
				where : where2,
				order : "toonId ASC",
				limit : 1
			})
			.then(function (result2) {
				if(result2[0]){
					res.locals.next = result2[0].toonId;
				}else{
					res.locals.next = null;
				}
				var where3 = {
                    delYn : 'N',
					toonId : {$lt : req.query.toonId},
                    toonType: 'TOON_TYPE_HASULU'
				}
				models.Toon.findAll({
					where : where3,
					order : "toonId DESC",
					limit : 1
				})
				.then(function (result3) {
					if(result3[0]){
						res.locals.prev = result3[0].toonId;
					}else{
						res.locals.prev = null;
					}
					next();
				})
				.catch(function (err) {
					process.nextTick(function () {throw err});
				});
			})
			.catch(function (err) {
				process.nextTick(function () {throw err});
			});
        })
		.catch(function (err) {
			process.nextTick(function () {throw err});
		});
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});
module.exports = exRouter;
