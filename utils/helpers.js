function rankBids(bids) {
  const weights = { price: 0.5, rating: 0.3, completeness: 0.2 };
  
  const minPrice = Math.min(...bids.map(b => b.price));
  const maxPrice = Math.max(...bids.map(b => b.price));
  
  return bids
    .map(bid => {
      const priceScore = maxPrice === minPrice ? 10 : ((maxPrice - bid.price) / (maxPrice - minPrice)) * 10;
      const ratingScore = bid.rating * 2; // Convert 5-scale to 10-scale
      const packageExtras = bid.packageDetails.split(',').length - 2; // Flights + Hotel = 2, extras beyond that
      const completenessScore = 5 + packageExtras; // Base + extras
      
      const totalScore = (priceScore * weights.price) +
                        (ratingScore * weights.rating) +
                        (completenessScore * weights.completeness);
      
      return { ...bid, score: totalScore };
    })
    .sort((a, b) => b.score - a.score);
}

module.exports = { rankBids };