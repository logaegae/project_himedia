var express = require('express');
var exRouter = express.Router();
var router = express.Router();  

var async = require('async');
var models = require('service/models');

exRouter.use("/admin/api", router);

/**
 * 관리자 로그인
 */
router.all("/login", function (req, res, next) {
	
	console.log(req.body);
	
	if(req.body.email == "admin" && req.body.password == "1234") {
		req.session.isAdmin = true;
		res.send({
			isSuccess : true
		});
	} else {
		res.send({
			isSuccess : false
		});
		
	}
	
});

/**
 * 관리자 로그아웃
 */
router.all("/logout", function (req, res, next) {
	req.session.isAdmin = false;
	res.redirect("/admin");
});



/**
 * 관리자 로그아웃
 */
router.all("/codes", function (req, res, next) {
	
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
			res.send({
				codes : codes,
				codeNames : codeNames
			});
		});
		
		
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
	
});






router.use(function (err, req, res, next) {
	res.status(500).send("error");
});

module.exports = exRouter;