const router = require('express').Router();

const {
    getThoughts,
    getThoughtById,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction
} = require('../../controllers/thoughtController');

// Use .route() to define the base path for these routes
router.route('/')
    .get(getThoughts)  // Chain the .get() method
    .post(createThought);  // Chain the .post() method

router.route('/:id')
    .get(getThoughtById)  // Chain the .get() method
    .put(updateThought)  // Chain the .put() method
    .delete(deleteThought);  // Chain the .delete() method

router.route('/:thoughtId/reactions')
    .post(addReaction);  // Chain the .post() method

router.route('/:thoughtId/reactions/:reactionId')
    .delete(deleteReaction);  // Chain the .delete() method

module.exports = router;
