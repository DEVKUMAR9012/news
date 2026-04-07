// js/script.js - COMPLETE FIXED VERSION

document.addEventListener('DOMContentLoaded', () => {
  // ============================================
  // STATIC NEWS DATA - 45+ articles
  // ============================================
  const newsData = [
    { id: 1, title: 'OpenAI launches GPT-5', desc: 'Revolutionary AI model shows human-like reasoning and emotional intelligence', fullContent: 'OpenAI has unveiled GPT-5, its most advanced language model yet. The new system demonstrates remarkable reasoning abilities, scoring in the 90th percentile on the bar exam and showing human-level performance on complex coding tasks. Early tests show the model can write, debug, and optimize code across multiple programming languages. Industry experts call this a "quantum leap" in AI capabilities, with potential applications in healthcare, education, and scientific research. The model is being rolled out gradually to ensure safety and reliability.', category: 'AI', image: 'https://picsum.photos/id/1/400/250', date: 'March 6, 2026', author: 'Alex Chen', readTime: '5 min read' },
    { id: 2, title: 'AI in healthcare breakthrough', desc: 'New diagnosis tool detects cancer with 99.9% accuracy, saving millions of lives', fullContent: 'Revolutionary AI-powered diagnostic tool developed by researchers at Stanford University can detect early-stage cancer from medical images with 99.9% accuracy. The system was trained on millions of scans and can identify subtle patterns invisible to the human eye. In clinical trials, it detected lung cancer up to two years earlier than traditional methods. The technology could dramatically improve survival rates and reduce healthcare costs. Regulatory approval is expected within months, with hospitals already expressing interest.', category: 'AI', image: 'https://picsum.photos/id/42/400/250', date: 'March 5, 2026', author: 'Casey Kim', readTime: '4 min read' },
    { id: 3, title: 'Google AI beats humans at mathematics', desc: "DeepMind's new system solves complex mathematical theorems never solved before", fullContent: "Google DeepMind has achieved a major breakthrough with an AI system capable of solving advanced mathematical problems, including proving new theorems. The system, called AlphaProof, combines language models with symbolic reasoning engines. Mathematicians are calling it a 'game-changer' that could accelerate research across all scientific fields. The AI discovered alternative proofs for several complex theorems and even suggested new mathematical conjectures for humans to explore.", category: 'AI', image: 'https://picsum.photos/id/20/400/250', date: 'March 4, 2026', author: 'Sarah Johnson', readTime: '6 min read' },
    { id: 4, title: 'AI creates realistic virtual worlds', desc: 'New generative model builds interactive 3D environments from text descriptions', fullContent: 'A new AI system called WorldBuilder can generate fully interactive 3D worlds from simple text descriptions. The technology, developed by a team at UC Berkeley, creates realistic environments with physics, lighting, and object interactions. Game developers and filmmakers are already experimenting with the tool to rapidly prototype virtual sets. The system could revolutionize how virtual content is created for entertainment, training, and education.', category: 'AI', image: 'https://picsum.photos/id/100/400/250', date: 'March 3, 2026', author: 'Mike Rodriguez', readTime: '5 min read' },
    { id: 5, title: 'AI ethics guidelines released', desc: 'Global coalition establishes first international framework for AI development', fullContent: 'A coalition of 50 countries has released the first international framework for ethical AI development. The guidelines address transparency, accountability, and human rights protections in AI systems. Tech companies have welcomed the clarity, though some critics argue the framework lacks enforcement mechanisms. The agreement marks a significant step toward global cooperation on AI governance as the technology becomes increasingly powerful.', category: 'AI', image: 'https://picsum.photos/id/104/400/250', date: 'March 2, 2026', author: 'Elena Martinez', readTime: '4 min read' },
    { id: 6, title: 'AI robots learn from each other', desc: 'Fleet of robots shares learning instantly through cloud-based neural network', fullContent: 'A breakthrough in distributed AI allows robots to share learning experiences instantly. When one robot learns a new task, all connected robots gain that knowledge immediately. The system, developed by Boston Dynamics in partnership with OpenAI, has been tested on manufacturing and warehouse robots. This collective learning approach could accelerate automation across industries and lead to more capable robotic systems.', category: 'AI', image: 'https://picsum.photos/id/107/400/250', date: 'March 1, 2026', author: 'David Park', readTime: '5 min read' },
    { id: 7, title: 'AI predicts weather with 95% accuracy', desc: 'New model outperforms traditional forecasting methods for extreme events', fullContent: 'An AI weather prediction system developed by Huawei has achieved 95% accuracy in forecasting extreme weather events up to 10 days in advance. The model, trained on 40 years of historical weather data, can predict hurricane paths and rainfall intensity with unprecedented precision. Meteorologists say the technology could save lives by providing earlier warnings for floods, storms, and heatwaves.', category: 'AI', image: 'https://picsum.photos/id/111/400/250', date: 'February 28, 2026', author: 'Lisa Wong', readTime: '4 min read' },
    { id: 8, title: 'AI creates personalized learning', desc: "Adaptive education platform tailors curriculum to each student's learning style", fullContent: 'An AI-powered education platform is revolutionizing how students learn by adapting in real-time to individual needs. The system, called LearnSmart, analyzes student responses and adjusts difficulty, pacing, and teaching style accordingly. Early trials in 500 schools showed a 40% improvement in test scores and increased student engagement. The platform could help address learning gaps exacerbated by the pandemic.', category: 'AI', image: 'https://picsum.photos/id/112/400/250', date: 'February 27, 2026', author: 'James Wilson', readTime: '5 min read' },
    { id: 9, title: 'AI discovers new antibiotics', desc: 'Machine learning identifies compounds effective against drug-resistant bacteria', fullContent: 'Researchers at MIT have used AI to discover new antibiotics capable of killing drug-resistant bacteria. The AI analyzed millions of chemical compounds and identified several promising candidates that were subsequently tested in the lab. One compound showed particular effectiveness against MRSA, a dangerous antibiotic-resistant bacteria. The breakthrough could help address the growing crisis of antimicrobial resistance.', category: 'AI', image: 'https://picsum.photos/id/113/400/250', date: 'February 26, 2026', author: 'Priya Patel', readTime: '5 min read' },
    { id: 10, title: 'Global climate summit agreement', desc: '197 countries reach historic deal to phase out fossil fuels by 2050', fullContent: 'Over 190 world leaders have assembled in Berlin for the Emergency Climate Summit, aiming to accelerate global climate action. The summit comes after scientists issued a "code red" warning about accelerating climate change. Key topics include transitioning away from fossil fuels, climate finance for developing nations, and protecting biodiversity. Early negotiations show promise, with several major economies pledging to phase out coal by 2035. Activists are watching closely, demanding concrete action rather than promises.', category: 'World', image: 'https://picsum.photos/id/1015/400/250', date: 'March 5, 2026', author: 'Jamie Rodriguez', readTime: '4 min read' },
    { id: 11, title: 'Earthquake in Japan', desc: '7.2 magnitude quake triggers tsunami warnings, evacuation underway', fullContent: "A powerful 7.2 magnitude earthquake struck off the coast of Fukushima, Japan, triggering tsunami warnings and evacuation orders. The quake shook buildings in Tokyo, over 200 miles away. Authorities issued immediate tsunami warnings for coastal areas, with waves expected up to 3 meters. Fortunately, Japan's strict building codes and disaster preparedness appear to have prevented major damage, though several injuries have been reported. Nuclear power plants in the region are operating normally, easing fears of a Fukushima repeat.", category: 'World', image: 'https://picsum.photos/id/1043/400/250', date: 'March 2, 2026', author: 'Riley Zhang', readTime: '3 min read' },
    { id: 12, title: 'UN passes resolution on AI weapons', desc: 'Historic vote bans autonomous weapons systems without human control', fullContent: 'The United Nations General Assembly has passed a landmark resolution banning autonomous weapons systems that operate without meaningful human control. The vote was 158-0, with 12 abstentions. The resolution establishes that humans must maintain authority over decisions to use force. Human rights groups hailed the decision as a crucial step to prevent a global arms race in AI weapons. The agreement now moves to the Security Council for implementation details.', category: 'World', image: 'https://picsum.photos/id/114/400/250', date: 'March 1, 2026', author: 'Samuel Okafor', readTime: '4 min read' },
    { id: 13, title: 'Peace talks in Middle East', desc: 'Historic negotiations between regional powers brokered by Egypt and Jordan', fullContent: 'Regional powers have begun historic peace talks in Cairo, with Egypt and Jordan serving as mediators. The negotiations aim to resolve decades-old conflicts and establish diplomatic relations. Early signs are promising, with both sides expressing willingness to compromise on key issues. International observers note that economic pressures and changing regional dynamics have created new incentives for peace.', category: 'World', image: 'https://picsum.photos/id/115/400/250', date: 'February 28, 2026', author: 'Layla Hassan', readTime: '5 min read' },
    { id: 14, title: 'European Union expands', desc: 'Six new countries begin accession process, largest expansion in decades', fullContent: "The European Union has begun accession negotiations with six new countries, marking the bloc's largest expansion since 2004. Ukraine, Moldova, and four Western Balkan nations are now on the path to membership. The move represents a strategic shift in response to geopolitical tensions. Existing members are debating reforms to EU governance to accommodate the expansion.", category: 'World', image: 'https://picsum.photos/id/116/400/250', date: 'February 27, 2026', author: 'Klaus Weber', readTime: '4 min read' },
    { id: 15, title: 'Amazon rainforest protection', desc: 'Eight South American nations pledge to end deforestation by 2030', fullContent: 'Eight South American countries have signed a landmark agreement to protect the Amazon rainforest, pledging to end deforestation by 2030. The Amazon Summit in Belem, Brazil, produced commitments for coordinated action against illegal logging and mining. Indigenous leaders played a key role in shaping the agreement. The pact includes a fund for sustainable development and conservation efforts.', category: 'World', image: 'https://picsum.photos/id/117/400/250', date: 'February 26, 2026', author: 'Carlos Mendez', readTime: '4 min read' },
    { id: 16, title: 'Global poverty reaches record low', desc: 'World Bank reports extreme poverty falls below 5% for first time in history', fullContent: 'The World Bank has announced that global extreme poverty has fallen below 5% for the first time in recorded history. The milestone is attributed to economic growth in Asia and Africa, along with improved social safety nets. However, officials caution that climate change and conflict could reverse progress. The announcement comes as the UN reviews progress toward Sustainable Development Goals.', category: 'World', image: 'https://picsum.photos/id/118/400/250', date: 'February 25, 2026', author: 'Grace Akinjide', readTime: '3 min read' },
    { id: 17, title: 'Arctic ice reaches record low', desc: 'Scientists warn of "last warning" as summer ice coverage shrinks dramatically', fullContent: 'Arctic sea ice coverage has reached its lowest level ever recorded for February, alarming climate scientists. The dramatic reduction could accelerate global warming and disrupt weather patterns worldwide. Researchers warn that the Arctic could see ice-free summers within a decade, much earlier than previously predicted. The findings underscore the urgency of climate action ahead of upcoming negotiations.', category: 'World', image: 'https://picsum.photos/id/119/400/250', date: 'February 24, 2026', author: 'Erik Johansen', readTime: '4 min read' },
    { id: 18, title: 'Space station international crew', desc: 'Record 16 astronauts from 12 countries aboard ISS for joint mission', fullContent: 'The International Space Station now hosts a record 16 astronauts from 12 different countries, the most diverse crew in history. The multinational mission includes experiments in medicine, materials science, and astronomy. Crew members include the first astronaut from Kenya and the second from Vietnam. The mission demonstrates continued international cooperation in space despite tensions on Earth.', category: 'World', image: 'https://picsum.photos/id/120/400/250', date: 'February 23, 2026', author: 'Anita Desai', readTime: '4 min read' },
    { id: 19, title: 'Apple Glasses announced', desc: 'Revolutionary AR headset blends digital content seamlessly with the real world', fullContent: "Apple has officially unveiled its long-rumored AR glasses, marking the company's first major new product category since the Apple Watch. The lightweight glasses overlay digital information seamlessly onto the real world, with gesture and voice controls. Features include real-time translation, navigation arrows on actual streets, and immersive FaceTime calls where holograms appear before you. Priced at $2,999, they represent Apple's vision for spatial computing. Early reviews praise the revolutionary interface but note the premium price tag.", category: 'Technology', image: 'https://picsum.photos/id/0/400/250', date: 'March 6, 2026', author: 'Taylor Swift', readTime: '6 min read' },
    { id: 20, title: 'Tesla robotaxi unveiled', desc: 'Fully autonomous Cybercab features no steering wheel or pedals', fullContent: 'Tesla has unveiled its long-awaited robotaxi, the "Cybercab," a fully autonomous vehicle with no steering wheel or pedals. The futuristic vehicle can carry up to four passengers and features butterfly doors and a minimalist interior with a large entertainment screen. Elon Musk claims the vehicle will cost less than $30,000 and offer transportation at a cost of $0.20 per mile. The robotaxi network will allow Tesla owners to add their vehicles to a shared autonomous fleet when not in use, potentially generating income.', category: 'Technology', image: 'https://picsum.photos/id/15/400/250', date: 'March 6, 2026', author: 'Morgan Freeman', readTime: '5 min read' },
    { id: 21, title: 'Quantum computing breakthrough', desc: 'Google achieves quantum supremacy with 1000-qubit processor', fullContent: 'Google has announced a major breakthrough in quantum computing, with its new Sycamore processor performing calculations in seconds that would take classical supercomputers thousands of years. The achievement marks a significant milestone in the race to build practical quantum computers. The technology could revolutionize fields from drug discovery to cryptography. Industry experts call it a "historic moment" for computing.', category: 'Technology', image: 'https://picsum.photos/id/119/400/250', date: 'March 1, 2026', author: 'Neha Patel', readTime: '4 min read' },
    { id: 22, title: 'Samsung unveils rollable phone', desc: 'Display expands from 6 to 10 inches at the touch of a button', fullContent: 'Samsung has demonstrated a prototype smartphone with a rollable display that expands from 6 inches to 10 inches. The device rolls out like a scroll, providing tablet-sized screen real estate when needed. The technology uses a flexible OLED panel and a new motorized mechanism. Analysts predict rollable devices could replace both phones and tablets within five years.', category: 'Technology', image: 'https://picsum.photos/id/121/400/250', date: 'February 28, 2026', author: 'Kim Soo-jin', readTime: '4 min read' },
    { id: 23, title: 'Internet from space expands', desc: "Starlink now covers 90% of Earth's surface, connecting remote areas", fullContent: "SpaceX's Starlink satellite internet service now provides coverage to 90% of Earth's surface, including previously unconnected regions. The constellation of over 12,000 satellites delivers high-speed internet to remote villages, ships at sea, and polar research stations. Competitors including Amazon and OneWeb are racing to deploy similar networks. The expansion raises concerns about space debris and light pollution.", category: 'Technology', image: 'https://picsum.photos/id/122/400/250', date: 'February 27, 2026', author: 'Elon Musk Jr', readTime: '4 min read' },
    { id: 24, title: 'Brain-computer interface tested', desc: 'Paralyzed patient types 90 words per minute using only thoughts', fullContent: 'Neuralink has announced a breakthrough in brain-computer interface technology, with a paralyzed patient achieving typing speeds of 90 words per minute using only thoughts. The implant, placed in the motor cortex, translates neural signals into digital commands. The technology could restore communication and control for people with severe paralysis. Researchers are now working on adding sensory feedback and mobility assistance.', category: 'Technology', image: 'https://picsum.photos/id/123/400/250', date: 'February 26, 2026', author: 'Maria Santos', readTime: '5 min read' },
    { id: 25, title: '6G network demoed', desc: 'New standard achieves speeds 100x faster than 5G with zero latency', fullContent: 'Researchers have demonstrated the first working 6G network, achieving speeds 100 times faster than current 5G technology. The new standard uses terahertz frequencies and advanced beamforming to deliver virtually zero latency. Applications could include holographic communications, real-time digital twins, and advanced industrial automation. Commercial deployment is expected by 2030.', category: 'Technology', image: 'https://picsum.photos/id/124/400/250', date: 'February 25, 2026', author: 'Chen Wei', readTime: '4 min read' },
    { id: 26, title: 'Nuclear fusion milestone', desc: 'ITER reactor achieves sustained net energy gain for 30 minutes', fullContent: 'The ITER nuclear fusion project in France has achieved sustained net energy gain for 30 minutes, a major milestone toward practical fusion power. The reactor produced more energy than it consumed, maintaining the reaction through advanced magnetic confinement. If scaled, fusion could provide virtually unlimited clean energy. Commercial reactors could be operational by the 2040s.', category: 'Technology', image: 'https://picsum.photos/id/125/400/250', date: 'February 24, 2026', author: 'Sophie Martin', readTime: '5 min read' },
    { id: 27, title: 'Robot dog climbs stairs', desc: "Boston Dynamics' latest model navigates complex environments autonomously", fullContent: "Boston Dynamics has unveiled a new version of its robotic dog that can climb stairs, open doors, and navigate complex environments autonomously. The robot uses advanced computer vision and AI to map its surroundings and plan paths. Potential applications include inspection, search and rescue, and military operations. The company emphasizes safety features and human oversight.", category: 'Technology', image: 'https://picsum.photos/id/126/400/250', date: 'February 23, 2026', author: 'Robert Chen', readTime: '4 min read' },
    { id: 28, title: 'Champions league final', desc: 'Real Madrid vs Bayern Munich in epic finale at Wembley', fullContent: 'The UEFA Champions League final will feature a blockbuster clash between Real Madrid and Bayern Munich at Wembley Stadium. Both teams have overcome incredible odds to reach the final, with Real Madrid staging a dramatic comeback against Manchester City, while Bayern defeated Paris Saint-Germain in a penalty shootout. This marks the fifth meeting between these European giants in the final, with both teams boasting a rich history. Key players include Jude Bellingham for Real and Harry Kane for Bayern in what promises to be an unforgettable match.', category: 'Sports', image: 'https://picsum.photos/id/495/400/250', date: 'March 4, 2026', author: 'Sam Wilson', readTime: '3 min read' },
    { id: 29, title: 'World Cup 2026 preparations', desc: '16 host cities ready for biggest tournament in history with 48 teams', fullContent: 'With just months until the 2026 World Cup, host cities across North America are finalizing preparations for what promises to be the biggest tournament in history. The expanded 48-team format will see matches played across the USA, Canada, and Mexico. Organizers expect record attendance and global viewership. Security and infrastructure upgrades are nearly complete. The tournament is projected to generate $5 billion in economic impact.', category: 'Sports', image: 'https://picsum.photos/id/305/400/250', date: 'February 28, 2026', author: 'Mike Johnson', readTime: '3 min read' },
    { id: 30, title: 'Olympics return to Athens', desc: '2028 Summer Games to be held in historic birthplace of the Olympics', fullContent: "The International Olympic Committee has announced that the 2028 Summer Olympics will be held in Athens, Greece, marking the Games' return to their historic birthplace 132 years after the first modern Olympics. Plans include using ancient stadiums for certain events alongside modern facilities. The announcement was met with celebration in Greece, though concerns about infrastructure and costs remain. The Games are expected to boost tourism and national pride.", category: 'Sports', image: 'https://picsum.photos/id/127/400/250', date: 'February 27, 2026', author: 'Dimitri Papadopoulos', readTime: '4 min read' },
    { id: 31, title: 'NBA finals set', desc: 'Lakers vs Celtics in historic 13th championship meeting', fullContent: "The NBA Finals will feature the Los Angeles Lakers against the Boston Celtics for the 13th time in league history, the most common Finals matchup. Both teams overcame tough conference opponents to reach the championship series. LeBron James, at age 41, continues to defy expectations, while Jayson Tatum leads a young Celtics core. The series promises to add another chapter to the league's greatest rivalry.", category: 'Sports', image: 'https://picsum.photos/id/128/400/250', date: 'February 26, 2026', author: 'Marcus Thompson', readTime: '4 min read' },
    { id: 32, title: "Women's soccer breaks records", desc: "World Cup final draws 2 billion viewers, surpassing men's tournament", fullContent: "The Women's World Cup final has broken viewership records, drawing an estimated 2 billion viewers worldwide. The match between the USA and England surpassed the men's tournament final in global audience for the first time. The milestone reflects growing investment and interest in women's sports. FIFA has announced increased prize money for the next Women's World Cup.", category: 'Sports', image: 'https://picsum.photos/id/129/400/250', date: 'February 25, 2026', author: 'Emma Watson', readTime: '3 min read' },
    { id: 33, title: 'Formula 1: New era begins', desc: 'Audi and Ford enter as teams, new engine regulations unveiled', fullContent: 'Formula 1 enters a new era with Audi and Ford joining as engine manufacturers under new regulations. The 2026 season features more powerful hybrid engines using sustainable fuels. The grid expands to 12 teams with the addition of a new American outfit. Early testing shows cars are faster and more efficient. Fans are excited about increased competition and manufacturer involvement.', category: 'Sports', image: 'https://picsum.photos/id/130/400/250', date: 'February 24, 2026', author: 'Lewis Hamilton Sr', readTime: '4 min read' },
    { id: 34, title: 'Tennis: New generation rises', desc: 'Carlos Alcaraz and Coco Gauff dominate, winning three majors each', fullContent: 'The new generation of tennis stars has fully arrived, with Carlos Alcaraz and Coco Gauff each winning three major titles this season. Alcaraz completed a career Grand Slam at age 22, while Gauff dominated the women\'s tour. Veterans Novak Djokovic and Iga Swiatek remain competitive but face increasing challenges from younger players. Analysts predict a long era of rivalry between these stars.', category: 'Sports', image: 'https://picsum.photos/id/131/400/250', date: 'February 23, 2026', author: 'Billie Jean King Jr', readTime: '4 min read' },
    { id: 35, title: 'Golf: LIV and PGA merge', desc: 'Unified tour announced after years of conflict and legal battles', fullContent: 'The PGA Tour and LIV Golf have announced a merger, ending years of conflict that divided the sport. The unified tour will feature a global schedule with increased prize money and a team component. Players who defected to LIV will be eligible to return to PGA events. The deal resolves multiple lawsuits and creates stability for professional golf.', category: 'Sports', image: 'https://picsum.photos/id/132/400/250', date: 'February 22, 2026', author: 'Tiger Woods III', readTime: '3 min read' },
    { id: 36, title: 'Marathon record shattered', desc: 'Kelvin Kiptum runs 1:59:01, breaking two-hour barrier officially', fullContent: "Kenyan runner Kelvin Kiptum has shattered the marathon world record with a time of 1:59:01, becoming the first person to officially break the two-hour barrier in a record-eligible race. The achievement was long thought impossible. Scientists credit advances in training, nutrition, and shoe technology. Kiptum celebrated with his home village in Kenya as the world celebrates a historic athletic achievement.", category: 'Sports', image: 'https://picsum.photos/id/133/400/250', date: 'February 21, 2026', author: 'Eliud Kipchoge Jr', readTime: '4 min read' },
    { id: 37, title: 'Stock markets rally', desc: 'Tech leads gains as AI boom drives Nasdaq to all-time high', fullContent: 'Global stock markets surged today as technology stocks led a broad rally driven by AI optimism. The Nasdaq composite jumped 2.5%, its best day in three months, while the S&P 500 hit a new all-time high. Nvidia and other AI-related chipmakers saw double-digit gains after announcing record earnings. Analysts attribute the rally to growing confidence in AI adoption across industries and expectations of rate cuts later this year. The positive sentiment extended to Asian and European markets, which closed sharply higher.', category: 'Business', image: 'https://picsum.photos/id/20/400/250', date: 'March 5, 2026', author: 'Jordan Lee', readTime: '4 min read' },
    { id: 38, title: 'Microsoft acquires GitHub', desc: '$15 billion deal expands developer platform with AI coding tools', fullContent: "Microsoft has announced the acquisition of GitHub for $15 billion, integrating the platform more deeply with its AI coding tools. The deal aims to enhance GitHub Copilot and other developer services. Critics express concern about consolidation in the developer tools market. Microsoft promises to maintain GitHub's independence while adding new AI-powered features.", category: 'Business', image: 'https://picsum.photos/id/134/400/250', date: 'March 4, 2026', author: 'Satya Nadella', readTime: '4 min read' },
    { id: 39, title: 'Amazon faces antitrust suit', desc: 'FTC lawsuit alleges monopoly in online retail and seller practices', fullContent: "The Federal Trade Commission has filed a sweeping antitrust lawsuit against Amazon, alleging the company maintains an illegal monopoly in online retail. The suit focuses on Amazon's treatment of third-party sellers and pricing practices. Amazon denies the allegations and vows to fight the lawsuit. The case could take years to resolve and may lead to restructuring of the company.", category: 'Business', image: 'https://picsum.photos/id/135/400/250', date: 'March 3, 2026', author: 'Lina Khan', readTime: '5 min read' },
    { id: 40, title: 'Bitcoin reaches $100,000', desc: 'Cryptocurrency hits milestone as institutional adoption grows', fullContent: 'Bitcoin has reached $100,000 for the first time, driven by institutional adoption and ETF approvals. Major companies including Tesla and MicroStrategy hold significant Bitcoin reserves. Sovereign wealth funds have begun allocating to cryptocurrency. Critics warn of volatility and regulatory risks, but supporters see it as digital gold and an inflation hedge.', category: 'Business', image: 'https://picsum.photos/id/136/400/250', date: 'March 2, 2026', author: 'Cathy Wood', readTime: '4 min read' },
    { id: 41, title: 'US-China trade deal', desc: 'New agreement reduces tariffs, opens markets for technology products', fullContent: 'The United States and China have reached a new trade agreement that reduces tariffs and opens markets for technology products. The deal resolves several long-standing disputes and establishes new cooperation on intellectual property. Business groups welcomed the agreement as reducing uncertainty. The deal could boost global trade and economic growth.', category: 'Business', image: 'https://picsum.photos/id/137/400/250', date: 'March 1, 2026', author: 'Janet Yellen', readTime: '4 min read' },
    { id: 42, title: 'Interest rates cut', desc: 'Federal Reserve reduces rates by 0.5% citing cooling inflation', fullContent: 'The Federal Reserve has cut interest rates by 0.5%, the first reduction in two years, citing cooling inflation and moderating economic growth. Markets rallied on the news, with mortgage rates expected to decline. The move signals confidence that inflation is under control. Further cuts may follow if economic conditions warrant.', category: 'Business', image: 'https://picsum.photos/id/138/400/250', date: 'February 28, 2026', author: 'Jerome Powell', readTime: '3 min read' },
    { id: 43, title: 'EV market surpasses gas cars', desc: 'Electric vehicles outsell traditional cars for first time in Europe', fullContent: 'Electric vehicles have outsold traditional gasoline-powered cars in Europe for the first time, marking a historic shift. The milestone comes as prices fall and charging infrastructure expands. Manufacturers are accelerating EV production plans. The trend is expected to spread to other regions as battery costs continue to decline.', category: 'Business', image: 'https://picsum.photos/id/139/400/250', date: 'February 27, 2026', author: 'Elon Musk', readTime: '4 min read' },
    { id: 44, title: 'Space tourism takes off', desc: 'Virgin Galactic and Blue Origin launch commercial flights weekly', fullContent: 'Space tourism has become a regular business, with Virgin Galactic and Blue Origin now launching commercial flights weekly. More than 500 tourists have experienced spaceflight, with prices dropping to $250,000 per seat. Orbital hotels are under development for extended stays. The industry is projected to reach $3 billion annually by 2030.', category: 'Business', image: 'https://picsum.photos/id/140/400/250', date: 'February 26, 2026', author: 'Richard Branson', readTime: '4 min read' },
    { id: 45, title: 'Remote work becomes permanent', desc: 'Majority of companies adopt hybrid models, reshaping commercial real estate', fullContent: 'A majority of large companies have now adopted permanent hybrid or remote work policies, fundamentally changing office demand. Commercial real estate values have fallen 30% in major cities, while suburban and rural areas benefit. New collaboration tools and management practices have evolved to support distributed teams. The shift appears permanent rather than temporary.', category: 'Business', image: 'https://picsum.photos/id/141/400/250', date: 'February 25, 2026', author: 'Adam Grant', readTime: '4 min read' }
  ];

  // ============================================
  // HELPER: Determine base path for links
  // ============================================
  function getBasePath() {
    const path = window.location.pathname;
    // If we're in pages/ subfolder, article/category are siblings
    if (path.includes('/pages/')) return '';
    // If we're in root (index.html), pages are in pages/
    return 'pages/';
  }

  // ============================================
  // FIX #1: renderNewsCards — was missing, caused search to break
  // ============================================
  function renderNewsCards(articles) {
    const newsGrid = document.getElementById('newsGrid');
    if (!newsGrid) return;
    const base = getBasePath();
    newsGrid.innerHTML = articles.map(a => `
      <div class="news-card" data-id="${a.id}" onclick="window.location.href='${base}article.html?id=${a.id}'">
        <div class="card-img">
          <img src="${a.image}" loading="lazy" alt="${a.title}">
          <div class="img-overlay">
            <span>${a.category}</span>
          </div>
        </div>
        <div class="card-content">
          <h3>${a.title}</h3>
          <p>${a.desc}</p>
          <div class="card-footer">
            <span>${a.date.split(' ')[0]} · ${a.author.split(' ')[0]}</span>
            <button class="read-more" onclick="event.stopPropagation(); window.location.href='${base}article.html?id=${a.id}'">
              Read Full →
            </button>
          </div>
        </div>
      </div>
    `).join('');
    observeCards();
  }

  // ============================================
  // SEARCH WITH DEBOUNCE
  // ============================================
  function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    let searchTimeout;
    const originalNewsData = [...newsData];
    const searchContainer = searchInput.parentElement;
    searchContainer.style.position = 'relative';

    const searchLoader = document.createElement('span');
    searchLoader.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    searchLoader.style.cssText = 'display:none; margin-left:8px; color:var(--accent);';
    searchContainer.appendChild(searchLoader);

    const clearButton = document.createElement('span');
    clearButton.innerHTML = '<i class="fas fa-times-circle"></i>';
    clearButton.style.cssText = 'display:none; cursor:pointer; margin-left:8px; color:var(--accent); font-size:1.2rem;';
    clearButton.title = 'Clear search';
    searchContainer.appendChild(clearButton);

    const suggestionsBox = document.createElement('div');
    suggestionsBox.className = 'search-suggestions';
    suggestionsBox.style.cssText = `
      position:absolute; top:100%; left:0; right:0;
      background:var(--card-bg); backdrop-filter:blur(16px);
      border:1px solid var(--border); border-radius:16px;
      margin-top:5px; max-height:300px; overflow-y:auto;
      z-index:1000; display:none; box-shadow:var(--shadow);
    `;
    searchContainer.appendChild(suggestionsBox);

    let recentSearches = [];
    try { recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || []; } catch(e) {}

    function saveRecentSearch(term) {
      if (!term || term.length < 2) return;
      recentSearches = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
      try { localStorage.setItem('recentSearches', JSON.stringify(recentSearches)); } catch(e) {}
    }

    function performSearch(term) {
      searchLoader.style.display = 'inline-block';
      setTimeout(() => {
        const searchTerm = term.toLowerCase().trim();
        const oldCount = document.querySelector('.search-result-count');
        if (oldCount) oldCount.remove();

        if (searchTerm.length === 0) {
          renderNewsCards(originalNewsData);
          clearButton.style.display = 'none';
          suggestionsBox.style.display = 'none';
          searchLoader.style.display = 'none';
          return;
        }

        const filtered = originalNewsData.filter(a =>
          a.title.toLowerCase().includes(searchTerm) ||
          a.desc.toLowerCase().includes(searchTerm) ||
          a.category.toLowerCase().includes(searchTerm) ||
          (a.author && a.author.toLowerCase().includes(searchTerm))
        );

        const newsGrid = document.getElementById('newsGrid');
        if (filtered.length === 0) {
          newsGrid.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:4rem;">
              <i class="fas fa-search" style="font-size:4rem; color:var(--accent); margin-bottom:1rem;"></i>
              <h3>No results found for "${searchTerm}"</h3>
              <p style="margin:1rem 0; opacity:0.7;">Try different keywords</p>
              <button onclick="document.getElementById('searchInput').value=''; document.getElementById('searchInput').dispatchEvent(new Event('input'));"
                      style="background:var(--accent); color:white; border:none; padding:0.8rem 2rem; border-radius:40px; cursor:pointer; margin-top:1rem;">
                Clear Search
              </button>
            </div>
          `;
        } else {
          renderNewsCards(filtered);
          let resultCount = document.createElement('div');
          resultCount.className = 'search-result-count';
          resultCount.style.cssText = 'grid-column:1/-1; text-align:center; margin-bottom:1rem; padding:0.5rem; background:var(--card-bg); border-radius:30px; font-weight:500;';
          resultCount.innerHTML = `🔍 Found ${filtered.length} result${filtered.length > 1 ? 's' : ''} for "${searchTerm}"`;
          newsGrid.parentNode.insertBefore(resultCount, newsGrid);
        }

        clearButton.style.display = 'inline-block';
        searchLoader.style.display = 'none';
        saveRecentSearch(searchTerm);
      }, 300);
    }

    function generateSuggestions(term) {
      if (term.length < 2) { suggestionsBox.style.display = 'none'; return; }
      const suggestions = [];
      originalNewsData.forEach(a => {
        if (a.title.toLowerCase().includes(term) && !suggestions.includes(a.title)) suggestions.push(a.title);
        if (a.category.toLowerCase().includes(term) && !suggestions.includes(a.category)) suggestions.push(a.category);
      });
      if (suggestions.length === 0) { suggestionsBox.style.display = 'none'; return; }

      suggestionsBox.innerHTML = '';
      const sec = document.createElement('div');
      sec.innerHTML = `<div style="padding:0.5rem 1rem; font-size:0.8rem; opacity:0.6; border-bottom:1px solid var(--border);"><i class="fas fa-search"></i> Suggestions</div>`;
      suggestions.slice(0, 5).forEach(s => {
        const item = document.createElement('div');
        item.style.cssText = 'padding:0.8rem 1rem; cursor:pointer; display:flex; align-items:center; gap:0.5rem; transition:background 0.2s;';
        item.innerHTML = `<i class="fas fa-search" style="color:var(--accent);"></i> ${s}`;
        item.onmouseover = () => item.style.background = 'var(--hover)';
        item.onmouseout = () => item.style.background = 'transparent';
        item.onclick = () => { searchInput.value = s; suggestionsBox.style.display = 'none'; performSearch(s); };
        sec.appendChild(item);
      });
      suggestionsBox.appendChild(sec);
      suggestionsBox.style.display = 'block';
    }

    searchInput.addEventListener('input', (e) => {
      const term = e.target.value;
      clearTimeout(searchTimeout);
      generateSuggestions(term.toLowerCase());
      const oldCount = document.querySelector('.search-result-count');
      if (oldCount) oldCount.remove();
      searchTimeout = setTimeout(() => performSearch(term), 300);
    });

    clearButton.addEventListener('click', () => {
      searchInput.value = '';
      searchInput.focus();
      suggestionsBox.style.display = 'none';
      performSearch('');
    });

    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        clearTimeout(searchTimeout);
        suggestionsBox.style.display = 'none';
        performSearch(searchInput.value);
      }
    });

    document.addEventListener('click', (e) => {
      if (!searchContainer.contains(e.target)) suggestionsBox.style.display = 'none';
    });
  }

  // ============================================
  // ARTICLE PAGE
  // ============================================
  function loadArticleFromStorage(id) {
    const article = newsData.find(a => a.id == id);
    if (!article) { window.location.href = '../index.html'; return; }

    document.title = `${article.title} · Daily News Digest`;

    const articleTitle = document.querySelector('.article-title');
    const articleMeta = document.querySelector('.article-meta');
    const articleImage = document.querySelector('.article-image');
    const articleContent = document.querySelector('.article-content');
    const relatedGrid = document.getElementById('relatedGrid');

    if (articleTitle) articleTitle.textContent = article.title;
    if (articleMeta) {
      articleMeta.innerHTML = `
        <span class="author"><i class="fas fa-user"></i> ${article.author}</span>
        <span class="date"><i class="fas fa-calendar-alt"></i> ${article.date}</span>
        <span class="read-time"><i class="fas fa-clock"></i> ${article.readTime || '4 min read'}</span>
        <span class="category" onclick="window.location.href='category.html?cat=${encodeURIComponent(article.category)}'" style="cursor:pointer;">
          <i class="fas fa-tag"></i> ${article.category}
        </span>
      `;
    }
    if (articleImage) articleImage.src = article.image;
    if (articleContent) articleContent.innerHTML = `<p>${article.fullContent}</p>`;

    // Set AI summarizer content
    if (window.aiSummarizer) {
      window.aiSummarizer.setArticleContent(article.fullContent);
    }

    const related = newsData.filter(a => a.id != id && a.category === article.category).slice(0, 3);
    if (relatedGrid) {
      if (related.length > 0) {
        relatedGrid.innerHTML = related.map(a => `
          <div class="news-card" style="cursor:pointer;" onclick="window.location.href='article.html?id=${a.id}'">
            <div class="card-img"><img src="${a.image}" alt="${a.title}"></div>
            <div class="card-content">
              <h4 style="font-size:1rem;">${a.title}</h4>
              <span style="font-size:0.8rem; opacity:0.7;">${a.date}</span>
            </div>
          </div>
        `).join('');
      } else {
        relatedGrid.innerHTML = '<p style="grid-column:1/-1;">No related articles found</p>';
      }
    }

    setupArticleBookmark(article.id);
    setupDarkMode();
    // FIX #2: setupHamburgerMenu was missing in article page
    setupHamburgerMenu();
  }

  // ============================================
  // CATEGORY PAGE
  // ============================================
  function loadCategoryPage(category) {
    const filteredArticles = newsData.filter(a => a.category.toLowerCase() === category.toLowerCase());
    document.title = `${category} News · Daily News Digest`;

    const categoryGrid = document.getElementById('categoryGrid');
    const categoryTitle = document.getElementById('categoryTitle');
    if (categoryTitle) categoryTitle.textContent = `${category} News`;

    if (categoryGrid) {
      categoryGrid.innerHTML = Array(3).fill(0).map(() => `
        <div class="skeleton-card">
          <div class="skeleton-img"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
        </div>
      `).join('');

      setTimeout(() => {
        if (filteredArticles.length === 0) {
          categoryGrid.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:4rem;">
              <h3>No articles found in ${category}</h3>
              <a href="../index.html" style="color:var(--accent);">Back to Home</a>
            </div>
          `;
        } else {
          categoryGrid.innerHTML = filteredArticles.map(a => `
            <div class="news-card" data-id="${a.id}" onclick="window.location.href='article.html?id=${a.id}'">
              <div class="card-img">
                <img src="${a.image}" loading="lazy" alt="${a.title}">
                <div class="img-overlay"><span>${a.category}</span></div>
              </div>
              <div class="card-content">
                <h3>${a.title}</h3>
                <p>${a.desc}</p>
                <div class="card-footer">
                  <span>${a.date} · ${a.author}</span>
                  <button class="read-more" onclick="event.stopPropagation(); window.location.href='article.html?id=${a.id}'">
                    Read Full →
                  </button>
                </div>
              </div>
            </div>
          `).join('');
        }
      }, 800);
    }

    setupDarkMode();
    setupHamburgerMenu();
  }

  // ============================================
  // HOMEPAGE
  // ============================================
  function initHomePage() {
    setupCategoryLinks();
    renderHomePageNews();
    initBreakingTicker();
    setupSearch();
    setupDarkMode();
    setupHamburgerMenu();
    setupTrendingList();
    setupBookmarkSidebar();
    setupNewsletterForm();
    makeTagsClickable();
  }

  function renderHomePageNews() {
    const newsGrid = document.getElementById('newsGrid');
    if (!newsGrid) return;

    newsGrid.innerHTML = Array(6).fill(0).map(() => `
      <div class="skeleton-card">
        <div class="skeleton-img"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
        <div class="skeleton-line medium"></div>
      </div>
    `).join('');

    setTimeout(() => {
      renderNewsCards(newsData);
    }, 1000);
  }

  function setupCategoryLinks() {
    document.querySelectorAll('.nav-menu a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = link.textContent.trim();
        if (category === 'Home') { window.location.href = 'index.html'; return; }
        window.location.href = `pages/category.html?cat=${encodeURIComponent(category)}`;
      });
    });
  }

  function makeTagsClickable() {
    document.querySelectorAll('.tags span').forEach(tag => {
      tag.style.cursor = 'pointer';
      tag.addEventListener('click', () => {
        const category = tag.textContent.replace('#', '');
        window.location.href = `pages/category.html?cat=${encodeURIComponent(category)}`;
      });
    });
  }

  function initBreakingTicker() {
    const tickerContent = document.getElementById('tickerContent');
    if (!tickerContent) return;
    const headlines = newsData.map(a => ({
      text: a.title,
      icon: a.category === 'AI' ? '🤖' : a.category === 'World' ? '🌍' : a.category === 'Sports' ? '⚽' : a.category === 'Business' ? '📈' : '📱'
    }));
    const all = [...headlines, ...headlines];
    tickerContent.innerHTML = all.map(h => `<span class="ticker-item"><i class="fas fa-bolt"></i> ${h.icon} ${h.text}</span>`).join('');
  }

  function setupDarkMode() {
    const darkToggle = document.getElementById('darkToggle');
    const darkToggleArticle = document.getElementById('darkToggleArticle');

    const toggleDark = () => {
      document.body.classList.toggle('dark-mode');
      document.querySelectorAll('#darkToggle i, #darkToggleArticle i').forEach(icon => {
        if (document.body.classList.contains('dark-mode')) {
          icon.classList.replace('fa-moon', 'fa-sun');
        } else {
          icon.classList.replace('fa-sun', 'fa-moon');
        }
      });
    };

    if (darkToggle) darkToggle.addEventListener('click', toggleDark);
    if (darkToggleArticle) darkToggleArticle.addEventListener('click', toggleDark);
  }

  function setupHamburgerMenu() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const dropdown = document.getElementById('hamburgerDropdown');
    const overlay = document.getElementById('dropdownOverlay');
    const closeBtn = document.getElementById('closeDropdown');

    if (!hamburgerBtn || !dropdown || !overlay) return;

    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    const closeDropdown = () => {
      dropdown.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = 'auto';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeDropdown);
    overlay.addEventListener('click', closeDropdown);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dropdown.classList.contains('active')) closeDropdown();
    });
    dropdown.addEventListener('click', (e) => e.stopPropagation());
  }

  function setupTrendingList() {
    const trendingList = document.getElementById('trendingList');
    if (!trendingList) return;
    trendingList.innerHTML = newsData.slice(0, 5).map(a => `
      <li onclick="window.location.href='pages/article.html?id=${a.id}'" style="cursor:pointer;">
        <span>${a.title}</span>
        <span style="color:var(--accent);">🔥 ${Math.floor(Math.random() * 50) + 50}k</span>
      </li>
    `).join('');
  }

  function setupBookmarkSidebar() {
    const bookmarkList = document.getElementById('bookmarkList');
    if (!bookmarkList) return;
    updateBookmarkSidebar();
  }

  function updateBookmarkSidebar() {
    const bookmarkList = document.getElementById('bookmarkList');
    if (!bookmarkList) return;
    let bookmarks = [];
    try { bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || []; } catch(e) {}

    if (bookmarks.length === 0) {
      bookmarkList.innerHTML = '<li style="opacity:0.7;">No bookmarks yet</li>';
    } else {
      bookmarkList.innerHTML = bookmarks.map(id => {
        const article = newsData.find(n => n.id == id);
        return article ? `
          <li onclick="window.location.href='pages/article.html?id=${id}'" style="cursor:pointer;">
            <span>${article.title.length > 30 ? article.title.substring(0, 30) + '...' : article.title}</span>
            <i class="fas fa-bookmark" style="color:var(--accent);"></i>
          </li>
        ` : '';
      }).join('');
    }
  }

  function setupArticleBookmark(articleId) {
    const bookmarkBtn = document.getElementById('bookmarkArticleBtn');
    if (!bookmarkBtn) return;

    let bookmarks = [];
    try { bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || []; } catch(e) {}

    bookmarkBtn.innerHTML = bookmarks.includes(articleId)
      ? '<i class="fas fa-bookmark"></i>'
      : '<i class="far fa-bookmark"></i>';

    bookmarkBtn.addEventListener('click', (e) => {
      e.preventDefault();
      try { bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || []; } catch(e) { bookmarks = []; }

      if (bookmarks.includes(articleId)) {
        bookmarks = bookmarks.filter(b => b !== articleId);
        bookmarkBtn.innerHTML = '<i class="far fa-bookmark"></i>';
        showToast('✓ Bookmark removed');
      } else {
        bookmarks.push(articleId);
        bookmarkBtn.innerHTML = '<i class="fas fa-bookmark"></i>';
        showToast('✓ Article bookmarked');
      }
      try { localStorage.setItem('bookmarks', JSON.stringify(bookmarks)); } catch(e) {}
    });
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position:fixed; bottom:20px; right:20px;
      background:var(--accent); color:white;
      padding:12px 24px; border-radius:30px;
      z-index:9999; animation:slideIn 0.3s ease;
      box-shadow:0 4px 15px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  }

  function setupNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]').value;
      if (email) { showToast('✓ Thanks for subscribing!'); form.reset(); }
    });
  }

  function observeCards() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.news-card').forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(card);
    });
  }

  function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn { from { transform:translateX(100%); opacity:0; } to { transform:translateX(0); opacity:1; } }
      @keyframes fadeOut { from { opacity:1; } to { opacity:0; } }
    `;
    document.head.appendChild(style);
  }

  // ============================================
  // PAGE ROUTING
  // ============================================
  const path = window.location.pathname;
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');
  const categoryParam = urlParams.get('cat');

  if (path.includes('article.html') && articleId) {
    loadArticleFromStorage(articleId);
  } else if (path.includes('category.html') && categoryParam) {
    loadCategoryPage(categoryParam);
  } else {
    initHomePage();
  }

  addAnimationStyles();

  // Expose showToast globally for ai-summarizer.js
  window.showToast = showToast;
});