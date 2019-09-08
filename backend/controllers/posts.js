const Post = require('../models/post');

// create post logic
exports.createPost = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        author: req.userData.userId
    });
    post.save()
    .then(createdPost => {
        res.status(201).send({
            message: 'Added Post Successfully',
            post: {
                ...createdPost,
                id: createdPost._id,
            }

        });
    })
    .catch(error => {
        res.status(500).json({ message: 'Unable to add the post! '})
    })
}

// update post logic
exports.updatePost = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if(req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + "/images/" + req.file.filename
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.connect,
        imagePath: imagePath,
        author: req.userData.userId
    })
    Post.updateOne({ _id: req.params.id, author: req.userData.userId }, post)
    .then(result => {
        if(result.n > 0 ) {
            res.status(200).json({ message: 'Post update Sucessful'});
        } else {
            res.status(401).json({ message: 'Failed to modify requested data due to auth issue'});
        }
    })
    .catch(error =>{
        res.status(500).json({ message: 'Unable to update the post!'})
    })
}

// get all post logic
exports.getAllPosts = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;

    if(pageSize && currentPage) {
        postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    postQuery.then((documents) => {
        console.log(documents)
        fetchedPosts = documents;

        return Post.countDocuments();
    }).then(count => {
        res.status(200).send({
            message: "Fetched posts succcessfully",
            posts: fetchedPosts,
            maxPosts: count
        });
    })
    .catch(error => {
        res.status(500).json({ message: 'Fetching post failed'});
    })
}

// get single post logic
exports.getSinglePost =  (req, res, next) => {
    Post.findById(req.params.id)
    .then((post) => {
        if(post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: 'Unable to find a post with the given id'});
        }
    })
    .catch(error => {
        res.status(500).json({ message: 'Fetching post failed'});
    })
}

// delete single post logic
exports.deletePost =  (req, res, next) => {
    Post.deleteOne({ _id: req.params.id, author: req.userData.userId })
    .then(result => {
        if(result.n > 0 ) {
            res.status(200).json({ message: 'Post deleted'});
        }else  {
            res.status(401).json({ message: 'Failed to delete requested data due to auth issue'});
        }
    })
    .catch(error => {
        res.status(500).json({ message: 'Unable to delete the post!'});
    })
}