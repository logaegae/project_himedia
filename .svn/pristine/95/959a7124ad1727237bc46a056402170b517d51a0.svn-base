var express = require('express');
var exRouter = express.Router();
var router = express.Router();
var models = require('service/models');
var async = require('async');

exRouter.use("/", router);

router.all("/:branchCode/portfolio.html", function(req, res, next){

	var page = req.query.page ? parseInt(req.query.page) : 1;
	var pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 5;
	var where = {
		delYn : 'N',
		portfolioField : req.query.codeId
	}
	if(req.params.branchCode != 'himedia'){
		where.branchCode = req.params.branchCode;
	}
	models.Portfolio.findAndCountAll({
		where : where,
		distinct : true,
		include: [
			{ all: true, nested: true},
			{model : models.Branch, attributes : ['branchName']},
			{model : models.CodeInfo, attributes : ['codeName']}],
    	order : [['portfolioId', 'DESC'], [{model: models.AttachFile, as: 'AttachSets'}, 'showOrder', 'ASC']]
	})
	.then(function (result) {
		result.count == 0 ? res.locals.nodata = true : res.locals.nodata = false;
		res.locals.totalCount = result.count;
		res.locals.list = result.rows;
		res.locals.page = page;
		res.locals.pageSize = pageSize;

		next();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});

module.exports = exRouter;
