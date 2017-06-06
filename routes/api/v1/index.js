const express = require('express');
const aws = require('aws-sdk');
const router = new express.Router();
const User = require('mongoose').model('User');

const app = express();

// ensure user is authenticated
const authCheck = require('../../../middleware/auth-check');

const S3_BUCKET = process.env.S3_BUCKET;

router.get('/sign-s3', authCheck, (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

// get full list of teachers
router.get('/teachers', (req,res) => {
  User.find()
    .then(teachers => {
      function teacherDetail(teacher) {
        return {
          _id: teacher._id,
          firstName: teacher.firstName,
          lastName: teacher.lastName,
          description: teacher.description,
          avatar: teacher.avatar,
        }
      };

      teachers = teachers.map(teacherDetail);
      res.json({
        teachers,
        message: "The teachers list has been successfully loaded."
      })
    })
});

module.exports = router;
