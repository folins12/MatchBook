// MatchBook — db.js
// Scalable mock database for Italian high school textbook trading

'use strict';

// ─── PLATFORM CONSTANTS ──────────────────────────────────────────────────────

// Flat fee added on top of the book price for every purchase.
// Waived for PRO subscribers. Used in the listing detail modal
// and in transaction creation.
const BUYER_FEE = 1.00;

// PRO subscription — paid once a year, grants:
//   • no buyer fee on book purchases (saves BUYER_FEE per transaction)
//   • PRO_FREE_BOOSTS free listing boosts on signup
const PRO_PRICE = 5.00;
const PRO_FREE_BOOSTS = 5;

// Cost a free user pays to boost a single listing to the top of their school's
// search list. PRO subscribers spend a free boost first; once those run out
// they fall back to paying BOOST_FEE per boost like everyone else.
const BOOST_FEE = 1.50;

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
  { id: 'RM010', name: 'Liceo Democrito', city: 'Roma', province: 'RM', region: 'Lazio', lat: 41.7889, lng: 12.3556 },
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

// `cost` = cover list price in EUR (new). Used to calculate the maximum
// resale price (50% of list) when a seller creates a listing via ISBN.
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
      plan: data.plan || 'free', // 'free' | 'pro'
      role: data.role || 'user', // 'user' | 'admin'
      // PRO members get PRO_FREE_BOOSTS bundled boosts on signup; free users start with 0.
      freeBoosts: (data.plan === 'pro') ? PRO_FREE_BOOSTS : 0,
      proSince: (data.plan === 'pro') ? Date.now() : null,
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
  // Atomically upgrade a user to PRO: charge them PRO_PRICE from balance,
  // flip the plan flag, top up their free-boost bank by PRO_FREE_BOOSTS,
  // and stamp proSince. Returns { user } on success or { error } otherwise.
  upgradeToPro(userId) {
    const user = this.getUserById(userId);
    if (!user) return { error: 'User not found' };
    if (user.plan === 'pro') return { error: 'Already on PRO' };
    if (user.balance < PRO_PRICE) return { error: 'Insufficient balance' };
    const updated = this.updateUser(userId, {
      plan: 'pro',
      balance: parseFloat((user.balance - PRO_PRICE).toFixed(2)),
      freeBoosts: (user.freeBoosts || 0) + PRO_FREE_BOOSTS,
      proSince: Date.now(),
    });
    return { user: updated };
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
      boosted: false, // priority boost — pins to the top in Browse and My Listings
      createdAt: Date.now(),
    };
    listings.push(listing);
    this.saveListings(listings);
    return listing;
  },
  // Turn boost ON for a listing. Consumes a free boost if the seller has any
  // (PRO bundle), otherwise debits BOOST_FEE from their balance.
  // Returns { listing, paidWith: 'free' | 'balance' } on success, { error } otherwise.
  enableBoost(listingId, userId) {
    const listings = this.getListings();
    const idx = listings.findIndex(l => l.id === listingId);
    if (idx === -1) return { error: 'Listing not found' };
    if (listings[idx].sellerId !== userId) return { error: 'Not your listing' };
    if (listings[idx].boosted) return { error: 'Already boosted' };

    const user = this.getUserById(userId);
    if (!user) return { error: 'User not found' };

    // Prefer free boosts (PRO bundle) over charging the balance.
    if ((user.freeBoosts || 0) > 0) {
      this.updateUser(userId, { freeBoosts: user.freeBoosts - 1 });
      listings[idx].boosted = true;
      this.saveListings(listings);
      return { listing: listings[idx], paidWith: 'free' };
    }

    if (user.balance < BOOST_FEE) return { error: 'Insufficient balance' };
    this.updateUser(userId, { balance: parseFloat((user.balance - BOOST_FEE).toFixed(2)) });
    listings[idx].boosted = true;
    this.saveListings(listings);
    return { listing: listings[idx], paidWith: 'balance' };
  },
  // Turn boost OFF — free. Doesn't refund anything (consistent with real ad-platform logic).
  disableBoost(listingId, userId) {
    const listings = this.getListings();
    const idx = listings.findIndex(l => l.id === listingId);
    if (idx === -1) return { error: 'Listing not found' };
    if (listings[idx].sellerId !== userId) return { error: 'Not your listing' };
    listings[idx].boosted = false;
    this.saveListings(listings);
    return { listing: listings[idx] };
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
    // PRO buyers don't pay the platform's flat buyer fee. The fee is snapshotted
    // into the transaction at creation time so a later plan change doesn't
    // retroactively alter the price of an already-created deal.
    const buyer = this.getUserById(buyerId);
    const fee = (buyer && buyer.plan === 'pro') ? 0 : BUYER_FEE;
    const txn = {
      id: 'txn_' + Date.now() + Math.random().toString(36).slice(2, 7),
      buyerId, sellerId, listingId,
      // Snapshot the book title onto the transaction. After a dispute the
      // listing may be wiped from the listings table; without this snapshot
      // the buyer's transaction history would just say "Unknown book".
      bookTitle: listing.bookTitle,
      bookPrice: listing.price,
      buyerFee: fee,
      // totalPrice = book price + buyer fee. The buyer pays this whole amount
      // online in a single step — no deposit, no in-person cash.
      totalPrice: parseFloat((listing.price + fee).toFixed(2)),
      status: 'pending_payment', // pending_payment → paid → completed | disputed | refunded
      paidAt: null,
      completedAt: null,
      disputedAt: null,
      refundedAt: null,
      createdAt: Date.now(),
    };
    txns.push(txn);
    this.saveTransactions(txns);
    return txn;
  },
  payNow(txnId) {
    const txns = this.getTransactions();
    const idx = txns.findIndex(t => t.id === txnId);
    if (idx === -1) return { error: 'Transaction not found' };
    const txn = txns[idx];
    if (txn.status !== 'pending_payment') return { error: 'Invalid state' };
    const buyer = this.getUserById(txn.buyerId);
    // Full online payment = book price + buyer fee, paid in one go.
    const amount = txn.totalPrice;
    if (!buyer || buyer.balance < amount) return { error: 'Insufficient balance' };
    this.updateUser(txn.buyerId, { balance: parseFloat((buyer.balance - amount).toFixed(2)) });
    txns[idx] = { ...txn, status: 'paid', paidAt: Date.now() };
    this.saveTransactions(txns);
    this.updateListing(txn.listingId, { status: 'reserved' });
    return { txn: txns[idx] };
  },
  confirmTransaction(txnId) {
    const txns = this.getTransactions();
    const idx = txns.findIndex(t => t.id === txnId);
    if (idx === -1) return { error: 'Not found' };
    const txn = txns[idx];
    if (txn.status !== 'paid') return { error: 'Invalid state' };
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
    if (txn.status !== 'paid') return { error: 'Invalid state' };

    // 1) Refund the buyer the full amount they paid online, since the seller
    //    is at fault. The refund matches what payNow debited.
    const buyer = this.getUserById(txn.buyerId);
    const refundAmount = txn.totalPrice;
    if (buyer) this.updateUser(txn.buyerId, { balance: parseFloat((buyer.balance + refundAmount).toFixed(2)) });

    // 2) Wipe out every listing the banned seller had. The platform can no
    //    longer vouch for any book they were selling — they're gone too.
    const survivingListings = this.getListings().filter(l => l.sellerId !== txn.sellerId);
    this.saveListings(survivingListings);

    // 3) Mark this transaction as refunded/disputed.
    txns[idx] = { ...txn, status: 'refunded', refundedAt: Date.now(), disputedAt: Date.now() };
    this.saveTransactions(txns);

    // 4) Ban the seller — delete the account record outright. Auth's login
    //    flow falls back to "Invalid email or password" because getUserByEmail
    //    will return null, so the seller can never log back in with those creds.
    this.deleteUser(txn.sellerId);

    return { txn: txns[idx] };
  },

  // ── Admin / Metrics helpers ─────────────────────────────────────────────────
  isAdmin(user) {
    const u = user || this.currentUser();
    return !!(u && u.role === 'admin');
  },
  getMetrics() { return this._get('mb_metrics', null); },

  // ── Seed ─────────────────────────────────────────────────────────────────────
  // Single-school deployment: MatchBook piloted at "Liceo Democrito" (QR code on the
  // school notice board). Everything below is generated deterministically so the demo
  // is stable across reloads, and the dashboard snapshot (mb_metrics) is kept aligned
  // with the shape of this seeded data.
  seed() {
    const SEED_KEY = 'mb_seeded_v5';
    if (this._get(SEED_KEY)) return;
    // Wipe any previous schema/data so we start clean on the Democrito deployment.
    ['mb_users','mb_listings','mb_conversations','mb_transactions','mb_session',
     'mb_metrics','mb_waitlist','mb_seeded','mb_seeded_v2','mb_seeded_v3','mb_seeded_v4']
      .forEach(k => localStorage.removeItem(k));

    const SCHOOL = 'RM010';            // Liceo Democrito
    const now = Date.now();
    const DAY = 86400000;

    // Deterministic PRNG (mulberry32) — fixed seed → stable demo data.
    let _s = 0x6d2b79f5 ^ 20260601;
    const rnd = () => { _s |= 0; _s = (_s + 0x6D2B79F5) | 0; let t = Math.imul(_s ^ (_s >>> 15), 1 | _s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
    const ri = (min, max) => Math.floor(rnd() * (max - min + 1)) + min;
    const shuffle = (arr) => { const a = arr.slice(); for (let k = a.length - 1; k > 0; k--) { const r = Math.floor(rnd() * (k + 1)); [a[k], a[r]] = [a[r], a[k]]; } return a; };
    // pick a createdAt timestamp inside a [minDaysAgo, maxDaysAgo] window
    const tsAgo = (minD, maxD) => now - Math.floor((minD + rnd() * (maxD - minD)) * DAY);

    const FIRST_M = ['Lorenzo','Matteo','Francesco','Alessandro','Andrea','Leonardo','Riccardo','Tommaso','Gabriele','Edoardo','Davide','Giovanni','Federico','Marco','Simone','Pietro','Giulio','Antonio','Filippo','Nicolo','Samuele','Christian','Diego','Emanuele','Vincenzo'];
    const FIRST_F = ['Sofia','Giulia','Aurora','Alice','Ginevra','Emma','Greta','Martina','Chiara','Sara','Beatrice','Anna','Vittoria','Ludovica','Gaia','Noemi','Elena','Francesca','Camilla','Bianca','Rebecca','Alessia','Matilde','Viola','Arianna'];
    const SURNAMES = ['Di Nobile','Morgante','Tomei','Mannato','Liberato','Rendesi','Coratella','Zuzzolo','Vernazza','Jeses','Giovanardi','Mansutti','Giordani','Rolla','Tamburro','De Vita','Scibetta','Rotaru','Risa','Paolantoni','Antonini','Di Cicco','Pagetto','Massaro','Pinchiurri','Belleggia','Monti','Troiano','Scevola','Casucci','Petrolati','Mioli','Fincato','Chinelli','Tonti','Peperoni','Valentini','Iozza','Celletti','Amore','Tanari','Vacca','Schirinzi','Capurro','Alonge','Garibaldi','Capozza','Pierpaoli','Colombo','Di Gregorio','Gervasoni','Gurrieri','Nesbitt','Tozzi','Grossi','Fioravanti','Scarcella','De Siena','Cappelli','Schembri','Ortuso','Bertaccini','Altavilla','Olini','Raso','Cartocci','Mazzocchi','Germano','Facchini','Martegiani','Benvenuti','Coria','Maralli','Ravanello','Pavia','Limongi','Conti','Pansini','Buti','Golinelli','Gatti','Ilari','Iossa','Ridolfi','Mollichelli','Carlucci','Rauso','Lombardo','Queirolo','Lagna','Punti','Pezzella','Pozzi','De Blasis','Arnedo','Daniello','Fanello','Monaco','Misino','Momigliano','Pennesi','Tassara','Scarchilli','Ruotolo','Cauli','Compagnoni','Bellanti','Gorini','Rizzo','Capuano','Aureli','Nenni','Curiale','Pennestri','Mori','Neri','Chiantini','Canepa','Cingolani','Parisi','Libori','Gambale','Duca','Battistelli','Barducci','Recchioni','Catella','Vitali','Bilancio','Gilestri','Ruberti','Mulas','Ortenzi','Mollica','De Giovanni','Giannotti','Angiolosanto','Di Panfilo','Macro','Barbara','Capaccioli','Capobianco','Arduini','Alonzo','Giannico','Livraga','Pagliaroli','Frabetti','Massasso','Noseda','Sartori','Codacci','Sandonato','Mottola','Scagliarini','Improta','Scheri','Minighini','Migani','Longo','Gualdi','Fiore','Orlandi','Nota','Bisceglia','Maccallini','Lippucci','Capitolo','Cornacchini','Feroleto','Melli','Marini','Finocchietti','Zaffari','Palaia','Pucci','Vinciarelli','Corsetti'];

    const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z]/g,'');

    // ── USERS ──────────────────────────────────────────────────────────────────
    // 70 students "school-linked" (all-time). createdAt windows engineered so the
    // marketplace feels like it filled up gradually: 27 in last 7d, +23 in 8-30d,
    // +20 in 31-48d. Plus 1 admin (founder) account.
    const users = [];
    const usedEmails = new Set();
    const N_STUDENTS = 70;

    // Admin / founder — only this account can open the Metrics Dashboard.
    users.push({
      id: 'u_admin', email: 'admin@matchbook.it', password: 'admin1234',
      name: 'MatchBook Admin', plan: 'pro', role: 'admin', freeBoosts: 5,
      proSince: now - 60 * DAY, schoolId: SCHOOL, balance: 200, penaltyCount: 0,
      createdAt: now - 50 * DAY, active: true,
    });

    // Friendly demo student — ties to the dashboard hero ("Giulia and N others").
    const giulia = {
      id: 'u_giulia', email: 'giulia@demo.it', password: 'demo1234',
      name: 'Giulia Morgante', plan: 'free', role: 'user', freeBoosts: 0,
      proSince: null, schoolId: SCHOOL, balance: 200, penaltyCount: 0,
      createdAt: tsAgo(1, 6), active: true,
    };
    users.push(giulia);
    usedEmails.add('giulia@demo.it'); usedEmails.add('admin@matchbook.it');

    const surn = shuffle(SURNAMES);
    let si = 0;
    for (let n = 1; n < N_STUDENTS; n++) {            // 69 more → 70 students total
      const female = rnd() < 0.52;
      const first = female ? pick(FIRST_F) : pick(FIRST_M);
      const surname = surn[si++ % surn.length];
      let email = slug(first) + '.' + slug(surname) + '@studenti.democrito.it';
      let g = 2; while (usedEmails.has(email)) { email = slug(first) + '.' + slug(surname) + g + '@studenti.democrito.it'; g++; }
      usedEmails.add(email);
      // window assignment: indexes 0..26 → 7d, 27..49 → 8-30d, 50..68 → 31-48d
      let createdAt;
      if (n <= 26)      createdAt = tsAgo(1, 6);
      else if (n <= 49) createdAt = tsAgo(8, 29);
      else              createdAt = tsAgo(31, 47);
      users.push({
        id: 'u_d' + n, email, password: 'demo1234',
        name: first + ' ' + surname, plan: 'free', role: 'user', freeBoosts: 0,
        proSince: null, schoolId: SCHOOL, balance: 200, penaltyCount: 0,
        createdAt, active: true,
      });
    }

    // Monetization signals: ~9 PRO upgrades + ~11 free users who boosted a listing
    // → ~20 distinct "monetizers" all-time (aligns with the 28% headline KPI).
    const studentIdxs = users.map((u, idx) => idx).filter(idx => users[idx].role === 'user');
    const proPicks = shuffle(studentIdxs).slice(0, 9);
    proPicks.forEach(idx => {
      users[idx].plan = 'pro';
      users[idx].freeBoosts = ri(1, 5);
      users[idx].proSince = users[idx].createdAt + ri(1, 5) * DAY;
    });
    const proSet = new Set(proPicks);
    const boosterIdxs = shuffle(studentIdxs.filter(idx => !proSet.has(idx))).slice(0, 11);

    this.saveUsers(users);

    // ── LISTINGS ───────────────────────────────────────────────────────────────
    // 31 distinct sellers, ~55 listings. Booster users always have ≥1 boosted listing.
    const books = BOOKS_DB;
    const conditions = ['new', 'like_new', 'good', 'fair'];
    const descs = ['Lightly used, no underlining', 'Like new, barely opened', 'Some pencil notes inside',
      'Good condition, cover a bit worn', 'A few highlighted pages', 'Excellent condition', '', '',
      'Comes with the workbook', 'No missing pages'];
    const listings = [];
    let lid = 1;
    const sellerPool = shuffle(studentIdxs).slice(0, 31);     // 31 sellers
    // make sure every booster is also a seller
    boosterIdxs.forEach(b => { if (!sellerPool.includes(b)) sellerPool.push(b); });

    sellerPool.forEach((uIdx, k) => {
      const u = users[uIdx];
      const count = ri(1, 3);
      const isBooster = boosterIdxs.includes(uIdx) || u.plan === 'pro';
      for (let c = 0; c < count; c++) {
        const b = pick(books);
        const maxPrice = +(b.cost * 0.5).toFixed(2);
        const price = +(Math.max(2, maxPrice * (0.45 + rnd() * 0.5))).toFixed(2);
        const finalPrice = Math.min(price, maxPrice);
        // listing creation time ≥ the seller's signup time
        const minDaysAgo = Math.max(1, Math.round((now - u.createdAt) / DAY) - 2);
        const createdAt = u.createdAt + Math.floor(rnd() * Math.max(1, (now - u.createdAt) * 0.6));
        listings.push({
          id: 'lst_' + lid++, sellerId: u.id, schoolId: SCHOOL, isbn: b.isbn,
          bookTitle: b.title, bookAuthor: b.author, subject: b.subject,
          condition: pick(conditions), price: finalPrice, description: pick(descs),
          status: 'active', boosted: (isBooster && c === 0), createdAt,
        });
      }
    });
    this.saveListings(listings);

    // ── TRANSACTIONS ─────────────────────────────────────────────────────────────
    // Build a believable purchase history. All-time targets: 60 purchases started,
    // 39 paid, with most of those completed. Buyers ≠ sellers, same school.
    const txns = [];
    const convos = [];
    let tid = 1, cid = 1;
    const buyerPool = shuffle(studentIdxs);
    const activeListings = listings.filter(l => l.status === 'active');
    const shuffledListings = shuffle(activeListings);
    const N_TXN = 52;
    let bI = 0;
    for (let t = 0; t < N_TXN && t < shuffledListings.length; t++) {
      const listing = shuffledListings[t];
      // find a buyer who isn't the seller
      let buyer = null, tries = 0;
      do { buyer = users[buyerPool[bI++ % buyerPool.length]]; tries++; } while (buyer.id === listing.sellerId && tries < 10);
      if (buyer.id === listing.sellerId) continue;
      const fee = buyer.plan === 'pro' ? 0 : BUYER_FEE;
      const createdAt = listing.createdAt + Math.floor(rnd() * Math.max(1, (now - listing.createdAt) * 0.8));
      // status distribution: ~ 30 completed, ~9 paid (awaiting handover), rest unpaid
      let status, listingStatus;
      const roll = rnd();
      if (t < 30)       { status = 'completed';       listingStatus = 'sold'; }
      else if (t < 39)  { status = 'paid';            listingStatus = 'reserved'; }
      else              { status = 'pending_payment'; listingStatus = 'active'; }
      // reflect status onto the listing
      const lref = listings.find(l => l.id === listing.id);
      if (lref) lref.status = listingStatus;
      txns.push({
        id: 'txn_' + (tid++), buyerId: buyer.id, sellerId: listing.sellerId, listingId: listing.id,
        bookTitle: listing.bookTitle, bookPrice: listing.price, buyerFee: fee,
        totalPrice: +(listing.price + fee).toFixed(2),
        status,
        paidAt: status === 'pending_payment' ? null : createdAt + ri(1, 3) * 3600000,
        completedAt: status === 'completed' ? createdAt + ri(1, 4) * DAY : null,
        disputedAt: null, refundedAt: null, createdAt,
      });
    }

    // Make sure the demo student Giulia has visible history: one completed buy + one
    // awaiting-handover, plus a sale where she is the seller.
    const giuliaBuy = listings.find(l => l.sellerId !== giulia.id && l.status === 'active');
    if (giuliaBuy) {
      giuliaBuy.status = 'sold';
      txns.push({
        id: 'txn_' + (tid++), buyerId: giulia.id, sellerId: giuliaBuy.sellerId, listingId: giuliaBuy.id,
        bookTitle: giuliaBuy.bookTitle, bookPrice: giuliaBuy.price, buyerFee: BUYER_FEE,
        totalPrice: +(giuliaBuy.price + BUYER_FEE).toFixed(2),
        status: 'completed',
        paidAt: now - 4 * DAY, completedAt: now - 3 * DAY, disputedAt: null, refundedAt: null,
        createdAt: now - 5 * DAY,
      });
    }

    // Persist the sold/reserved/active status changes the transactions imply.
    this.saveListings(listings);
    this.saveTransactions(txns);

    // ── A FEW CONVERSATIONS (so Messages isn't empty in the demo) ────────────────
    const openers = ['Ciao! Il libro è ancora disponibile?', 'Hi! Is this still available?',
      'Ci possiamo vedere a scuola per lo scambio?', 'Posso passare a prenderlo domani?'];
    const replies = ['Sì, ancora disponibile!', 'Certo, ci vediamo all\u2019intervallo.',
      'Perfetto, ti aspetto davanti all\u2019ingresso.', 'Disponibile, fammi sapere quando passi.'];
    const convListings = shuffle(activeListings).slice(0, 8);
    convListings.forEach(l => {
      let buyer = users[buyerPool[(bI++) % buyerPool.length]];
      if (buyer.id === l.sellerId) return;
      const created = now - ri(1, 10) * DAY;
      convos.push({
        id: 'conv_' + (cid++), buyerId: buyer.id, sellerId: l.sellerId, listingId: l.id,
        participants: [buyer.id, l.sellerId],
        messages: [
          { id: 'm' + cid + 'a', senderId: buyer.id, text: pick(openers), ts: created },
          { id: 'm' + cid + 'b', senderId: l.sellerId, text: pick(replies), ts: created + 1800000 },
        ],
        createdAt: created,
      });
    });
    // Giulia gets one conversation too
    const gl = activeListings.find(l => l.sellerId !== giulia.id);
    if (gl) {
      const created = now - 2 * DAY;
      convos.push({
        id: 'conv_' + (cid++), buyerId: giulia.id, sellerId: gl.sellerId, listingId: gl.id,
        participants: [giulia.id, gl.sellerId],
        messages: [
          { id: 'mg1', senderId: giulia.id, text: 'Ciao! Il libro \u00e8 ancora disponibile?', ts: created },
          { id: 'mg2', senderId: gl.sellerId, text: 'S\u00ec! Ci vediamo a scuola domani?', ts: created + 1200000 },
        ],
        createdAt: created,
      });
    }
    this.saveConversations(convos);

    // ── DASHBOARD METRICS SNAPSHOT (admin-only Metrics Dashboard) ────────────────
    // Curated, internally-consistent snapshot for the single-school deployment.
    // d7 mirrors the agreed key-metric mockup; d30/all are larger, plausible slices
    // sized to a ~100-student school whose whole community gradually came on board.
    const metrics = {
      school: 'Liceo Democrito',
      windows: {
        d7: {
          label: 'Last 7 days', signups: 37, monetizers: 7,
          funnel: { visitors: 142, signupStarted: 37, schoolLinked: 27, postedBook: 12, clickedReserve: 23, paidDeposit: 15 },
          funnelPct: { signupStarted: 26, schoolLinked: 73, postedBook: 32, clickedReserve: 85, paidDeposit: 65 },
          kpi: { activation: 73, listing: 32, escrow: 65, monetization: 28 },
          engagement: { reserveClicks: 41, boostOpened: 9, proCtaTapped: 12, avgTimeToListing: '4.2', repeatSessions: 18, activeSellers: 7 },
        },
        d30: {
          label: '1 month', signups: 68, monetizers: 13,
          funnel: { visitors: 224, signupStarted: 68, schoolLinked: 49, postedBook: 21, clickedReserve: 41, paidDeposit: 27 },
          funnelPct: { signupStarted: 30, schoolLinked: 72, postedBook: 31, clickedReserve: 84, paidDeposit: 66 },
          kpi: { activation: 72, listing: 31, escrow: 66, monetization: 27 },
          engagement: { reserveClicks: 73, boostOpened: 16, proCtaTapped: 21, avgTimeToListing: '4.6', repeatSessions: 34, activeSellers: 13 },
        },
        all: {
          label: 'Always', signups: 96, monetizers: 20,
          funnel: { visitors: 312, signupStarted: 96, schoolLinked: 70, postedBook: 31, clickedReserve: 60, paidDeposit: 39 },
          funnelPct: { signupStarted: 31, schoolLinked: 73, postedBook: 32, clickedReserve: 86, paidDeposit: 65 },
          kpi: { activation: 73, listing: 32, escrow: 65, monetization: 28 },
          engagement: { reserveClicks: 118, boostOpened: 27, proCtaTapped: 34, avgTimeToListing: '4.4', repeatSessions: 71, activeSellers: 31 },
        },
      },
    };
    this._set('mb_metrics', metrics);

    this._set(SEED_KEY, true);
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