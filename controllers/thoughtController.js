const { User, Thought } = require("../models");

module.exports = {
    getThoughts(req, res) {
        Thought.find({})
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err));
    },

    getThoughtById(req, res) {
        Thought.findById(req.params.thoughtId)
            .populate("reactions")
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: "No Thought found with this ID!" })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    createThought(req, res) {
        Thought.create(req.body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            })
            .then((thoughtdb) =>
                !thoughtdb
                    ? res.status(404).json({ message: "No User found with this ID!" })
                    : res.json(thoughtdb)
            )
            .catch((err) => res.status(500).json(err));
    },

    updateThought(req, res) {
        Thought.findByIdAndUpdate(
            req.params.thoughtId,
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: "No thought found with this ID!" })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    deleteThought(req, res) {
        Thought.findByIdAndDelete(req.params.thoughtId)
            .then((thought) => {
                if (!thought) {
                    return res.status(404).json({ message: "No thought found with this ID!" });
                }
                return User.findOneAndUpdate(
                    { thoughts: req.params.thoughtId },
                    { $pull: { thoughts: req.params.thoughtId } },
                    { new: true }
                );
            })
            .then((userdb) =>
                !userdb
                    ? res.status(404).json({ message: 'Thought deleted, but no user found' })
                    : res.json({ message: 'Thought successfully deleted' })
            )
            .catch((err) => res.status(500).json(err));
    },

    addReaction(req, res) {
        Thought.findByIdAndUpdate(
            req.params.thoughtId,
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: "No thought found with this ID!" })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    deleteReaction(req, res) {
        Thought.findByIdAndUpdate(
            req.params.thoughtId,
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: "No thought found with this ID!" })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
};
