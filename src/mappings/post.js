const mapPost = (post) => ({
  id: post.sys.id,
  title: post.fields.title,
  slug: post.fields.slug,
  image: post.fields.image,
  body: post.fields.body,
  video: post.fields.videoLink,
});

module.exports.mapPost = mapPost;
