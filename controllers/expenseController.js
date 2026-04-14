const ExpenseModel = require('../models/expenseModel');

exports.createExpense = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { title, amount, category, date, notes } = req.body;

    if (!title || !amount) {
      return res.status(400).json({ error: 'Title and amount are required' });
    }

    const newExpense = await ExpenseModel.create(userId, {
      title,
      amount: parseFloat(amount),
      category: category || 'General',
      date: date || new Date().toISOString(),
      notes: notes || ''
    });

    res.status(201).json(newExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create expense' });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const userId = req.user.uid;
    const expenses = await ExpenseModel.getAll(userId);
    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve expenses' });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { id } = req.params;
    const updateData = req.body;

    // Optional validation logic here

    const updatedExpense = await ExpenseModel.update(userId, id, updateData);
    res.status(200).json(updatedExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { id } = req.params;

    await ExpenseModel.delete(userId, id);
    res.status(200).json({ message: 'Expense deleted successfully', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
};
