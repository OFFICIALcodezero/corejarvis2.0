
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, Check, Clock, AlertTriangle, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string | null;
  created_at: string;
}

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    due_date: ''
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('business_tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive"
      });
    } else {
      setTasks(data || []);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive"
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('business_tasks')
      .insert([{ 
        ...formData, 
        user_id: user.id,
        due_date: formData.due_date || null
      }]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Task added successfully"
      });
      setIsAddDialogOpen(false);
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        due_date: ''
      });
      fetchTasks();
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    const { error } = await supabase
      .from('business_tasks')
      .update({ status: newStatus })
      .eq('id', taskId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive"
      });
    } else {
      fetchTasks();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <Check className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Task Management</h3>
          <p className="text-gray-400">Organize and track your business tasks</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-white gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-white/20 text-white">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Task Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-black/30 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-black/30 border-white/20 text-white"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value as Task['priority'] })}>
                  <SelectTrigger className="bg-black/30 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="bg-black/30 border-white/20 text-white"
                />
              </div>
              <Button onClick={handleSubmit} className="w-full bg-cyan-500 hover:bg-cyan-600">
                Add Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-black/30 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-white">{pendingTasks.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-black/30 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">In Progress</p>
                <p className="text-2xl font-bold text-white">{inProgressTasks.length}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-black/30 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-2xl font-bold text-white">{completedTasks.length}</p>
              </div>
              <Check className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Tasks */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Pending
          </h4>
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <Card key={task.id} className="bg-black/30 border-white/20 hover:border-yellow-500/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-white">{task.title}</h5>
                    <Badge className={`${getPriorityColor(task.priority)} text-white text-xs`}>
                      {task.priority}
                    </Badge>
                  </div>
                  {task.description && (
                    <p className="text-sm text-gray-400 mb-3">{task.description}</p>
                  )}
                  {task.due_date && (
                    <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                      <Calendar className="h-3 w-3" />
                      {new Date(task.due_date).toLocaleDateString()}
                    </div>
                  )}
                  <Button
                    size="sm"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => updateTaskStatus(task.id, 'in_progress')}
                  >
                    Start Task
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* In Progress Tasks */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            In Progress
          </h4>
          <div className="space-y-3">
            {inProgressTasks.map((task) => (
              <Card key={task.id} className="bg-black/30 border-white/20 hover:border-blue-500/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-white">{task.title}</h5>
                    <Badge className={`${getPriorityColor(task.priority)} text-white text-xs`}>
                      {task.priority}
                    </Badge>
                  </div>
                  {task.description && (
                    <p className="text-sm text-gray-400 mb-3">{task.description}</p>
                  )}
                  {task.due_date && (
                    <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                      <Calendar className="h-3 w-3" />
                      {new Date(task.due_date).toLocaleDateString()}
                    </div>
                  )}
                  <Button
                    size="sm"
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => updateTaskStatus(task.id, 'completed')}
                  >
                    Complete Task
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Completed Tasks */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            Completed
          </h4>
          <div className="space-y-3">
            {completedTasks.map((task) => (
              <Card key={task.id} className="bg-black/30 border-white/20 hover:border-green-500/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-white line-through opacity-60">{task.title}</h5>
                    <Badge className="bg-green-500 text-white text-xs">
                      Done
                    </Badge>
                  </div>
                  {task.description && (
                    <p className="text-sm text-gray-400 mb-3 opacity-60">{task.description}</p>
                  )}
                  {task.due_date && (
                    <div className="flex items-center gap-1 text-xs text-gray-400 opacity-60">
                      <Calendar className="h-3 w-3" />
                      {new Date(task.due_date).toLocaleDateString()}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
