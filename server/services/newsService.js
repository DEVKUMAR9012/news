const crypto = require('crypto');
const mongoose = require('mongoose');
const axios = require('axios');
const News = require('../models/News');

// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 1000 * 60 * 120; // 2 hours — saves API quota

const getApiKey = () => process.env.GNEWS_API_KEY || '';
const BASE_URL = 'https://gnews.io/api/v4';

// ============================================
// REAL MOCK DATA — 20 rich articles
// ============================================
const MOCK_ARTICLES_RAW = [
  { title: 'OpenAI launches GPT-5', desc: 'Revolutionary AI model shows human-like reasoning and emotional intelligence', fullContent: 'OpenAI has unveiled GPT-5, its most advanced language model yet. The new system demonstrates remarkable reasoning abilities, scoring in the 90th percentile on the bar exam and showing human-level performance on complex coding tasks. Early tests show the model can write, debug, and optimize code across multiple programming languages. Industry experts call this a "quantum leap" in AI capabilities, with potential applications in healthcare, education, and scientific research. The model is being rolled out gradually to ensure safety and reliability.', category: 'AI', image: 'https://picsum.photos/id/1/400/250', date: 'April 24, 2026', author: 'Alex Chen', readTime: '5 min read' },
  { title: 'AI in healthcare breakthrough', desc: 'New diagnosis tool detects cancer with 99.9% accuracy, saving millions of lives', fullContent: 'Revolutionary AI-powered diagnostic tool developed by researchers at Stanford University can detect early-stage cancer from medical images with 99.9% accuracy. The system was trained on millions of scans and can identify subtle patterns invisible to the human eye. In clinical trials, it detected lung cancer up to two years earlier than traditional methods. The technology could dramatically improve survival rates and reduce healthcare costs. Regulatory approval is expected within months, with hospitals already expressing strong interest.', category: 'AI', image: 'https://picsum.photos/id/42/400/250', date: 'April 23, 2026', author: 'Casey Kim', readTime: '4 min read' },
  { title: 'Google DeepMind beats humans at mathematics', desc: "DeepMind's new system solves complex mathematical theorems never solved before", fullContent: "Google DeepMind has achieved a major breakthrough with an AI system capable of solving advanced mathematical problems, including proving new theorems that have stumped mathematicians for decades. The system, called AlphaProof, combines large language models with symbolic reasoning engines. Mathematicians are calling it a 'game-changer' that could accelerate research across all scientific fields. The AI discovered alternative proofs for several complex theorems and even suggested new mathematical conjectures for humans to explore.", category: 'AI', image: 'https://picsum.photos/id/20/400/250', date: 'April 22, 2026', author: 'Sarah Johnson', readTime: '6 min read' },
  { title: 'AI creates realistic virtual worlds', desc: 'New generative model builds interactive 3D environments from text descriptions', fullContent: 'A new AI system called WorldBuilder can generate fully interactive 3D worlds from simple text descriptions. The technology, developed by a team at UC Berkeley, creates realistic environments with physics, lighting, and object interactions in real-time. Game developers and filmmakers are already experimenting with the tool to rapidly prototype virtual sets and interactive simulations. The system could revolutionize how virtual content is created for entertainment, training simulations, and education platforms globally.', category: 'AI', image: 'https://picsum.photos/id/100/400/250', date: 'April 21, 2026', author: 'Mike Rodriguez', readTime: '5 min read' },
  { title: 'Global climate summit agreement', desc: '197 countries reach historic deal to phase out fossil fuels by 2050', fullContent: 'Over 190 world leaders have assembled in Berlin for the Emergency Climate Summit, aiming to accelerate global climate action. The summit comes after scientists issued a "code red" warning about accelerating climate change. Key topics include transitioning away from fossil fuels, climate finance for developing nations, and protecting biodiversity. Early negotiations show promise, with several major economies pledging to phase out coal by 2035. Activists are watching closely, demanding concrete action rather than promises from world governments.', category: 'World', image: 'https://picsum.photos/id/1015/400/250', date: 'April 24, 2026', author: 'Jamie Rodriguez', readTime: '4 min read' },
  { title: 'Earthquake in Japan', desc: '7.2 magnitude quake triggers tsunami warnings, evacuation underway', fullContent: "A powerful 7.2 magnitude earthquake struck off the coast of Fukushima, Japan, triggering tsunami warnings and evacuation orders for hundreds of thousands of residents. The quake shook buildings in Tokyo, over 200 miles away. Authorities issued immediate tsunami warnings for coastal areas, with waves expected up to 3 meters. Fortunately, Japan's strict building codes and robust disaster preparedness appear to have prevented major structural damage, though several injuries have been reported. Nuclear power plants in the region are operating normally, easing fears of a nuclear incident.", category: 'World', image: 'https://picsum.photos/id/1043/400/250', date: 'April 23, 2026', author: 'Riley Zhang', readTime: '3 min read' },
  { title: 'UN passes resolution on AI weapons', desc: 'Historic vote bans autonomous weapons systems without human control', fullContent: 'The United Nations General Assembly has passed a landmark resolution banning autonomous weapons systems that operate without meaningful human control. The vote was 158-0, with 12 abstentions from major military powers. The resolution establishes that humans must maintain authority over all decisions to use lethal force. Human rights groups hailed the decision as a crucial step to prevent a global arms race in AI-powered weapons. The agreement now moves to the Security Council for detailed implementation guidelines and enforcement mechanisms.', category: 'World', image: 'https://picsum.photos/id/114/400/250', date: 'April 22, 2026', author: 'Samuel Okafor', readTime: '4 min read' },
  { title: 'Apple Vision Pro 2 unveiled', desc: 'Revolutionary AR headset blends digital content seamlessly with the real world', fullContent: "Apple has officially unveiled Apple Vision Pro 2, marking the company's next major step into spatial computing. The lightweight headset overlays digital information seamlessly onto the real world, with gesture and voice controls. Features include real-time language translation, navigation overlays on actual streets, and immersive FaceTime calls where holograms appear before you. Priced at $2,499, they represent Apple's refined vision for mixed reality. Early reviews praise the revolutionary interface and significantly improved battery life compared to the original.", category: 'Technology', image: 'https://picsum.photos/id/0/400/250', date: 'April 24, 2026', author: 'Taylor Moore', readTime: '6 min read' },
  { title: 'Tesla robotaxi unveiled', desc: 'Fully autonomous Cybercab features no steering wheel or pedals', fullContent: 'Tesla has unveiled its long-awaited robotaxi, the "Cybercab," a fully autonomous vehicle with no steering wheel or pedals for a pure passenger experience. The futuristic vehicle can carry up to four passengers and features butterfly doors and a minimalist interior with a large entertainment screen. Elon Musk claims the vehicle will cost less than $30,000 and offer transportation at a cost of $0.20 per mile. The robotaxi network will allow Tesla owners to add their vehicles to a shared autonomous fleet when not in use, potentially generating significant passive income.', category: 'Technology', image: 'https://picsum.photos/id/15/400/250', date: 'April 23, 2026', author: 'Morgan Freeman', readTime: '5 min read' },
  { title: 'Quantum computing breakthrough', desc: 'Google achieves quantum supremacy with 1000-qubit processor', fullContent: 'Google has announced a major breakthrough in quantum computing, with its new Sycamore 2 processor performing calculations in seconds that would take classical supercomputers thousands of years to complete. The achievement marks a significant milestone in the race to build practical quantum computers for real-world applications. The technology could revolutionize fields from drug discovery to advanced cryptography. Industry experts call it a "historic moment" for computing, comparable to the invention of the transistor.', category: 'Technology', image: 'https://picsum.photos/id/119/400/250', date: 'April 22, 2026', author: 'Neha Patel', readTime: '4 min read' },
  { title: 'Champions League Final 2026', desc: 'Real Madrid vs Bayern Munich in epic finale at Wembley Stadium', fullContent: 'The UEFA Champions League final will feature a blockbuster clash between Real Madrid and Bayern Munich at Wembley Stadium, London. Both teams have overcome incredible odds to reach the final, with Real Madrid staging a dramatic comeback against Manchester City in the semi-finals, while Bayern defeated Paris Saint-Germain in a penalty shootout. This marks the fifth meeting between these European giants in the final, with both teams boasting a rich continental history. Key players include Jude Bellingham for Real and Harry Kane for Bayern in what promises to be an unforgettable evening of football.', category: 'Sports', image: 'https://picsum.photos/id/495/400/250', date: 'April 24, 2026', author: 'Sam Wilson', readTime: '3 min read' },
  { title: 'World Cup 2026 preparations complete', desc: '16 host cities ready for biggest tournament in football history with 48 teams', fullContent: 'With just weeks until the 2026 World Cup, host cities across North America are finalizing preparations for what promises to be the biggest football tournament in history. The expanded 48-team format will see matches played across 16 cities in the USA, Canada, and Mexico. Organizers expect record attendance of over 5 million fans and unprecedented global viewership. Security and infrastructure upgrades across all venues are nearly complete. The tournament is projected to generate over $5 billion in direct economic impact across all three host nations.', category: 'Sports', image: 'https://picsum.photos/id/305/400/250', date: 'April 23, 2026', author: 'Mike Johnson', readTime: '3 min read' },
  { title: 'NBA Finals: Lakers vs Celtics', desc: 'Historic 13th championship meeting between the two biggest NBA rivals', fullContent: "The NBA Finals will feature the Los Angeles Lakers against the Boston Celtics for the 13th time in league history, the most common Finals matchup in basketball. Both teams overcame tough conference opponents to reach the championship series. LeBron James, at age 41, continues to defy expectations and medical science, while Jayson Tatum leads a hungry young Celtics core with championship ambitions. The series promises to add another dramatic chapter to the league's greatest and most storied rivalry.", category: 'Sports', image: 'https://picsum.photos/id/128/400/250', date: 'April 22, 2026', author: 'Marcus Thompson', readTime: '4 min read' },
  { title: 'Stock markets hit all-time high', desc: 'Tech leads gains as AI boom drives Nasdaq to unprecedented record levels', fullContent: 'Global stock markets surged today as technology stocks led a broad rally driven by AI optimism and strong earnings reports. The Nasdaq composite jumped 2.5%, its best single day in three months, while the S&P 500 hit a new all-time high above 6,000 points. Nvidia and other AI-related chipmakers saw double-digit gains after announcing record quarterly earnings. Analysts attribute the rally to growing confidence in AI adoption across all industries and expectations of further rate cuts. The positive sentiment extended to Asian and European markets, which closed sharply higher.', category: 'Business', image: 'https://picsum.photos/id/20/400/250', date: 'April 24, 2026', author: 'Jordan Lee', readTime: '4 min read' },
  { title: 'Bitcoin reaches $120,000', desc: 'Cryptocurrency hits new all-time high as institutional adoption accelerates rapidly', fullContent: 'Bitcoin has reached $120,000 for the first time in its history, driven by massive institutional adoption and the overwhelming success of spot Bitcoin ETFs. Major corporations including Tesla and MicroStrategy hold significant Bitcoin reserves on their balance sheets. Several sovereign wealth funds have begun allocating portions of their portfolios to cryptocurrency as a hedge against inflation. Critics warn of volatility and regulatory risks, but growing institutional participation is seen as a maturing signal for the asset class.', category: 'Business', image: 'https://picsum.photos/id/136/400/250', date: 'April 23, 2026', author: 'Cathy Wood', readTime: '4 min read' },
  { title: 'US-China trade deal signed', desc: 'New comprehensive agreement reduces tariffs and opens technology markets', fullContent: 'The United States and China have reached a landmark comprehensive trade agreement that significantly reduces tariffs on hundreds of goods and opens previously restricted markets for technology products. The deal resolves several long-standing disputes around intellectual property protection and establishes new frameworks for cooperation. Business groups on both sides have welcomed the agreement as reducing uncertainty and restoring predictability. The deal could boost global trade significantly and help stabilize the world economy heading into the second half of the decade.', category: 'Business', image: 'https://picsum.photos/id/137/400/250', date: 'April 22, 2026', author: 'Janet Yellen', readTime: '4 min read' },
  { title: 'EV sales surpass gasoline cars in Europe', desc: 'Electric vehicles outsell traditional cars for the first time ever in history', fullContent: 'Electric vehicles have officially outsold traditional gasoline-powered cars in Europe for the first time ever, marking a truly historic shift in the automotive industry. The milestone comes as EV prices continue to fall dramatically and charging infrastructure expands rapidly across the continent. Major manufacturers including Volkswagen, BMW, and Stellantis are accelerating their EV production plans to meet unprecedented demand. The trend is expected to spread to other major regions as battery costs continue their steep decline.', category: 'Business', image: 'https://picsum.photos/id/139/400/250', date: 'April 21, 2026', author: 'Klaus Weber', readTime: '4 min read' },
  { title: 'Brain-computer interface milestone', desc: 'Paralyzed patient types 90 words per minute using only thoughts', fullContent: 'Neuralink has announced a groundbreaking milestone in brain-computer interface technology, with a paralyzed patient achieving unprecedented typing speeds of 90 words per minute using only their thoughts. The implant, surgically placed in the motor cortex, translates neural signals into precise digital commands with remarkable accuracy. The technology could restore communication and digital control for millions of people with severe paralysis worldwide. Researchers are now working on the next generation system, adding sensory feedback capabilities and enhanced mobility assistance features.', category: 'Technology', image: 'https://picsum.photos/id/123/400/250', date: 'April 20, 2026', author: 'Maria Santos', readTime: '5 min read' },
  { title: 'Nuclear fusion net energy gain sustained', desc: 'ITER reactor achieves sustained net energy gain for 30 consecutive minutes', fullContent: 'The ITER nuclear fusion project in southern France has achieved sustained net energy gain for 30 consecutive minutes, a major and potentially civilization-changing milestone toward practical fusion power. The reactor produced 1.5 times more energy than it consumed during the sustained run, maintaining the reaction through advanced magnetic confinement called a tokamak. If successfully scaled to commercial size, fusion could provide virtually unlimited clean energy with minimal waste. Commercial fusion power plants could potentially be operational by the 2040s, transforming global energy.', category: 'Technology', image: 'https://picsum.photos/id/125/400/250', date: 'April 19, 2026', author: 'Sophie Martin', readTime: '5 min read' },
  { title: 'Marathon world record shattered', desc: "Kelvin Kiptum runs 1:58:43, smashing the two-hour barrier officially in competition", fullContent: "Kenyan runner Kelvin Kiptum has shattered the marathon world record with an astonishing time of 1:58:43, becoming the first person to officially break the two-hour barrier in a record-eligible competition. The achievement was long thought scientifically impossible by leading sports physiologists. Scientists credit the perfect combination of advances in training methodology, nutritional science, and advanced carbon-fiber shoe technology. Kiptum celebrated with his home village in Kenya's Rift Valley as the entire athletics world celebrated a transcendent and historic athletic achievement.", category: 'Sports', image: 'https://picsum.photos/id/133/400/250', date: 'April 18, 2026', author: 'Eliud Kipchoge Jr', readTime: '4 min read' }
];

function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function mockIdFor(raw) {
  return crypto.createHash('sha256').update(raw.title).digest('hex').slice(0, 24);
}

function formatMockArticle(raw) {
  return {
    id: mockIdFor(raw),
    ...raw,
    sourceUrl: raw.sourceUrl || null
  };
}

function matchesMockFilter(raw, filter = {}) {
  if (!filter.category) return true;
  const categoryFilter = filter.category;
  if (categoryFilter.$regex instanceof RegExp) {
    return categoryFilter.$regex.test(raw.category);
  }
  return String(raw.category).toLowerCase() === String(categoryFilter).toLowerCase();
}

function getMockData(filter = {}) {
  return MOCK_ARTICLES_RAW
    .filter(raw => matchesMockFilter(raw, filter))
    .map(formatMockArticle);
}

/**
 * Seed mock data into MongoDB so every article gets a real _id.
 * Called once at startup / on first request.
 */
let seeded = false;
async function seedMockData() {
  if (seeded) return;
  if (!isMongoConnected()) return;
  seeded = true;
  try {
    for (const raw of MOCK_ARTICLES_RAW) {
      const exists = await News.findOne({ title: raw.title });
      if (!exists) {
        await News.create({
          ...raw,
          publishedAt: new Date()
        });
      }
    }
    console.log('✅ Mock news data seeded to MongoDB');
  } catch (err) {
    console.error('Seeding error:', err.message);
  }
}

/**
 * Get mock data from DB (so IDs are real MongoDB ObjectIds)
 */
async function getSeededMockData(filter = {}) {
  if (!isMongoConnected()) {
    return getMockData(filter);
  }

  await seedMockData();
  const query = Object.keys(filter).length > 0 ? filter : {};
  const docs = await News.find(query).sort({ publishedAt: -1 }).limit(30);
  return docs.map(formatDoc);
}

function formatDoc(a) {
  return {
    id: a._id.toString(),
    title: a.title,
    desc: a.desc,
    fullContent: a.fullContent,
    category: a.category,
    image: a.image,
    date: a.date,
    author: a.author,
    readTime: a.readTime,
    sourceUrl: a.sourceUrl || null
  };
}

/**
 * Fetch top headlines
 */
async function fetchTopHeadlines() {
  const cacheKey = 'top_headlines';

  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_TTL) return cached.data;
  }

  try {
    if (!getApiKey()) {
      console.warn('No GNEWS_API_KEY — using seeded mock data.');
      const data = await getSeededMockData();
      cache.set(cacheKey, { timestamp: Date.now(), data });
      return data;
    }

    const { data: json } = await axios.get(`${BASE_URL}/top-headlines`, {
      params: { category: 'general', lang: 'en', max: 20, apikey: getApiKey() },
      timeout: 8000
    });

    if (json.articles && json.articles.length > 0) {
      const formatted = await persistAndFormatArticles(json.articles, 'World');
      cache.set(cacheKey, { timestamp: Date.now(), data: formatted });
      return formatted;
    }
    throw new Error('Empty response from GNews');
  } catch (error) {
    if (error.response?.status === 429) {
      console.warn('⚠️ GNews rate limit hit — using cached/mock data.');
    } else {
      console.error('fetchTopHeadlines error:', error.message);
    }
    return await getSeededMockData();
  }
}

/**
 * Fetch news by category
 */
async function fetchNewsByCategory(category) {
  const cacheKey = `category_${category.toLowerCase()}`;

  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_TTL) return cached.data;
  }

  try {
    if (!getApiKey()) {
      const filter = { category: { $regex: new RegExp(`^${escapeRegExp(category)}$`, 'i') } };
      const data = await getSeededMockData(filter);
      cache.set(cacheKey, { timestamp: Date.now(), data });
      return data;
    }

    let gnewsCat = category.toLowerCase();
    if (gnewsCat === 'ai') gnewsCat = 'technology';

    const { data: json } = await axios.get(`${BASE_URL}/top-headlines`, {
      params: { category: gnewsCat, lang: 'en', max: 20, apikey: getApiKey() },
      timeout: 8000
    });

    if (json.articles && json.articles.length > 0) {
      const formatted = await persistAndFormatArticles(json.articles, category);
      cache.set(cacheKey, { timestamp: Date.now(), data: formatted });
      return formatted;
    }
    throw new Error('Empty category response');
  } catch (error) {
    if (error.response?.status === 429) {
      console.warn(`⚠️ GNews rate limit hit for [${category}] — using cached/mock data.`);
    } else {
      console.error(`fetchNewsByCategory(${category}) error:`, error.message);
    }
    const filter = { category: { $regex: new RegExp(`^${escapeRegExp(category)}$`, 'i') } };
    return await getSeededMockData(filter);
  }
}

/**
 * Persist real API articles to MongoDB and return formatted docs
 */
async function persistAndFormatArticles(articles, defaultCategory) {
  if (!isMongoConnected()) {
    return articles.map(item => formatMockArticle({
      title: item.title,
      desc: item.description || item.title,
      fullContent: item.content || item.description || 'Read the full article at the source.',
      category: defaultCategory,
      image: item.image || `https://picsum.photos/seed/${encodeURIComponent(item.title)}/400/250`,
      date: item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Today',
      author: item.source?.name || 'News Desk',
      readTime: Math.max(1, Math.ceil((item.content?.length || 800) / 1000)) + ' min read',
      sourceUrl: item.url || null
    }));
  }

  const formatted = [];

  for (const item of articles) {
    try {
      let doc = await News.findOne({ title: item.title });
      if (!doc) {
        doc = await News.create({
          title: item.title,
          desc: item.description || item.title,
          fullContent: item.content || item.description || 'Read the full article at the source.',
          category: defaultCategory,
          image: item.image || `https://picsum.photos/seed/${Date.now()}/400/250`,
          date: new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          author: item.source?.name || 'News Desk',
          readTime: Math.max(1, Math.ceil((item.content?.length || 800) / 1000)) + ' min read',
          sourceUrl: item.url,
          sourceName: item.source?.name,
          publishedAt: new Date(item.publishedAt)
        });
      }
      formatted.push(formatDoc(doc));
    } catch (err) {
      console.error('Error persisting article:', err.message);
    }
  }

  return formatted;
}

async function fetchArticleById(id) {
  // 1. Try in-memory cache first (works offline too)
  for (const [, cached] of cache) {
    if (cached.data && Array.isArray(cached.data)) {
      const found = cached.data.find(a => String(a.id) === String(id));
      if (found) return found;
    }
  }

  // 2. Try MongoDB if connected
  if (isMongoConnected()) {
    // Only query MongoDB for valid 24-char hex IDs
    if (/^[a-fA-F0-9]{24}$/.test(id)) {
      const article = await News.findById(id);
      if (article) return formatDoc(article);
    }
  }

  // 3. Fallback: check mock data (for seeded SHA256 IDs)
  return getMockData().find(article => String(article.id) === String(id)) || null;
}

async function searchArticles(query) {
  const q = String(query || '').trim();
  if (!q) return [];

  if (!isMongoConnected()) {
    const lower = q.toLowerCase();
    return getMockData().filter(article => (
      article.title.toLowerCase().includes(lower) ||
      article.desc.toLowerCase().includes(lower) ||
      article.category.toLowerCase().includes(lower) ||
      article.author.toLowerCase().includes(lower)
    )).slice(0, 20);
  }

  try {
    const docs = await News.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } }).limit(20);
    return docs.map(formatDoc);
  } catch (_) {
    const regex = new RegExp(escapeRegExp(q), 'i');
    const docs = await News.find({
      $or: [{ title: regex }, { desc: regex }, { category: regex }, { author: regex }]
    }).limit(20);
    return docs.map(formatDoc);
  }
}

// Seed on module load
seedMockData().catch(console.error);

module.exports = {
  fetchTopHeadlines,
  fetchNewsByCategory,
  fetchArticleById,
  searchArticles
};
