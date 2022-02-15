const { DEFAULT_EXPIRATION } = require("../config/config");
const Post = require("../models/postModel");

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();

    res.status(200).json({
      status: 'success',
      results: posts.length,
      data: {
        posts
      }
    })
  } catch (e) {
    res.status(400).json({
      status: `fail ${e}`,
    })
  }
}

exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        post
      }
    })
  } catch (e) {
    res.status(400).json({
      status: `fail ${e}`,
    })
  }
}

exports.createPost = async (req, res, next) => {
  try {
    const post = await Post.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        post
      }
    })
  } catch (e) {
    res.status(400).json({
      status: `fail ${e}`,
    })
  }
}

exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(201).json({
      status: 'success',
      data: {
        post
      }
    })
  } catch (e) {
    res.status(400).json({
      status: `fail ${e}`,
    })
  }
}

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
    })
  } catch (e) {
    res.status(400).json({
      status: `fail ${e}`,
    })
  }
}

exports.getPhotos("/photos", async (req, res) => {
  const albumId = req.query.albumId;
  const photos = await getOrSetCache(`photos?albumId=${albumId}`, async () => {
    const { data } = await axios.get("https://jsonplaceholder.typicode.com/photos",
    { params: { albumId } })
    return data
  })
  res.json(photos)
})

exports.getPhotos("/photos/:id", async (req, res) => {
  const photo = await getOrSetCache(`photos:${req.params.id}`, async () => {
    const { data } = await axios.get("https://jsonplaceholder.typicode.com/photos",
    { params: { albumId } })
    return data
  })
  res.json(photo)
})

const getOrSetCache = (key, callBack) => {
  return new Promise((resolve, reject) => {
    redisClient.get(key, async (error, data) => {
      if(error) return reject(error)
      if(data) return resolve(JSON.parse(data))
      const freshData = await callBack()
      redisClient.setex(key, DEFAULT_EXPIRATION, JSON.stringify(freshData))
      resolve(freshData)
    })
  })
}