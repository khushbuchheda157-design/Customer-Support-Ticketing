const express = require('express');
const router = express.Router();
const db = require('../db');

// helper for email format checking
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// 1. POST /api/tickets
router.post('/', (req, res) => {
  const { customer_name, customer_email, subject, description, priority } = req.body;

  // Validation
  if (!customer_name || !customer_name.trim()) {
    return res.status(400).json({ error: 'Customer name is required.' });
  }
  if (!customer_email || !customer_email.trim() || !isValidEmail(customer_email)) {
    return res.status(400).json({ error: 'A valid customer email is required.' });
  }
  if (!subject || !subject.trim()) {
    return res.status(400).json({ error: 'Subject is required.' });
  }
  if (!description || !description.trim()) {
    return res.status(400).json({ error: 'Description is required.' });
  }

  const cleanPriority = ['Low', 'Medium', 'High'].includes(priority) ? priority : 'Medium';

  try {
    // Generate ticket_id atomically in a transaction
    const insertTicket = db.transaction(() => {
      // Find maximum id to ensure sequential generation
      const row = db.prepare('SELECT MAX(id) as maxId FROM tickets').get();
      const nextId = (row.maxId || 0) + 1;
      const ticketId = `TKT-${String(nextId).padStart(3, '0')}`;

      const stmt = db.prepare(`
        INSERT INTO tickets (ticket_id, customer_name, customer_email, subject, description, status, priority)
        VALUES (?, ?, ?, ?, ?, 'Open', ?)
      `);
      
      stmt.run(ticketId, customer_name.trim(), customer_email.trim(), subject.trim(), description.trim(), cleanPriority);
      
      // Get the created_at timestamp
      const createdRow = db.prepare('SELECT created_at FROM tickets WHERE ticket_id = ?').get(ticketId);
      return { ticketId, created_at: createdRow.created_at };
    });

    const result = insertTicket();
    res.status(201).json({ ticket_id: result.ticketId, created_at: result.created_at });
  } catch (error) {
    console.error('Error inserting ticket:', error);
    res.status(500).json({ error: 'Database error occurred while creating ticket.' });
  }
});

// 2. GET /api/tickets
router.get('/', (req, res) => {
  const { status, priority, search } = req.query;

  let query = `
    SELECT ticket_id, customer_name, customer_email, subject, description, status, priority, created_at, updated_at
    FROM tickets
    WHERE 1=1
  `;
  const params = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  if (priority) {
    query += ' AND priority = ?';
    params.push(priority);
  }

  if (search) {
    const searchWildcard = `%${search}%`;
    query += `
      AND (
        customer_name LIKE ? 
        OR customer_email LIKE ? 
        OR ticket_id LIKE ? 
        OR subject LIKE ? 
        OR description LIKE ?
      )
    `;
    params.push(searchWildcard, searchWildcard, searchWildcard, searchWildcard, searchWildcard);
  }

  query += ' ORDER BY created_at DESC';

  try {
    const rows = db.prepare(query).all(...params);
    res.json(rows);
  } catch (error) {
    console.error('Error querying tickets:', error);
    res.status(500).json({ error: 'Database error occurred while fetching tickets.' });
  }
});

// 3. GET /api/tickets/:ticket_id
router.get('/:ticket_id', (req, res) => {
  const ticketId = req.params.ticket_id;

  try {
    const ticket = db.prepare(`
      SELECT ticket_id, customer_name, customer_email, subject, description, status, priority, created_at, updated_at
      FROM tickets
      WHERE ticket_id = ?
    `).get(ticketId);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found.' });
    }

    const notes = db.prepare(`
      SELECT note_text, created_at
      FROM notes
      WHERE ticket_id = ?
      ORDER BY created_at DESC
    `).all(ticketId);

    res.json({
      ...ticket,
      notes
    });
  } catch (error) {
    console.error('Error fetching ticket detail:', error);
    res.status(500).json({ error: 'Database error occurred while fetching ticket detail.' });
  }
});

// 4. PUT /api/tickets/:ticket_id
router.put('/:ticket_id', (req, res) => {
  const ticketId = req.params.ticket_id;
  const { status, priority, note_text } = req.body;

  try {
    const updateTransaction = db.transaction(() => {
      // Confirm ticket exists
      const ticket = db.prepare('SELECT id FROM tickets WHERE ticket_id = ?').get(ticketId);
      if (!ticket) {
        throw new Error('NOT_FOUND');
      }

      const updates = [];
      const values = [];

      if (status) {
        if (!['Open', 'In Progress', 'Closed'].includes(status)) {
          throw new Error('INVALID_STATUS');
        }
        updates.push('status = ?');
        values.push(status);
      }

      if (priority) {
        if (!['Low', 'Medium', 'High'].includes(priority)) {
          throw new Error('INVALID_PRIORITY');
        }
        updates.push('priority = ?');
        values.push(priority);
      }

      // Always update updated_at if anything changes
      if (updates.length > 0 || note_text) {
        updates.push('updated_at = CURRENT_TIMESTAMP');
      }

      if (updates.length > 0) {
        const stmt = db.prepare(`
          UPDATE tickets 
          SET ${updates.join(', ')} 
          WHERE ticket_id = ?
        `);
        stmt.run(...values, ticketId);
      }

      if (note_text && note_text.trim()) {
        const stmt = db.prepare(`
          INSERT INTO notes (ticket_id, note_text)
          VALUES (?, ?)
        `);
        stmt.run(ticketId, note_text.trim());
      }

      const updatedRow = db.prepare('SELECT updated_at FROM tickets WHERE ticket_id = ?').get(ticketId);
      return updatedRow.updated_at;
    });

    const updatedAt = updateTransaction();
    res.json({ success: true, updated_at: updatedAt });
  } catch (error) {
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({ error: 'Ticket not found.' });
    }
    if (error.message === 'INVALID_STATUS') {
      return res.status(400).json({ error: 'Invalid status value. Must be Open, In Progress, or Closed.' });
    }
    if (error.message === 'INVALID_PRIORITY') {
      return res.status(400).json({ error: 'Invalid priority value. Must be Low, Medium, or High.' });
    }
    console.error('Error updating ticket:', error);
    res.status(500).json({ error: 'Database error occurred while updating ticket.' });
  }
});

module.exports = router;
