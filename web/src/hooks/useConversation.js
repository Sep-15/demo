import { useContext } from 'react';
import { ConversationContext } from '../contexts/GroupContext';

export const useConversation = () => useContext(ConversationContext);
