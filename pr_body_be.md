# PR: Voting Statistics Endpoint (Back-End)

## Technical Changes
- **MarketsService**:
  - Implemented `getVotingStats(marketId: string)` method.
  - Used TypeORM `createQueryBuilder` to aggregate `user_positions` grouped by `ngo_on_chain_id`.
  - Calculates `votes_count` (count of positions) and `total_amount` (sum of staked amounts) per NGO.
- **MarketsController**:
  - Added `GET /markets/:id/voting` endpoint to expose the voting statistics.

## Motivation
To support the new "Voting" tab in the front-end, providing transparency on how users are supporting different NGOs within a prediction market.

## Tests Performed
- Manual API testing via Swagger/Insomnia to verify the aggregation results.
- Verified correct grouping and data types in the response.
