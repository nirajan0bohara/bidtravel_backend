// Advanced bid ranking using TF-IDF relevance + price + completeness
// NOTE: This adapts the user-provided algorithm to current data model field names.
// packageDetails currently stores: {...travelRequestSnapshot, agency: {id,name}, duration, notes}
// The provided sample algorithm expected fields additionalNotes, estimatedDuration, agencyName.
// We gracefully handle both naming variants to stay backward compatible.

let natural; // lazy require so tests / environments without the lib won't crash before install
try {
  natural = require("natural");
} catch (e) {
  // Fallback minimal shim if natural not yet installed (e.g. before dependency install)
  natural = {
    TfIdf: class {
      addDocument() {}
      listTerms() {
        return [];
      }
    },
  };
}

function safeNumber(val, def = 0) {
  const n = parseFloat(val);
  return Number.isFinite(n) ? n : def;
}

function tokenize(text) {
  return (
    (text || "")
      .toString()
      .toLowerCase()
      .match(/[a-z0-9]+/g) || []
  );
}

function buildVectorMap(tfidf, docIndex) {
  // natural's TfIdf stores documents; listTerms returns sorted by tf-idf weight
  if (!tfidf.listTerms) return new Map();
  const terms = tfidf.listTerms(docIndex) || [];
  const map = new Map();
  terms.forEach((t) => map.set(t.term, t.tfidf));
  return map;
}

function cosineSimilarityFromMaps(aMap, bMap) {
  // Union of terms
  const terms = new Set([...aMap.keys(), ...bMap.keys()]);
  let dot = 0;
  let aMag = 0;
  let bMag = 0;
  terms.forEach((term) => {
    const aVal = aMap.get(term) || 0;
    const bVal = bMap.get(term) || 0;
    dot += aVal * bVal;
    aMag += aVal * aVal;
    bMag += bVal * bVal;
  });
  if (aMag === 0 || bMag === 0) return 0;
  return dot / (Math.sqrt(aMag) * Math.sqrt(bMag));
}

function rankBids(bids, travelRequest) {
  if (!Array.isArray(bids) || bids.length === 0) return [];
  if (!travelRequest) return bids;

  const weights = { price: 0.5, completeness: 0.3, relevance: 0.2 };

  // Normalize price values (DECIMAL from Sequelize comes as string)
  const numericPrices = bids.map((b) => safeNumber(b.price));
  const minPrice = Math.min(...numericPrices);
  const maxPrice = Math.max(...numericPrices);

  const requestText = [
    travelRequest.from,
    travelRequest.destination,
    travelRequest.startDate,
    travelRequest.travelers,
    travelRequest.preferences,
  ]
    .filter(Boolean)
    .join(" ");

  // Build TF-IDF corpus: first document is the travel request, then each bid
  const TfIdf = natural.TfIdf;
  const tfidf = new TfIdf();
  tfidf.addDocument(requestText);

  const bidDocs = bids.map((bid) => {
    const pdRaw = bid.packageDetails;
    const packageDetails =
      typeof pdRaw === "string" ? safeJsonParse(pdRaw) : pdRaw || {};
    const notes = packageDetails.additionalNotes || packageDetails.notes || "";
    const duration =
      packageDetails.estimatedDuration || packageDetails.duration || "";
    const agencyName =
      packageDetails.agencyName ||
      packageDetails.agency?.name ||
      bid.name ||
      "";
    return [notes, duration, agencyName].filter(Boolean).join(" ");
  });
  bidDocs.forEach((doc) => tfidf.addDocument(doc));

  // Precompute vector map for request (index 0)
  const requestVec = buildVectorMap(tfidf, 0);

  const ranked = bids.map((bid, idx) => {
    const pdRaw = bid.packageDetails;
    const packageDetails =
      typeof pdRaw === "string" ? safeJsonParse(pdRaw) : pdRaw || {};
    const notes = (
      packageDetails.additionalNotes ||
      packageDetails.notes ||
      ""
    ).toString();
    const durationVal =
      parseInt(
        packageDetails.estimatedDuration || packageDetails.duration || 0,
        10
      ) || 0;
    const agencyName =
      packageDetails.agencyName ||
      packageDetails.agency?.name ||
      bid.name ||
      "";

    // Relevance via cosine similarity of TF-IDF vectors
    const bidVec = buildVectorMap(tfidf, idx + 1); // +1 because request is 0
    const similarity = cosineSimilarityFromMaps(requestVec, bidVec);
    const relevanceScore = Math.min(similarity * 10, 10); // scale 0-10

    // Price score (lower is better -> closer to 10)
    const priceNum = safeNumber(bid.price);
    const priceScore =
      maxPrice === minPrice
        ? 10
        : ((maxPrice - priceNum) / (maxPrice - minPrice)) * 10;

    // Completeness: based on presence of key fields & richness of notes
    const noteTokens = tokenize(notes);
    const baseCompleteness = 5; // baseline
    let bonus = 0;
    if (noteTokens.length > 5) bonus += 1;
    if (noteTokens.length > 15) bonus += 1;
    if (durationVal > 0) bonus += 1;
    if (agencyName) bonus += 1;
    // Additional small bonus for including destination in notes
    if (
      travelRequest.destination &&
      notes.toLowerCase().includes(travelRequest.destination.toLowerCase())
    ) {
      bonus += 1;
    }
    const completenessScore = Math.min(baseCompleteness + bonus, 10);

    const totalScore =
      priceScore * weights.price +
      completenessScore * weights.completeness +
      relevanceScore * weights.relevance;

    return {
      ...bid,
      score: Number(totalScore.toFixed(4)),
      relevanceScore: Number(relevanceScore.toFixed(4)),
      priceScore: Number(priceScore.toFixed(4)),
      completenessScore: Number(completenessScore.toFixed(4)),
    };
  });

  return ranked.sort((a, b) => b.score - a.score);
}

function safeJsonParse(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return {};
  }
}

module.exports = { rankBids };
