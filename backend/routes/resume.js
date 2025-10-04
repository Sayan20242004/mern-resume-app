const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');

router.post('/', resumeController.createResume);
router.get('/', resumeController.getAllResumes);
router.get('/:resumeId', resumeController.getResume);
router.put('/:resumeId', resumeController.updateResume);
router.post('/:resumeId/generate', resumeController.generateResumeAI);

module.exports = router;
