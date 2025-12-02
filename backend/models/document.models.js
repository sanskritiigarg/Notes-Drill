import mongoose from 'mongoose';

const chunkSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  pageNumber: {
    type: Number,
    default: 0
  },
  chunkIndex: {
    type: Number,
    required: true
  }
});

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  extractedText: {
    type: String,
    default: ''
  },
  chunks: [chunkSchema],
  uploaddate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['processing', 'ready', 'failed'],
    default: 'processing'
  }
}, {timestamps: true});

documentSchema.index({userId: 1, uploadDate: -1});

const Document = mongoose.model('Document', documentSchema);
export default Document;