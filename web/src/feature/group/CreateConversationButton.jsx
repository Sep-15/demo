import { useNavigate } from 'react-router-dom';
import { createConversationApi } from '../../api';
import { useState } from 'react';

export const CreateConversationButton = ({
  isGroup = false,
  targetId,
  content = 'hi',
  name = 'new group',
  memberIds = [],
}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const onClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { data } = await createConversationApi({
        isGroup,
        targetId,
        content,
        name,
        memberIds,
      });
      navigate(`/conversations/${data.id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <button onClick={onClick} disabled={loading}>
      {loading ? 'Loading...' : '打招呼'}
    </button>
  );
};
