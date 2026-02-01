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

  // 使用项目主题颜色以保持风格一致
  const base = "inline-flex items-center justify-center rounded-full font-medium transition-all select-none";
  const size = "px-3 h-7 text-xs";
  const buttonStyle = "bg-(--paper-accent) text-white hover:bg-(--paper-accent)/90";
  const disabledStyle = "opacity-60 cursor-not-allowed";

  const className = [
    base,
    size,
    buttonStyle,
    loading && disabledStyle,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={className}
    >
      {loading ? 'Loading...' : '打招呼'}
    </button>
  );
};
