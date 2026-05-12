// MatchBook — db.js
// Scalable mock database for Italian high school textbook trading

'use strict';

// ─── SCHOOLS DATABASE ────────────────────────────────────────────────────────

const SCHOOLS_DB = [
  // Milan
  { id: 'MI001', name: 'Liceo Classico Beccaria', city: 'Milano', province: 'MI', region: 'Lombardia', lat: 45.4654, lng: 9.1859 },
  { id: 'MI002', name: 'Liceo Scientifico Leonardo', city: 'Milano', province: 'MI', region: 'Lombardia', lat: 45.4773, lng: 9.2001 },
  { id: 'MI003', name: 'ITIS Molinari', city: 'Milano', province: 'MI', region: 'Lombardia', lat: 45.4561, lng: 9.1740 },
  { id: 'MI004', name: 'Liceo Artistico di Brera', city: 'Milano', province: 'MI', region: 'Lombardia', lat: 45.4723, lng: 9.1872 },
  { id: 'MI005', name: 'ITC Pirelli', city: 'Milano', province: 'MI', region: 'Lombardia', lat: 45.4817, lng: 9.2345 },
  // Rome
  { id: 'RM001', name: 'Liceo Classico Visconti', city: 'Roma', province: 'RM', region: 'Lazio', lat: 41.8987, lng: 12.4812 },
  { id: 'RM002', name: 'Liceo Scientifico Farnesina', city: 'Roma', province: 'RM', region: 'Lazio', lat: 41.9334, lng: 12.4399 },
  { id: 'RM003', name: 'ITIS Galileo Galilei Roma', city: 'Roma', province: 'RM', region: 'Lazio', lat: 41.8719, lng: 12.5103 },
  { id: 'RM004', name: 'Liceo Linguistico Virgilio', city: 'Roma', province: 'RM', region: 'Lazio', lat: 41.8811, lng: 12.4678 },
  // Naples
  { id: 'NA001', name: 'Liceo Classico Umberto I', city: 'Napoli', province: 'NA', region: 'Campania', lat: 40.8522, lng: 14.2681 },
  { id: 'NA002', name: 'Liceo Scientifico Galilei Napoli', city: 'Napoli', province: 'NA', region: 'Campania', lat: 40.8612, lng: 14.2834 },
  { id: 'NA003', name: 'ITIS Ferraris Napoli', city: 'Napoli', province: 'NA', region: 'Campania', lat: 40.8445, lng: 14.2512 },
  { id: 'NA004', name: 'IIS Nitti Napoli', city: 'Napoli', province: 'NA', region: 'Campania', lat: 40.8391, lng: 14.2603 },
  // Turin
  { id: 'TO001', name: 'Liceo Classico Cavour Torino', city: 'Torino', province: 'TO', region: 'Piemonte', lat: 45.0703, lng: 7.6869 },
  { id: 'TO002', name: 'Liceo Scientifico Galileo Ferraris', city: 'Torino', province: 'TO', region: 'Piemonte', lat: 45.0612, lng: 7.6724 },
  { id: 'TO003', name: 'ITIS Avogadro Torino', city: 'Torino', province: 'TO', region: 'Piemonte', lat: 45.0534, lng: 7.6912 },
  // Florence
  { id: 'FI001', name: 'Liceo Classico Dante Firenze', city: 'Firenze', province: 'FI', region: 'Toscana', lat: 43.7756, lng: 11.2558 },
  { id: 'FI002', name: 'Liceo Scientifico Castelnuovo', city: 'Firenze', province: 'FI', region: 'Toscana', lat: 43.7823, lng: 11.2701 },
  { id: 'FI003', name: 'ITIS Leonardo da Vinci Firenze', city: 'Firenze', province: 'FI', region: 'Toscana', lat: 43.7689, lng: 11.2489 },
  // Bologna
  { id: 'BO001', name: 'Liceo Classico Galvani', city: 'Bologna', province: 'BO', region: 'Emilia-Romagna', lat: 44.4949, lng: 11.3426 },
  { id: 'BO002', name: 'Liceo Scientifico Righi Bologna', city: 'Bologna', province: 'BO', region: 'Emilia-Romagna', lat: 44.5023, lng: 11.3589 },
  { id: 'BO003', name: 'ITIS Belluzzi Bologna', city: 'Bologna', province: 'BO', region: 'Emilia-Romagna', lat: 44.4889, lng: 11.3312 },
  // Palermo
  { id: 'PA001', name: 'Liceo Classico Umberto Palermo', city: 'Palermo', province: 'PA', region: 'Sicilia', lat: 38.1157, lng: 13.3615 },
  { id: 'PA002', name: 'Liceo Scientifico Cannizzaro', city: 'Palermo', province: 'PA', region: 'Sicilia', lat: 38.1223, lng: 13.3489 },
  // Venice
  { id: 'VE001', name: 'Liceo Classico Marco Foscarini', city: 'Venezia', province: 'VE', region: 'Veneto', lat: 45.4408, lng: 12.3155 },
  { id: 'VE002', name: 'Liceo Scientifico Benedetti Venezia', city: 'Venezia', province: 'VE', region: 'Veneto', lat: 45.4512, lng: 12.3234 },
  // Genoa
  { id: 'GE001', name: 'Liceo Classico Andrea Doria', city: 'Genova', province: 'GE', region: 'Liguria', lat: 44.4056, lng: 8.9463 },
  { id: 'GE002', name: 'ITIS Galileo Galilei Genova', city: 'Genova', province: 'GE', region: 'Liguria', lat: 44.4123, lng: 8.9612 },
  // Bari
  { id: 'BA001', name: 'Liceo Classico Quinto Orazio Flacco', city: 'Bari', province: 'BA', region: 'Puglia', lat: 41.1171, lng: 16.8719 },
  { id: 'BA002', name: 'Liceo Scientifico Fermi Bari', city: 'Bari', province: 'BA', region: 'Puglia', lat: 41.1089, lng: 16.8634 },
  // Catania
  { id: 'CT001', name: 'Liceo Classico Spedalieri', city: 'Catania', province: 'CT', region: 'Sicilia', lat: 37.5023, lng: 15.0872 },
  { id: 'CT002', name: 'ITIS Cannizzaro Catania', city: 'Catania', province: 'CT', region: 'Sicilia', lat: 37.5134, lng: 15.0934 },
  // Verona
  { id: 'VR001', name: 'Liceo Classico Scipione Maffei', city: 'Verona', province: 'VR', region: 'Veneto', lat: 45.4384, lng: 10.9916 },
  { id: 'VR002', name: 'Liceo Scientifico Messedaglia', city: 'Verona', province: 'VR', region: 'Veneto', lat: 45.4312, lng: 10.9823 },
  // Padua
  { id: 'PD001', name: 'Liceo Classico Tito Livio', city: 'Padova', province: 'PD', region: 'Veneto', lat: 45.4064, lng: 11.8768 },
  { id: 'PD002', name: 'Liceo Scientifico Enrico Fermi Padova', city: 'Padova', province: 'PD', region: 'Veneto', lat: 45.4134, lng: 11.8823 },
  // Brescia
  { id: 'BS001', name: 'Liceo Classico Arnaldo', city: 'Brescia', province: 'BS', region: 'Lombardia', lat: 45.5416, lng: 10.2118 },
  { id: 'BS002', name: 'Liceo Scientifico Calini', city: 'Brescia', province: 'BS', region: 'Lombardia', lat: 45.5489, lng: 10.2234 },
  // Taranto
  { id: 'TA001', name: 'Liceo Classico Archita', city: 'Taranto', province: 'TA', region: 'Puglia', lat: 40.4764, lng: 17.2289 },
  // Modena
  { id: 'MO001', name: 'Liceo Classico Muratori', city: 'Modena', province: 'MO', region: 'Emilia-Romagna', lat: 44.6472, lng: 10.9255 },
  // Parma
  { id: 'PR001', name: 'Liceo Classico Romagnosi', city: 'Parma', province: 'PR', region: 'Emilia-Romagna', lat: 44.8015, lng: 10.3279 },
  // Reggio Calabria
  { id: 'RC001', name: 'Liceo Classico Tommaso Campanella', city: 'Reggio Calabria', province: 'RC', region: 'Calabria', lat: 38.1117, lng: 15.6475 },
];

// ─── BOOKS DATABASE ──────────────────────────────────────────────────────────

// `cost` = prezzo di listino di copertina in EUR (nuovo). Usato per calcolare
// il prezzo massimo di rivendita (50% del listino) quando un venditore
// inserisce un libro tramite ISBN.
const BOOKS_DB = [
  { isbn: '9788800000001', title: 'Divina Commedia — Commento', author: 'Dante Alighieri (ed. Sapegno)', subject: 'Italian Literature', year: 1, cost: 32.00 },
  { isbn: '9788800000002', title: 'Promessi Sposi', author: 'Alessandro Manzoni', subject: 'Italian Literature', year: 2, cost: 26.50 },
  { isbn: '9788800000003', title: 'Matematica.blu 2.0 Vol. 1', author: 'Bergamini, Trifone, Barozzi', subject: 'Mathematics', year: 1, cost: 38.50 },
  { isbn: '9788800000004', title: 'Matematica.blu 2.0 Vol. 2', author: 'Bergamini, Trifone, Barozzi', subject: 'Mathematics', year: 2, cost: 40.80 },
  { isbn: '9788800000005', title: 'Matematica.blu 2.0 Vol. 3', author: 'Bergamini, Trifone, Barozzi', subject: 'Mathematics', year: 3, cost: 42.60 },
  { isbn: '9788800000006', title: 'Fisica: concetti e fenomeni Vol. 1', author: 'Cutnell & Johnson', subject: 'Physics', year: 3, cost: 34.20 },
  { isbn: '9788800000007', title: 'Biologia — La scienza della vita', author: 'Campbell & Reece', subject: 'Biology', year: 2, cost: 41.00 },
  { isbn: '9788800000008', title: 'Chimica: molecole in movimento', author: 'Tro', subject: 'Chemistry', year: 2, cost: 36.50 },
  { isbn: '9788800000009', title: 'Storia Moderna Vol. 1', author: 'Braudel', subject: 'History', year: 3, cost: 29.80 },
  { isbn: '9788800000010', title: 'Storia Contemporanea Vol. 2', author: 'De Bernardi, Guarracino', subject: 'History', year: 4, cost: 31.50 },
  { isbn: '9788800000011', title: 'Grammatica Latina', author: 'Traina & Pasqualini', subject: 'Latin', year: 1, cost: 28.90 },
  { isbn: '9788800000012', title: 'Versioni Latine — Anthologia', author: 'Nuzzo', subject: 'Latin', year: 2, cost: 24.50 },
  { isbn: '9788800000013', title: 'New Headway Upper-Intermediate', author: 'Soars', subject: 'English', year: 3, cost: 32.00 },
  { isbn: '9788800000014', title: 'Filosofia Vol. 1 — Antica e Medievale', author: 'Abbagnano, Fornero', subject: 'Philosophy', year: 3, cost: 33.50 },
  { isbn: '9788800000015', title: 'Filosofia Vol. 2 — Moderna', author: 'Abbagnano, Fornero', subject: 'Philosophy', year: 4, cost: 34.80 },
  { isbn: '9788800000016', title: 'Arte e storia Vol. 1', author: 'Cricco, Di Teodoro', subject: 'Art History', year: 1, cost: 36.20 },
  { isbn: '9788800000017', title: 'Economia Aziendale Vol. 1', author: 'Astolfi, Barale', subject: 'Economics', year: 1, cost: 29.50 },
  { isbn: '9788800000018', title: 'Informatica — App e algoritmi', author: 'Lorenzi, Cavalli', subject: 'Computer Science', year: 2, cost: 27.80 },
];

// ─── LOCAL STORAGE HELPERS ───────────────────────────────────────────────────

const DB = {
  _get(key, fallback = null) {
    try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  _set(key, value) { localStorage.setItem(key, JSON.stringify(value)); },

  // ── Users ──────────────────────────────────────────────────────────────────
  getUsers() { return this._get('mb_users', []); },
  saveUsers(users) { this._set('mb_users', users); },
  getUserById(id) { return this.getUsers().find(u => u.id === id) || null; },
  getUserByEmail(email) { return this.getUsers().find(u => u.email === email.toLowerCase()) || null; },
  createUser(data) {
    const users = this.getUsers();
    if (users.find(u => u.email === data.email.toLowerCase())) return { error: 'Email already registered' };
    const user = {
      id: 'u_' + Date.now() + Math.random().toString(36).slice(2, 7),
      email: data.email.toLowerCase(),
      password: data.password, // plain text for demo
      name: data.name,
      plan: data.plan || 'free', // 'free' | 'pro' — cosmetic for now, no functional difference
      schoolId: data.schoolId,
      balance: 200, // mock balance — every account can buy
      penaltyCount: 0,
      createdAt: Date.now(),
      active: true,
    };
    users.push(user);
    this.saveUsers(users);
    return { user };
  },
  updateUser(id, updates) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return false;
    users[idx] = { ...users[idx], ...updates };
    this.saveUsers(users);
    return users[idx];
  },
  deleteUser(id) {
    const users = this.getUsers().filter(u => u.id !== id);
    this.saveUsers(users);
  },

  // ── Session ────────────────────────────────────────────────────────────────
  getSession() { return this._get('mb_session', null); },
  setSession(user) { this._set('mb_session', { userId: user.id, name: user.name }); },
  clearSession() { localStorage.removeItem('mb_session'); },
  currentUser() {
    const s = this.getSession();
    return s ? this.getUserById(s.userId) : null;
  },

  // ── Listings ───────────────────────────────────────────────────────────────
  getListings() { return this._get('mb_listings', []); },
  saveListings(l) { this._set('mb_listings', l); },
  getListingById(id) { return this.getListings().find(l => l.id === id) || null; },
  createListing(data) {
    const listings = this.getListings();
    const listing = {
      id: 'lst_' + Date.now() + Math.random().toString(36).slice(2, 7),
      sellerId: data.sellerId,
      schoolId: data.schoolId,
      isbn: data.isbn,
      bookTitle: data.bookTitle,
      bookAuthor: data.bookAuthor,
      subject: data.subject,
      condition: data.condition, // 'new'|'like_new'|'good'|'fair'
      price: parseFloat(data.price),
      description: data.description || '',
      status: 'active', // 'active'|'reserved'|'sold'
      createdAt: Date.now(),
    };
    listings.push(listing);
    this.saveListings(listings);
    return listing;
  },
  updateListing(id, updates) {
    const listings = this.getListings();
    const idx = listings.findIndex(l => l.id === id);
    if (idx === -1) return false;
    listings[idx] = { ...listings[idx], ...updates };
    this.saveListings(listings);
    return listings[idx];
  },

  // ── Matching System ────────────────────────────────────────────────────────
  getMatchedListings(buyerSchoolId, sortBy = 'proximity') {
    const buyerSchool = SCHOOLS_DB.find(s => s.id === buyerSchoolId);
    if (!buyerSchool) return [];
    const listings = this.getListings().filter(l => l.status === 'active');

    const scored = listings.map(l => {
      const sellerSchool = SCHOOLS_DB.find(s => s.id === l.schoolId);
      if (!sellerSchool) return null;
      let priority = 3; // other city
      if (sellerSchool.id === buyerSchool.id) priority = 1; // same school
      else if (sellerSchool.city === buyerSchool.city) priority = 2; // same city
      const dist = priority === 1 ? 0 : haversine(buyerSchool.lat, buyerSchool.lng, sellerSchool.lat, sellerSchool.lng);
      return { ...l, _priority: priority, _distance: dist, _sellerSchool: sellerSchool };
    }).filter(Boolean).filter(l => l._priority < 3); // hide other cities

    if (sortBy === 'proximity') {
      scored.sort((a, b) => a._priority - b._priority || a._distance - b._distance);
    } else {
      scored.sort((a, b) => a._priority - b._priority || a.price - b.price);
    }
    return scored;
  },
  toggleOtherCities(buyerSchoolId, sortBy = 'proximity') {
    const buyerSchool = SCHOOLS_DB.find(s => s.id === buyerSchoolId);
    if (!buyerSchool) return [];
    const listings = this.getListings().filter(l => l.status === 'active');
    const scored = listings.map(l => {
      const sellerSchool = SCHOOLS_DB.find(s => s.id === l.schoolId);
      if (!sellerSchool) return null;
      let priority = 3;
      if (sellerSchool.id === buyerSchool.id) priority = 1;
      else if (sellerSchool.city === buyerSchool.city) priority = 2;
      const dist = haversine(buyerSchool.lat, buyerSchool.lng, sellerSchool.lat, sellerSchool.lng);
      return { ...l, _priority: priority, _distance: dist, _sellerSchool: sellerSchool };
    }).filter(Boolean);
    if (sortBy === 'proximity') scored.sort((a, b) => a._priority - b._priority || a._distance - b._distance);
    else scored.sort((a, b) => a._priority - b._priority || a.price - b.price);
    return scored;
  },

  // ── Messages ───────────────────────────────────────────────────────────────
  getConversations() { return this._get('mb_conversations', []); },
  saveConversations(c) { this._set('mb_conversations', c); },
  getConversation(id) { return this.getConversations().find(c => c.id === id) || null; },
  getConversationsForUser(userId) {
    return this.getConversations().filter(c => c.participants.includes(userId));
  },
  createConversation(buyerId, sellerId, listingId) {
    const convs = this.getConversations();
    const existing = convs.find(c => c.buyerId === buyerId && c.sellerId === sellerId && c.listingId === listingId);
    if (existing) return existing;
    const conv = {
      id: 'conv_' + Date.now() + Math.random().toString(36).slice(2, 7),
      buyerId, sellerId, listingId,
      participants: [buyerId, sellerId],
      messages: [],
      createdAt: Date.now(),
    };
    convs.push(conv);
    this.saveConversations(convs);
    return conv;
  },
  addMessage(convId, senderId, text) {
    const convs = this.getConversations();
    const idx = convs.findIndex(c => c.id === convId);
    if (idx === -1) return null;
    const msg = { id: 'msg_' + Date.now(), senderId, text, ts: Date.now() };
    convs[idx].messages.push(msg);
    this.saveConversations(convs);
    return msg;
  },

  // ── Transactions ───────────────────────────────────────────────────────────
  getTransactions() { return this._get('mb_transactions', []); },
  saveTransactions(t) { this._set('mb_transactions', t); },
  getTransactionById(id) { return this.getTransactions().find(t => t.id === id) || null; },
  getTransactionsForUser(userId) {
    return this.getTransactions().filter(t => t.buyerId === userId || t.sellerId === userId);
  },
  createTransaction(buyerId, sellerId, listingId) {
    const listing = this.getListingById(listingId);
    if (!listing) return null;
    const txns = this.getTransactions();
    const deposit = parseFloat((listing.price * 0.30).toFixed(2));
    const remainder = parseFloat((listing.price * 0.70).toFixed(2));
    const txn = {
      id: 'txn_' + Date.now() + Math.random().toString(36).slice(2, 7),
      buyerId, sellerId, listingId,
      totalPrice: listing.price,
      deposit, remainder,
      sellerPenalty: deposit, // 30% of price
      status: 'pending_deposit', // pending_deposit → deposit_paid → completed | disputed | refunded
      depositPaidAt: null,
      completedAt: null,
      disputedAt: null,
      refundedAt: null,
      createdAt: Date.now(),
    };
    txns.push(txn);
    this.saveTransactions(txns);
    return txn;
  },
  payDeposit(txnId) {
    const txns = this.getTransactions();
    const idx = txns.findIndex(t => t.id === txnId);
    if (idx === -1) return { error: 'Transaction not found' };
    const txn = txns[idx];
    if (txn.status !== 'pending_deposit') return { error: 'Invalid state' };
    const buyer = this.getUserById(txn.buyerId);
    if (!buyer || buyer.balance < txn.deposit) return { error: 'Insufficient balance' };
    this.updateUser(txn.buyerId, { balance: buyer.balance - txn.deposit });
    txns[idx] = { ...txn, status: 'deposit_paid', depositPaidAt: Date.now() };
    this.saveTransactions(txns);
    this.updateListing(txn.listingId, { status: 'reserved' });
    return { txn: txns[idx] };
  },
  confirmTransaction(txnId) {
    const txns = this.getTransactions();
    const idx = txns.findIndex(t => t.id === txnId);
    if (idx === -1) return { error: 'Not found' };
    const txn = txns[idx];
    if (txn.status !== 'deposit_paid') return { error: 'Invalid state' };
    txns[idx] = { ...txn, status: 'completed', completedAt: Date.now() };
    this.saveTransactions(txns);
    this.updateListing(txn.listingId, { status: 'sold' });
    return { txn: txns[idx] };
  },
  disputeTransaction(txnId) {
    const txns = this.getTransactions();
    const idx = txns.findIndex(t => t.id === txnId);
    if (idx === -1) return { error: 'Not found' };
    const txn = txns[idx];
    if (txn.status !== 'deposit_paid') return { error: 'Invalid state' };
    // Refund buyer fully
    const buyer = this.getUserById(txn.buyerId);
    if (buyer) this.updateUser(txn.buyerId, { balance: buyer.balance + txn.deposit });
    // Penalize seller and delete account
    this.deleteUser(txn.sellerId);
    txns[idx] = { ...txn, status: 'refunded', refundedAt: Date.now(), disputedAt: Date.now() };
    this.saveTransactions(txns);
    this.updateListing(txn.listingId, { status: 'active' });
    return { txn: txns[idx] };
  },

  // ── Seed ───────────────────────────────────────────────────────────────────
  seed() {
    if (this._get('mb_seeded_v2')) return;
    // Wipe any data from the previous schema (role-based) so we start clean
    if (this._get('mb_seeded')) {
      ['mb_users','mb_listings','mb_conversations','mb_transactions','mb_session','mb_seeded']
        .forEach(k => localStorage.removeItem(k));
    }
    // Seed demo users — buyer@demo.it is now the "free" plan, seller@demo.it the "pro" plan
    this.createUser({ email: 'buyer@demo.it',  password: 'demo1234', name: 'Giulia Ferraro',  plan: 'free', schoolId: 'NA001' });
    this.createUser({ email: 'seller@demo.it', password: 'demo1234', name: 'Marco Esposito',  plan: 'pro',  schoolId: 'NA001' });
    this.createUser({ email: 'seller2@demo.it',password: 'demo1234', name: 'Sofia Romano',    plan: 'pro',  schoolId: 'NA002' });
    const s1 = this.getUserByEmail('seller@demo.it');
    const s2 = this.getUserByEmail('seller2@demo.it');
    // Seed listings
    if (s1) {
      this.createListing({ sellerId: s1.id, schoolId: 'NA001', isbn: '9788800000003', bookTitle: 'Matematica.blu 2.0 Vol. 1', bookAuthor: 'Bergamini, Trifone, Barozzi', subject: 'Mathematics', condition: 'good', price: 14.00, description: 'Usato poco, nessuna sottolineatura' });
      this.createListing({ sellerId: s1.id, schoolId: 'NA001', isbn: '9788800000011', bookTitle: 'Grammatica Latina', bookAuthor: 'Traina & Pasqualini', subject: 'Latin', condition: 'like_new', price: 12.50, description: 'Come nuovo, acquistato e mai usato' });
      this.createListing({ sellerId: s1.id, schoolId: 'NA001', isbn: '9788800000001', bookTitle: 'Divina Commedia — Commento', bookAuthor: 'Dante Alighieri (ed. Sapegno)', subject: 'Italian Literature', condition: 'fair', price: 8.00, description: 'Qualche nota a matita' });
    }
    if (s2) {
      this.createListing({ sellerId: s2.id, schoolId: 'NA002', isbn: '9788800000007', bookTitle: 'Biologia — La scienza della vita', bookAuthor: 'Campbell & Reece', subject: 'Biology', condition: 'good', price: 18.00, description: 'Ottime condizioni' });
      this.createListing({ sellerId: s2.id, schoolId: 'NA002', isbn: '9788800000009', bookTitle: 'Storia Moderna Vol. 1', bookAuthor: 'Braudel', subject: 'History', condition: 'like_new', price: 14.50 });
    }
    this._set('mb_seeded_v2', true);
  },
};

// ─── UTILITY ─────────────────────────────────────────────────────────────────

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getSchoolById(id) { return SCHOOLS_DB.find(s => s.id === id) || null; }
function getSchoolsByCity(city) { return SCHOOLS_DB.filter(s => s.city === city); }
function getSchoolsByRegion(region) { return SCHOOLS_DB.filter(s => s.region === region); }
function getAllCities() { return [...new Set(SCHOOLS_DB.map(s => s.city))].sort(); }

// Init
DB.seed();