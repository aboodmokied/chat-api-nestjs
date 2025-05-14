
export const extractChatName=(chat:any,userId:string)=>{
    let enrichedChats;
    if(Array.isArray(chat)){
         enrichedChats = chat.map(chat => {
            const otherUser = chat.users.find((user) =>user._id.toString() !== userId.toString());
            return {
            ...chat.toObject(),
            chatName: otherUser ? otherUser.name : 'Unknown',
            };
        });
    }else{
        const otherUser = chat.users.find((user) =>user._id.toString() !== userId.toString());
        enrichedChats={
                ...chat.toObject(),
                chatName: otherUser ? otherUser.name : 'Unknown',
            };
    }
    return enrichedChats;
};