import * as mongoo from 'mongoose'

export const DirectMessageSchema = new mongoo.Schema({
    roomID:             { type: String, required: true, index: true },
    senderId:           { type: String, required: true, index: true },
    senderFirstName:    { type: String, required: true, index: true },
    senderLastName:     { type: String, required: true, index: true },
    senderEmail:        { type: String, required: true, index: true },
    senderUserName:     { type: String, required: true, index: true },
    receiverId:         { type: String, required: true, index: true },
    receiverFirstName:  { type: String, required: true, index: true },
    receiverLastName:   { type: String, required: true, index: true },
    receiverEmail:      { type: String, required: true, index: true },
    receiverUserName:   { type: String, required: true, index: true },
    message:            { type: String, required: true, index: true },
    readBy:             [{ type: mongoo.Schema.Types.ObjectId, ref: 'Auth' }],
});

export interface DirectMessage extends mongoo.Document{
    roomId:             string;
    senderId:           string | number | null;
    senderFirstName:    string | null;
    senderLastName:     string | null;
    senderEmail:        string | null;
    senderUserName:     string | null;
    receiverId:         string | number | null;
    receiverFirstName:  string | null;
    receiverLastName:   string | null;
    receiverEmail:      string | null;
    receiverUserName:   string | null;
    message:            string;
    readBy?:            mongoo.Types.ObjectId[] | string[];
}