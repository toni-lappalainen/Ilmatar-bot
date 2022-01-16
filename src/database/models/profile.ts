import { Schema, model, Document, SchemaDefinition } from 'mongoose';

interface Profile {
	guildID: string;
	guildName: string;
	userID: string;
	username: string;
	joined: Date;
	exp: number;
	level: number;
	//	boosters: [{ name: String; time: String }];
}

/*interface ProfileBaseDocument extends Profile, Document {
	friends: Types.Array<string>;
	creditCards?: Types.Map<string>;
	fullName: string;
	getGender(): string;
}*/

// Export this for strong typing
//export interface UserDocument extends Profile, Document {}

const profileSchema = new Schema<Profile>(
	{
		guildID: String,
		guildName: String,
		userID: String,
		username: String,
		joined: { type: Date, default: Date.now },
		exp: {
			type: Number,
			default: 0,
		},
		level: {
			type: Number,
			default: 0,
		},
		//boosters: [{ name: String, time: String }],
	},
	{
		timestamps: true,
	}
);
const ProfileModel = model<Profile>('Profile', profileSchema);

export { ProfileModel, Profile };
