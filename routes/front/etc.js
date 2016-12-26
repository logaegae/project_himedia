var express = require('express');
var exRouter = express.Router();
var router = express.Router();
var models = require('service/models');
var async = require('async');

exRouter.use("/", router);

router.all("/:branchCode/writeFranchise", function(req, res, next){
    var data = req.body;
    data.registDate = new Date();
    data.delYn = 'N';
    data.contactType = 'CONTACT_TYPE_FRANCHISE';
    delete data.url;

    models.Contact.create(data)
    .then(function(result) {
        res.send({isDone:true});
        next();
    })
    .catch(function(err) {
        process.nextTick(function() {
            throw err
        });
    });
});
router.all("/:branchCode/writeCooperate", function(req, res, next){
    var data = req.body;
    data.registDate = new Date();
    data.delYn = 'N';
    data.contactType = 'CONTACT_TYPE_ALLIANCE';
    delete data.url;

    models.Contact.create(data)
    .then(function(result) {
        res.send({isDone:true});
        next();
    })
    .catch(function(err) {
        process.nextTick(function() {
            throw err
        });
    });
});

module.exports = exRouter;
