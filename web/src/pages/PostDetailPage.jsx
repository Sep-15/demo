import { useState, useEffect } from 'react';
import { getPostByIdApi } from '../api';
import { useParams } from 'react-router-dom';
import { PostItem } from '../components/PostItem';
import { CommentList } from '../components/CommentList';
import { useUserSidebar } from '../hooks/useUserSidebar';

// File: src/pages/PostDetailPage.jsx
const PostDetailPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showUser } = useUserSidebar();
  useEffect(() => {
    if (post?.author?.id) {
      showUser(post.author.id);
    }
  }, [post?.author?.id, showUser]);

  const fetchPost = async () => {
    try {
      const { data } = await getPostByIdApi(id);
      setPost(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    fetchPost();
  }, [id]);
  if (loading) return <div>Loading</div>;
  if (!post) return <div>post not found</div>;
  return (
    <div>
      <PostItem post={post} clickable={false} />
      <CommentList postId={post.id} comments={post.comments} onRefresh={fetchPost} />
    </div>
  );
};
export default PostDetailPage;
