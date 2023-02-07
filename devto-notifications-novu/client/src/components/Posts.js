import React from "react";

const Posts = ({ posts, socket }) => {
	const postLiked = (id) => socket.emit("postLiked", id);

	return (
		<div className='articles__container'>
			{posts[0] && <h1>Recent Articles</h1>}
			{posts.length > 0 &&
				posts.map((post) => (
					<div className='article' key={post.id}>
						<h2>{post.title}</h2>

						<p className='article__content'>{post.content}</p>
						<div className='likeBtn__container'>
							<p className='likeBtn' onClick={() => postLiked(post.id)}>
								<span role='img' aria-label='like'>
									👍
								</span>
							</p>
							<p>{post.likes > 0 && post.likes}</p>
						</div>
					</div>
				))}
		</div>
	);
};

export default Posts;
