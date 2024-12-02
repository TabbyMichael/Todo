import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface TaskHistoryDB extends DBSchema {
  tasks: {
    key: string;
    value: TaskRecord;
    indexes: {
      'by-date': Date;
      'by-category': string;
    };
  };
  categories: {
    key: string;
    value: CategoryRecord;
  };
}

export interface TaskRecord {
  id: string;
  title: string;
  description?: string;
  date: Date;
  duration: number;
  category: string;
  isRecurring: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  notes?: string;
  timeTracking?: {
    startTime: Date;
    endTime: Date;
    breaks: Array<{ start: Date; end: Date }>;
  }[];
}

interface CategoryRecord {
  id: string;
  name: string;
  color: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

class TaskHistoryService {
  private db: IDBPDatabase<TaskHistoryDB> | null = null;
  private readonly DB_NAME = 'task-history-db';
  private readonly VERSION = 1;

  async initialize(): Promise<void> {
    this.db = await openDB<TaskHistoryDB>(this.DB_NAME, this.VERSION, {
      upgrade(db) {
        // Create tasks store with indexes
        const taskStore = db.createObjectStore('tasks', {
          keyPath: 'id',
        });
        taskStore.createIndex('by-date', 'date');
        taskStore.createIndex('by-category', 'category');

        // Create categories store
        db.createObjectStore('categories', {
          keyPath: 'id',
        });
      },
    });
  }

  async addTask(task: Omit<TaskRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!this.db) await this.initialize();

    const id = crypto.randomUUID();
    const now = new Date();
    const taskRecord: TaskRecord = {
      ...task,
      id,
      createdAt: now,
      updatedAt: now,
    };

    await this.db!.add('tasks', taskRecord);
    return id;
  }

  async updateTask(id: string, updates: Partial<TaskRecord>): Promise<void> {
    if (!this.db) await this.initialize();

    const task = await this.db!.get('tasks', id);
    if (!task) throw new Error('Task not found');

    const updatedTask: TaskRecord = {
      ...task,
      ...updates,
      updatedAt: new Date(),
    };

    await this.db!.put('tasks', updatedTask);
  }

  async getTasksByDateRange(start: Date, end: Date): Promise<TaskRecord[]> {
    if (!this.db) await this.initialize();

    const tasks = await this.db!.getAllFromIndex('tasks', 'by-date');
    return tasks.filter(
      (task) => task.date >= start && task.date <= end
    );
  }

  async getTasksByCategory(category: string): Promise<TaskRecord[]> {
    if (!this.db) await this.initialize();

    return this.db!.getAllFromIndex('tasks', 'by-category', category);
  }

  async searchTasks(query: string): Promise<TaskRecord[]> {
    if (!this.db) await this.initialize();

    const tasks = await this.db!.getAll('tasks');
    const searchTerms = query.toLowerCase().split(' ');

    return tasks.filter((task) =>
      searchTerms.every(
        (term) =>
          task.title.toLowerCase().includes(term) ||
          task.description?.toLowerCase().includes(term) ||
          task.notes?.toLowerCase().includes(term) ||
          task.tags?.some((tag) => tag.toLowerCase().includes(term))
      )
    );
  }

  async addCategory(category: Omit<CategoryRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!this.db) await this.initialize();

    const id = crypto.randomUUID();
    const now = new Date();
    const categoryRecord: CategoryRecord = {
      ...category,
      id,
      createdAt: now,
      updatedAt: now,
    };

    await this.db!.add('categories', categoryRecord);
    return id;
  }

  async getAllCategories(): Promise<CategoryRecord[]> {
    if (!this.db) await this.initialize();

    return this.db!.getAll('categories');
  }

  async getTaskHistory(taskId: string): Promise<TaskRecord['timeTracking']> {
    if (!this.db) await this.initialize();

    const task = await this.db!.get('tasks', taskId);
    return task?.timeTracking || [];
  }

  async addTimeTrackingEntry(
    taskId: string,
    entry: { startTime: Date; endTime: Date; breaks: Array<{ start: Date; end: Date }> }
  ): Promise<void> {
    if (!this.db) await this.initialize();

    const task = await this.db!.get('tasks', taskId);
    if (!task) throw new Error('Task not found');

    const timeTracking = task.timeTracking || [];
    timeTracking.push(entry);

    await this.updateTask(taskId, { timeTracking });
  }

  async getTaskStats(taskId: string): Promise<{
    totalTime: number;
    averageSessionTime: number;
    totalBreakTime: number;
    completionRate: number;
  }> {
    if (!this.db) await this.initialize();

    const task = await this.db!.get('tasks', taskId);
    if (!task) throw new Error('Task not found');

    const timeTracking = task.timeTracking || [];
    
    const totalTime = timeTracking.reduce(
      (total, session) => total + (session.endTime.getTime() - session.startTime.getTime()),
      0
    );

    const totalBreakTime = timeTracking.reduce(
      (total, session) =>
        total +
        session.breaks.reduce(
          (breakTotal, breakPeriod) =>
            breakTotal + (breakPeriod.end.getTime() - breakPeriod.start.getTime()),
          0
        ),
      0
    );

    return {
      totalTime,
      averageSessionTime: timeTracking.length ? totalTime / timeTracking.length : 0,
      totalBreakTime,
      completionRate: task.completed ? 1 : 0, // This can be enhanced with historical completion data
    };
  }
}

export const taskHistoryService = new TaskHistoryService();
