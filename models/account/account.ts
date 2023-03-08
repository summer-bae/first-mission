import mongoose from 'mongoose';

export interface accountType {
	_id: mongoose.Types.ObjectId,
	id: string,
	pw: string,
}

const schema = new mongoose.Schema({
	id: String,
	pw: String
});

export default mongoose.model('account', schema);