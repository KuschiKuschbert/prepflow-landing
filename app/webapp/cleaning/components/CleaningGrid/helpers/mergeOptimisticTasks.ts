import type { TaskWithCompletions } from '@/lib/cleaning/completion-logic';

interface OptimisticCompletion {
  completed: boolean;
  tempId?: string;
}

export function mergeOptimisticTasks(
  tasks: TaskWithCompletions[],
  optimisticCompletions: Map<string, OptimisticCompletion>,
  dates: string[],
): TaskWithCompletions[] {
  return tasks.map(task => {
    const optimisticCompletionsForTask: typeof task.completions = [];

    dates.forEach(date => {
      const key = `${task.id}_${date}`;
      const optimistic = optimisticCompletions.get(key);

      if (optimistic) {
        if (optimistic.completed) {
          // Add optimistic completion
          optimisticCompletionsForTask.push({
            id: optimistic.tempId || `temp-${task.id}-${date}`,
            task_id: task.id,
            completion_date: date,
            completed_at: new Date().toISOString(),
          });
        }
        // If optimistic.completed is false, don't include completion (it's removed)
      } else {
        // Use original completion if no optimistic change
        const original = task.completions.find(c => c.completion_date === date);
        if (original) {
          optimisticCompletionsForTask.push(original);
        }
      }
    });

    return {
      ...task,
      completions: optimisticCompletionsForTask,
    };
  });
}
