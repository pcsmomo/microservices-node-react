import mongoose from 'mongoose';
import { Password } from '../services/password';

// An interface that describes the properties
// that are required to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      // ret: the plain object representation which has been converted
      transform(_doc, ret) {
        // direct change to the ret object
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        // delete ret.__v;  // same as `versionKey: false`
      },
      versionKey: false,
    },
  }
);

// Hash the plain text password before saving
// Must use a function keyword to bind, not an arrow function
userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

// const user = User.build({
//   email: 'test@test.com',
//   password: '12345678',
// });
// user.email
// user.updatedAt

export { User };
