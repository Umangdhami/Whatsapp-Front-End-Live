const initialState = {
  chatUserData: [],
  chatUser: [],
  chats: [],
  currentUser: null,
  chatUsers : []
};

const handleChat = (state = initialState, action) => {
  switch (action.type) {
    case 'chat-user':
      return {
        ...state,
        chatUserData: [...state.chatUserData, action.payload],
      };

    case 'user':
      return {
        ...state,
        chatUser: action.payload,
      };

    case 'chats':

      return {
        ...state,
        chats: action.payload,
      };

    case 'chatMessage':
      return {
        ...state,
        chats: [...state.chats, action.payload],
      };

    case 'currentUser':

      return {
        ...state,
        currentUser: action.payload
      }

      case 'chatUsers':

      return {
        ...state,
        chatUsers: action.payload
      }
      
    default:
      return state;
  }
};

export default handleChat;