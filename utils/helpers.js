function rankBids(bids, travelRequest) {
  const weights = { price: 0.6, completeness: 0.4 }; 
  
  const minPrice = Math.min(...bids.map(b => b.price));
  const maxPrice = Math.max(...bids.map(b => b.price));
  
  // Parse travel request features
  const requestFeatures = {
    destination: travelRequest.destination.toLowerCase(),
    startDate: travelRequest.startDate,
    travelers: travelRequest.travelers,
  };

  return bids
    .map(bid => {
      // Parse packageDetails 
      const packageDetails = JSON.parse(bid.packageDetails);
      const duration = parseInt(packageDetails.estimatedDuration, 10) || 0;
      const notes = packageDetails.additionalNotes?.toLowerCase() || '';

      // Content-based relevance score (0 to 10)
      let relevanceScore = 0;
      if (notes.includes(requestFeatures.destination)) relevanceScore += 4; 
      if (Math.abs(new Date(requestFeatures.startDate) - new Date()) / (1000 * 60 * 60 * 24) <= duration) relevanceScore += 3; // Date proximity
      if (packageDetails.agencyName && notes.length > 0) relevanceScore += 2; 
      relevanceScore = Math.min(relevanceScore, 10); 

      // Weighted sum scores
      const priceScore = maxPrice === minPrice ? 10 : ((maxPrice - bid.price) / (maxPrice - minPrice)) * 10;
      const packageExtras = (notes.split(',').length + duration) || 2; 
      const completenessScore = 5 + (packageExtras > 2 ? packageExtras - 2 : 0); 

      const totalScore = (priceScore * weights.price) +
                        (completenessScore * weights.completeness) +
                        (relevanceScore * 0.5); 

      return { ...bid, score: totalScore, relevanceScore };
    })
    .sort((a, b) => b.score - b.relevanceScore); 
}

module.exports = { rankBids };