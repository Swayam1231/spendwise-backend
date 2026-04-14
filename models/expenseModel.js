const { db } = require('../config/firebase');

class ExpenseModel {
  static getCollection(userId) {
    return db.collection('users').doc(userId).collection('expenses');
  }

  static async create(userId, expenseData) {
    const expenseRef = await this.getCollection(userId).add({
      ...expenseData,
      createdAt: new Date().toISOString()
    });
    return { id: expenseRef.id, ...expenseData };
  }

  static async getAll(userId) {
    const snapshot = await this.getCollection(userId).orderBy('createdAt', 'desc').get();
    let expenses = [];
    snapshot.forEach(doc => {
      expenses.push({ id: doc.id, ...doc.data() });
    });
    return expenses;
  }

  static async update(userId, expenseId, updateData) {
    await this.getCollection(userId).doc(expenseId).update(updateData);
    return { id: expenseId, ...updateData };
  }

  static async delete(userId, expenseId) {
    await this.getCollection(userId).doc(expenseId).delete();
    return { id: expenseId };
  }
}

module.exports = ExpenseModel;
