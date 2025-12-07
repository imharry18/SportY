// models/BidLog.js
import mongoose from 'mongoose';

const BidLogSchema = new mongoose.Schema({
  auctionId: { type: String, required: true }, // Which tournament?
  playerId: { type: String, required: true },  // Which player?
  teamId: { type: String, required: true },    // Who bid?
  teamName: { type: String },
  amount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Prevent recompilation of model in Next.js hot reload
export default mongoose.models.BidLog || mongoose.model('BidLog', BidLogSchema);