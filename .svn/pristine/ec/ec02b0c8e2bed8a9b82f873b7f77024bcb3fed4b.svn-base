var express = require('express');
var exRouter = express.Router();
var router = express.Router();
var models = require('service/models');
var role = require('service/role');
var async = require('async');

exRouter.use("/", router);

router.all("/:branchCode/main.html", function(req, res, next){

    models.Popup.findAll({
		include: [{
			model : models.BranchPopup,
			where : {branchCode : req.params.branchCode}
		}, {model : models.AttachFile}],
		order : [[models.BranchPopup, 'showOrder', 'ASC']]
	})
	.then(function (popups) {
		res.locals.popups = popups;
		next();

	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

}, function(req,res,next){
    models.CourseField.findAll({
		where : {
			delYn : 'N',
			showYn : 'Y'
		},
		include: [{ all: true, nested: true}],
    	order : [['showOrder', 'ASC']]
	})
	.then(function (result) {
		res.locals.courseFields = result;
        res.locals.isMain = 1;
		models.Slide.findAll({
            where : {delYn : 'N'},
			include: [{
				model : models.BranchSlide,
				where : {branchCode : req.params.branchCode}
			}, {model : models.AttachFile}],
			order : [[models.BranchSlide, 'showOrder', 'ASC']]
		})
		.then(function (slides) {
			res.locals.slides = slides;
			next();

		})
		.catch(function (err) {
			process.nextTick(function () {throw err});
		});

	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
},function(req,res,next){
    var where = {
		delYn : 'N'
	};
    models.JobCondition.count({where:where})
	.then(function (result) {
		res.locals.employeeCount = result;
        next();
    })
    .catch(function (err) {
        process.nextTick(function () {throw err});
    });
},function(req,res,next){

    models.Branch.count()
	.then(function (result) {
		res.locals.campusCount = result;
        next();
    })
    .catch(function (err) {
        process.nextTick(function () {throw err});
    });
});

module.exports = exRouter;
