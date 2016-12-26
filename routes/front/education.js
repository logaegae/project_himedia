var express = require('express');
var exRouter = express.Router();
var router = express.Router();
var models = require('service/models');
var async = require('async');

exRouter.use("/", router);

router.all("/:branchCode/general.html", function(req, res, next){
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
        next();
    })
    .catch(function (err) {
        process.nextTick(function () {throw err});
    });
});

router.all("/:branchCode/worker.html", function(req, res, next){
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
        next();
    })
    .catch(function (err) {
        process.nextTick(function () {throw err});
    });
});
router.all("/:branchCode/worker2.html", function(req, res, next){
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
        next();
    })
    .catch(function (err) {
        process.nextTick(function () {throw err});
    });
});

router.all("/:branchCode/courseMain.html", function(req, res, next){
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
		next();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});

router.all("/:branchCode/jobSeeker.html", function(req, res, next){
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
		next();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});

module.exports = exRouter;
