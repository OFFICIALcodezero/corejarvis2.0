
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Calendar, Flag, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    status: 'pending' as 'pending' | 'in_progress' | 'completed',
    due_date: ''
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('jarvis_tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data as Task[] || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      if (editingTask) {
        const { error } = await supabase
          .from('jarvis_tasks')
          .update(formData)
          .eq('id', editingTask.id);

        if (error) throw error;
        toast.success('Task updated successfully');
      } else {
        const { error } = await supabase
          .from('jarvis_tasks')
          .insert([{ ...formData, user_id: user.id }]);

        if (error) throw error;
        toast.success('Task added successfully');
      }

      setFormData({ title: '', description: '', priority: 'medium', status: 'pending', due_date: '' });
      setIsAddDialogOpen(false);
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Failed to save task');
    }
  };

  const toggleTaskStatus = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    
    try {
      const { error } = await supabase
        .from('jarvis_tasks')
        .update({ status: newStatus })
        .eq('id', task.id);

      if (error) throw error;
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      status: task.status,
      due_date: task.due_date || ''
    });
    setIsAddDialogOpen(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Task Manager</h2>
          <p className="text-gray-400">Organize and track your tasks efficiently</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Task Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                className="bg-gray-800 border-gray-600 text-white"
              />
              <Textarea
                placeholder="Task Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white"
                rows={3}
              />
              <div className="grid grid-cols-2 gap-4">
                <Select value={formData.priority} onValueChange={(value: 'high' | 'medium' | 'low') => setFormData({...formData, priority: value})}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={formData.status} onValueChange={(value: 'pending' | 'in_progress' | 'completed') => setFormData({...formData, status: value})}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white"
              />
              <Button type="submit" className="w-full">
                {editingTask ? 'Update Task' : 'Add Task'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{taskStats.total}</div>
            <p className="text-gray-400 text-sm">Total Tasks</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-400">{taskStats.pending}</div>
            <p className="text-gray-400 text-sm">Pending</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-400">{taskStats.in_progress}</div>
            <p className="text-gray-400 text-sm">In Progress</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-400">{taskStats.completed}</div>
            <p className="text-gray-400 text-sm">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        {['all', 'pending', 'in_progress', 'completed'].map((filterOption) => (
          <Button
            key={filterOption}
            variant={filter === filterOption ? 'default' : 'outline'}
            onClick={() => setFilter(filterOption as any)}
            className="capitalize"
          >
            {filterOption === 'in_progress' ? 'In Progress' : filterOption}
          </Button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className={`bg-gray-800 border-gray-700 ${task.status === 'completed' ? 'opacity-75' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <Checkbox
                    checked={task.status === 'completed'}
                    onCheckedChange={() => toggleTaskStatus(task)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <h3 className={`font-semibold text-white ${task.status === 'completed' ? 'line-through' : ''}`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-gray-400 text-sm mt-1">{task.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2">
                      <Badge className={getPriorityColor(task.priority)}>
                        <Flag className="w-3 h-3 mr-1" />
                        {task.priority}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(task.status)}
                        <span className="text-sm text-gray-400 capitalize">
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                      {task.due_date && (
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <Calendar className="w-3 h-3" />
                          {new Date(task.due_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(task)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">
              {filter === 'all' ? 'No tasks yet. Add your first task to get started.' : `No ${filter.replace('_', ' ')} tasks.`}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TaskManager;
