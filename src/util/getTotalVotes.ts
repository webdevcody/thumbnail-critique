import { Doc } from "../../convex/_generated/dataModel";

export function getTotalVotes(thumbnail: Doc<"thumbnails">) {
  const totalVotes = thumbnail.votes.reduce((acc, val) => acc + val, 0);
  return totalVotes;
}
