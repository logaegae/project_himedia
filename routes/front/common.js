var express = require('express');
var exRouter = express.Router();
var router = express.Router();
var models = require('service/models');
var async = require('async');

exRouter.use("/", router);

/**
 * 공통 지점 정보 조회
 */
router.all("/*.html", function(req, res, next){

	if(req.originalUrl.indexOf("/admin") == 0) {
		next();
		return;
	}
	models.Branch.findAll({
		where : {
			delYn : 'N',
			showYn : 'Y'
		},
		include: [{ all: true, nested: true}],
    	order : [['showOrder', 'ASC'], [{model: models.AttachFile, as: 'AttachSets'}, 'showOrder', 'ASC']]
	})
	.then(function (result) {
		res.locals.branches = result;

		next();

	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

});

/**
 * 공통 코드정보 조회
 */
router.all("/*.html", function(req, res, next){

	models.CodeInfo.findAll({
		where : {delYn : 'N', codeGroup : 'GROUP'}
	})
	.then(function (result) {
		var codes = {};
		var codeNames = {};
		async.each(result, function (item, callback) {

			codes[item.codeId] = {};

			models.CodeInfo.findAll({
				where : {delYn : 'N', codeGroup : item.codeId}
			})
			.then(function (result2) {
				for(i=0;i<result2.length;i++) {
					codes[item.codeId][result2[i].codeId] = result2[i];
					codeNames[result2[i].codeId] = result2[i].codeName;
				}
				codes[item.codeId].list = result2;
				callback();
			})
			.catch(function (err) {
				process.nextTick(function () {throw err});
			});


		}, function () {
			res.locals.codes = codes;
			res.locals.codeNames = codeNames;
			next();
		});


	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});

module.exports = exRouter;
