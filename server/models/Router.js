import mongoose from 'mongoose';

const routerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  host: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  port: {
    type: Number,
    default: 8728,
  },
  identity: String,
  model: String,
  version: String,
  lastConnected: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Router = mongoose.model('Router', routerSchema);

export default Router;
