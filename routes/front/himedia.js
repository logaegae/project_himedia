var express = require('express');
var exRouter = express.Router();
var router = express.Router();
var models = require('service/models');
var async = require('async');

exRouter.use("/", router);

router.all("/:branchCode/allTeacher.html", function(req, res, next){
    models.CourseField.findAll({
		where : {
			delYn : 'N',
			showYn : 'Y',
            teacherYn : 'Y'
		},
		include: [{ all: true, nested: true}]
	})
	.then(function (result) {
		res.locals.courseFields = result;
        var where2 = {
            delYn : 'N',
            showYn : 'Y'
        }
        if(req.query.field){
            where2.fieldId = req.query.field;
        }
        if(req.params.branchCode != 'himedia'){
            models.Teacher.findAll({
                where : where2,
                order : [['showOrder', 'ASC']],
                include: [models.AttachFile, models.CourseField,{ model : models.BranchTeacher, where:{ branchCode : req.params.branchCode} }]
            })
            .then(function (result2) {
                res.locals.teachers = result2;
                next();
            })
            .catch(function (err) {
                process.nextTick(function () {throw err});
            });
        }else{
            models.Teacher.findAll({
                where : where2,
                order : [['showOrder', 'ASC']],
                include: [models.AttachFile, models.CourseField, models.BranchTeacher]
            })
            .then(function (result2) {
                res.locals.teachers = result2;
                next();
            })
            .catch(function (err) {
                process.nextTick(function () {throw err});
            });
        }
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});

module.exports = exRouter;
