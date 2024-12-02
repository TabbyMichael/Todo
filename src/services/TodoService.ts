import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface TodoItem {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  tags: string[];
  type: 'task' | 'event' | 'note' | 'project' | 'timer' | 'upload' | 'chat';
  completed: boolean;
  createdAt: string;
}

interface TodoDB extends DBSchema {
  todos: {
    key: string;
    value: TodoItem;
    indexes: {
      'by-date': string;
      'by-type': string;
      'by-category': string;
    };
  };
}

class TodoService {
  private db: IDBPDatabase<TodoDB> | null = null;
  private dbName = 'todo-app-db';
  private version = 1;

  async initialize() {
    if (!this.db) {
      this.db = await openDB<TodoDB>(this.dbName, this.version, {
        upgrade(db) {
          const todoStore = db.createObjectStore('todos', {
            keyPath: 'id',
          });
          todoStore.createIndex('by-date', 'date');
          todoStore.createIndex('by-type', 'type');
          todoStore.createIndex('by-category', 'category');
        },
      });
    }
    return this.db;
  }

  async addTodo(todo: TodoItem): Promise<string> {
    const db = await this.initialize();
    await db.add('todos', todo);
    return todo.id;
  }

  async updateTodo(todo: TodoItem): Promise<void> {
    const db = await this.initialize();
    await db.put('todos', todo);
  }

  async deleteTodo(id: string): Promise<void> {
    const db = await this.initialize();
    await db.delete('todos', id);
  }

  async getTodo(id: string): Promise<TodoItem | undefined> {
    const db = await this.initialize();
    return db.get('todos', id);
  }

  async getAllTodos(): Promise<TodoItem[]> {
    const db = await this.initialize();
    return db.getAll('todos');
  }

  async getTodosByDate(date: string): Promise<TodoItem[]> {
    const db = await this.initialize();
    const index = db.transaction('todos').store.index('by-date');
    return index.getAll(date);
  }

  async getTodosByType(type: TodoItem['type']): Promise<TodoItem[]> {
    const db = await this.initialize();
    const index = db.transaction('todos').store.index('by-type');
    return index.getAll(type);
  }

  async getTodosByCategory(category: string): Promise<TodoItem[]> {
    const db = await this.initialize();
    const index = db.transaction('todos').store.index('by-category');
    return index.getAll(category);
  }

  async toggleTodoCompletion(id: string): Promise<void> {
    const db = await this.initialize();
    const todo = await this.getTodo(id);
    if (todo) {
      todo.completed = !todo.completed;
      await this.updateTodo(todo);
    }
  }

  async searchTodos(query: string): Promise<TodoItem[]> {
    const db = await this.initialize();
    const todos = await this.getAllTodos();
    const searchTerm = query.toLowerCase();
    
    return todos.filter(todo => 
      todo.title.toLowerCase().includes(searchTerm) ||
      todo.description?.toLowerCase().includes(searchTerm) ||
      todo.category.toLowerCase().includes(searchTerm) ||
      todo.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }
}

export const todoService = new TodoService();
export type { TodoItem };
